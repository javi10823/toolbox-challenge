import { combineReducers } from "@reduxjs/toolkit";
import { file } from "./slices";

const rootReducer = combineReducers({
  file,
});

export default rootReducer;
