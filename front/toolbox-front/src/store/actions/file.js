import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3001";

export const getFiles = createAsyncThunk(
  "file/getFiles",
  async (file, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/files/data${file ? `?fileName=${file}` : ""}`
      );
      const data = await response.json();

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
      const response = await fetch(`${API_URL}/files/list`);
      const list = await response.json();
      return list;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unexpected Error"
      );
    }
  }
);
