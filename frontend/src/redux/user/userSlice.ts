import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { USER_DETAILS_DATA_TYPE } from "../../typescript/v2/user";
import { NORMALISED_JOB_LISTING_DATA_TYPE } from "../../typescript/v2/job";

interface userSliceInterface {
  accessToken: string;
  consented: boolean;
  details: USER_DETAILS_DATA_TYPE;
  job: {
    list: NORMALISED_JOB_LISTING_DATA_TYPE;
  };
  interface: {
    selectedJobMatchingId: string;
  };
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    accessToken: null,
    consented: false,
    details: null,
    job: {
      list: null,
    },
    interface: {
      selectedJobMatchingId: null,
    },
  } as userSliceInterface,
  reducers: {
    setUserAccessToken: (
      state,
      action: {
        payload: userSliceInterface["accessToken"];
      }
    ) => {
      if (action.payload !== state.accessToken) {
        state.accessToken = action.payload ?? null;
      }
    },
    setUserBasicData: (
      state,
      action: {
        payload: {
          accessToken?: userSliceInterface["accessToken"];
          consented?: userSliceInterface["consented"];
          details?: userSliceInterface["details"];
        };
      }
    ) => {
      const { accessToken, consented, details } = action.payload;

      if (accessToken !== state.accessToken) {
        state.accessToken = accessToken ?? null;
      }
      if (consented !== state.consented) {
        state.consented = consented ?? false;
      }
      if (details !== state.details) {
        state.details = details ?? null;
      }
    },
    updateUserDetails: (
      state,
      action: {
        payload: userSliceInterface["details"];
      }
    ) => {
      state.details = action.payload ?? state.details;
    },
    setUserJobList: (
      state,
      action: {
        payload: userSliceInterface["job"]["list"];
      }
    ) => {
      state.job.list = action.payload ?? null;
    },
    setSelectedJobMatchingId: (
      state,
      action: {
        payload: string;
      }
    ) => {
      state.interface.selectedJobMatchingId = action.payload ?? null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserAccessToken,
  setUserBasicData,
  updateUserDetails,
  setUserJobList,
  setSelectedJobMatchingId,
} = userSlice.actions;

export default userSlice.reducer;
