import { createAsyncThunk } from "@reduxjs/toolkit";

const fileList = ["file1.csv", "file2.csv"];

const data = [
  {
    file: "file1.csv",
    lines: [
      {
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      },
      {
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      },
    ],
  },
  {
    file: "file2.csv",
    lines: [
      {
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      },
      {
        text: "RgTya",
        number: 64075909,
        hex: "70ad29aacf0b690b0467fe2b2767f765",
      },
    ],
  },
];

export const getFiles = createAsyncThunk(
  "file/getFiles",
  async (_, { rejectWithValue }) => {
    try {
      //   const response = await fetch("API_URL");
      //   const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unexpected Error"
      );
    }
  }
);

export const getFileList = createAsyncThunk(
  "file/getFileList",
  async (_, { rejectWithValue }) => {
    try {
      //   const response = await fetch("API_URL");
      //   const data = await response.json();
      return fileList;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unexpected Error"
      );
    }
  }
);

export const getFileByName = createAsyncThunk(
  "file/getFileByName",
  async (name, { rejectWithValue }) => {
    try {
      //   const response = await fetch("API_URL");
      //   const data = await response.json();
      return data[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unexpected Error"
      );
    }
  }
);
