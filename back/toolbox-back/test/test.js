import chai from "chai";
import chaiHttp from "chai-http";
import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";
import express from "express";
import router from "../src/routes/files.js";
chai.use(chaiHttp);

const filesRouter = router;

export function appTests() {
  return describe("Files API Tests", () => {
    let app;
    let server;
    let sandbox;

    before(() => {
      app = express();
      app.use("/files", filesRouter);
      server = app.listen(4000);
    });

    after(() => {
      server.close();
    });

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe("Files API Functionality", () => {
      it("GET /files/list should return file list", async () => {
        const mockFiles = ["file1.csv", "file2.csv"];
        sandbox.stub(axios, "get").resolves({ data: { files: mockFiles } });

        const res = await chai.request(server).get("/files/list");
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal(mockFiles);
      });

      it("GET /files/list should handle errors", async () => {
        sandbox.stub(axios, "get").rejects(new Error("Fetch error"));

        const res = await chai.request(server).get("/files/list");
        expect(res.status).to.equal(500);
        expect(res.body).to.have.property("error", "Failed to fetch file list");
      });

      it("GET /files/data should return processed file data", async () => {
        const mockFiles = ["file1.csv"];
        const mockFileContent =
          "file,text,number,hex\nfile1.csv,sample,123,abcdef1234567890abcdef1234567890";

        sandbox
          .stub(axios, "get")
          .onFirstCall()
          .resolves({ data: { files: mockFiles } })
          .onSecondCall()
          .resolves({ data: mockFileContent });

        const res = await chai.request(server).get("/files/data");
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([
          {
            file: "file1.csv",
            lines: [
              {
                text: "sample",
                number: 123,
                hex: "abcdef1234567890abcdef1234567890",
              },
            ],
          },
        ]);
      });

      it("GET /files/data should skip malformed rows", async () => {
        const mockFiles = ["file1.csv"];
        const mockFileContent =
          "file,text,number,hex\nfile1.csv,valid,123,abcdef1234567890abcdef1234567890\nfile1.csv,invalid,,,,";

        sandbox
          .stub(axios, "get")
          .onFirstCall()
          .resolves({ data: { files: mockFiles } })
          .onSecondCall()
          .resolves({ data: mockFileContent });

        const res = await chai.request(server).get("/files/data");
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal([
          {
            file: "file1.csv",
            lines: [
              {
                text: "valid",
                number: 123,
                hex: "abcdef1234567890abcdef1234567890",
              },
            ],
          },
        ]);
      });

      it("GET /files/data should handle errors gracefully", async () => {
        sandbox.stub(axios, "get").rejects(new Error("Fetch error"));

        const res = await chai.request(server).get("/files/data");
        expect(res.status).to.equal(500);
        expect(res.body).to.have.property("error", "Failed to process files");
      });
    });
  });
}
