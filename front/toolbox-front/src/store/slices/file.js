import { createSlice } from "@reduxjs/toolkit";
import { getFiles } from "../actions/file";

const initialState = {
  isLoadingGetFiles: false,
  errorGetFiles: null,
  files: [],
};

const fileSlice = createSlice({
  name: "file",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // getFiles
      .addCase(getFiles.pending, (state) => {
        state.isLoadingGetFiles = true;
        state.errorGetFiles = null;
      })
      .addCase(getFiles.fulfilled, (state, { payload }) => {
        state.files = payload;
        state.isLoadingGetFiles = false;
      })
      .addCase(getFiles.rejected, (state, { payload }) => {
        state.errorGetFiles = payload || null;
        state.isLoadingGetFiles = false;
      });
  },
});

export const fileState = (state) => state.file;
export default fileSlice.reducer;
