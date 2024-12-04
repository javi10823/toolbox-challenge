import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import https from "https";
import { filesController } from "../src/controllers/files.js";
import {
  processCSV,
  downloadFileData,
  fetchFileList,
} from "../src/utils/files.utils.js";

chai.use(sinonChai);
const { expect } = chai;

describe("Files API Tests", () => {
  let sandbox;

  const createMockResponse = () => ({
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  });

  const mockHttpRequest = (mockResponse) => {
    if (https.request.restore) {
      https.request.restore();
    }

    return sinon.stub(https, "request").callsFake((_, callback) => {
      const mockResponseObj = {
        on: (event, handler) => {
          if (event === "data") handler(mockResponse);
          if (event === "end") handler();
        },
      };
      callback(mockResponseObj);
      return { on: () => {}, end: () => {} };
    });
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("fetchFileList", () => {
    it("should fetch and return a list of files", async () => {
      const mockResponse = JSON.stringify({
        files: ["file1.csv", "file2.csv"],
      });
      const fetchStub = mockHttpRequest(mockResponse);

      const files = await fetchFileList();
      expect(files).to.deep.equal(["file1.csv", "file2.csv"]);
      expect(fetchStub).to.have.been.calledOnce;
    });
  });

  describe("downloadFileData", () => {
    it("should download and return file content", async () => {
      const mockResponse = "file1,text,123,abcd1234ef5678901234567890abcdef";

      const fetchStub = mockHttpRequest(mockResponse);

      const content = await downloadFileData("file1.csv");
      expect(content).to.equal(mockResponse);

      expect(fetchStub).to.have.been.calledOnce;

      fetchStub.restore();
    });
  });

  describe("processCSV", () => {
    const csvTestCases = [
      {
        description: "should process valid CSV data",
        input:
          "file,text,number,hex\nfile1.csv,hello,123,abcd1234ef5678901234567890abcdef",
        expected: [
          {
            text: "hello",
            number: 123,
            hex: "abcd1234ef5678901234567890abcdef",
          },
        ],
      },
      {
        description: "should skip malformed or invalid data",
        input: "file,text,number,hex\nfile1.csv,hello,123,invalidhex",
        expected: [],
      },
    ];

    csvTestCases.forEach(({ description, input, expected }) => {
      it(description, () => {
        const result = processCSV(input, "file1.csv");
        expect(result).to.deep.equal(expected);
      });
    });
  });

  describe("getFilesData", () => {
    let filesUtils, getFilesData;

    beforeEach(() => {
      filesUtils = {
        fetchFileList: sandbox.stub().resolves(["file1.csv"]),
        downloadFileData: sandbox
          .stub()
          .resolves("file1.csv,hello,123,abcd1234ef5678901234567890abcdef"),
        processCSV: sandbox.stub().returns([
          {
            text: "hello",
            number: 123,
            hex: "abcd1234ef5678901234567890abcdef",
          },
        ]),
      };
      ({ getFilesData } = filesController(filesUtils));
    });

    it("should process and return data for all files", async () => {
      const req = { query: {} };
      const res = createMockResponse();

      await getFilesData(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([
        {
          file: "file1.csv",
          lines: [
            {
              text: "hello",
              number: 123,
              hex: "abcd1234ef5678901234567890abcdef",
            },
          ],
        },
      ]);
    });

    it("should return an error if processing fails", async () => {
      filesUtils.fetchFileList.rejects(new Error("Fetch error"));
      const req = { query: {} };
      const res = createMockResponse();

      await getFilesData(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        error: "Failed to process files",
      });
    });
  });

  describe("getList", () => {
    let filesUtils, getList;

    beforeEach(() => {
      filesUtils = {
        fetchFileList: sandbox.stub().resolves(["file1.csv", "file2.csv"]),
        downloadFileData: sandbox
          .stub()
          .resolves("file1.csv,hello,123,abcd1234ef5678901234567890abcdef"),
        processCSV: sandbox.stub().returns([
          {
            text: "hello",
            number: 123,
            hex: "abcd1234ef5678901234567890abcdef",
          },
        ]),
      };
      ({ getList } = filesController(filesUtils));
    });

    it("should fetch and return a list of files", async () => {
      const req = {};
      const res = createMockResponse();

      await getList(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(["file1.csv", "file2.csv"]);
    });

    it("should return an error if fetching fails", async () => {
      filesUtils.fetchFileList.rejects(new Error("Fetch error"));
      const req = {};
      const res = createMockResponse();

      await getList(req, res);

      expect(res.status).to.have.been.calledWith(500);
      expect(res.json).to.have.been.calledWith({
        error: "Failed to fetch file list",
      });
    });
  });
});
