import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

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
];

export const getFiles = createAsyncThunk(
  "file/getFiles",
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.get("API_URL");

      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unexpected Error"
      );
    }
  }
);
