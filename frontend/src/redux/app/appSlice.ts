import { createSlice } from "@reduxjs/toolkit";
import { SESSION_ORIGIN_TYPE } from "../../typescript/v2/session";

interface appSliceInterface {
  init: boolean;
  serviceUnavailable: boolean;
  globalLoading: boolean;
  sessionOrigin: SESSION_ORIGIN_TYPE;
}

export const appSlice = createSlice({
  name: "app",
  initialState: {
    init: false,
    serviceUnavailable: false,
    globalLoading: false,
    sessionOrigin: null,
  } as appSliceInterface,
  reducers: {
    setInitialiseState: (
      state,
      action: {
        payload: boolean;
      }
    ) => {
      if (action.payload !== state.init) {
        state.init = action.payload ?? false;
      }
    },
    setServiceUnavailable: (
      state,
      action: {
        payload: boolean;
      }
    ) => {
      if (action.payload !== state.init) {
        state.serviceUnavailable = action.payload ?? false;
      }
    },
    setAppSessionOrigin: (
      state,
      action: {
        payload: SESSION_ORIGIN_TYPE;
      }
    ) => {
      state.sessionOrigin = action.payload;
    },
    setAppGlobalLoading: (
      state,
      action: {
        payload: boolean;
      }
    ) => {
      state.globalLoading = action.payload ?? false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setInitialiseState,
  setServiceUnavailable,
  setAppSessionOrigin,
  setAppGlobalLoading,
} = appSlice.actions;

export default appSlice.reducer;
