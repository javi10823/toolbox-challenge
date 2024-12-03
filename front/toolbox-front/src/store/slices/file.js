import { createSlice } from "@reduxjs/toolkit";
import { getFileList, getFiles } from "../actions/file";

const initialState = {
  isLoadingGetFiles: false,
  isLoadingGetFileList: false,
  errorGetFiles: null,
  errorGetFileList: null,
  files: [],
  fileList: [],
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
      })
      // getFileList
      .addCase(getFileList.pending, (state) => {
        state.isLoadingGetFileList = true;
        state.errorGetFileList = null;
      })
      .addCase(getFileList.fulfilled, (state, { payload }) => {
        state.fileList = payload;
        state.isLoadingGetFileList = false;
      })
      .addCase(getFileList.rejected, (state, { payload }) => {
        state.errorGetFileList = payload || null;
        state.isLoadingGetFileList = false;
      });
  },
});

export const fileState = (state) => state.file;
export default fileSlice.reducer;
