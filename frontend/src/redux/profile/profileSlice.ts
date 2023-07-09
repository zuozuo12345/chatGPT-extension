import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

import { STORED_CANDIDATE_DATA_TYPE } from "../../typescript/types/candidate";

interface profileSliceInterface {
  username: {
    linkedin: string;
  };
  details: {
    profileUsername: {
      linkedin: string;
    };
    profileDetails: STORED_CANDIDATE_DATA_TYPE;
  };
}

export const profileSlice = createSlice({
  name: "app",
  initialState: {
    username: {
      linkedin: null,
    },
    details: {
      profileUsername: {
        linkedin: null,
      },
      profileDetails: null,
    },
  } as profileSliceInterface,
  reducers: {
    setProfileLinkedinUsername: (
      state,
      action: {
        payload: string;
      }
    ) => {
      if (!_.isEqual(action.payload, state.username.linkedin)) {
        state.username.linkedin = action.payload ?? null;
      }
    },
    setProfileDetails: (
      state,
      action: {
        payload: {
          username?: string;
          details: STORED_CANDIDATE_DATA_TYPE;
        };
      }
    ) => {
      state.details.profileUsername.linkedin = action.payload.username
        ? action.payload.username
        : action.payload.username === undefined &&
          state.username &&
          state.username.linkedin
        ? state.username.linkedin
        : null;
      state.details.profileDetails = action.payload.details;
    },
    updateSpecificJobSummary: (
      state,
      action: {
        payload: {
          jobIndex: number;
          summary: string;
        };
      }
    ) => {
      if (
        state.details.profileDetails &&
        state.details.profileDetails.jobs &&
        state.details.profileDetails.jobs.length > 0
      ) {
        state.details.profileDetails.jobs[action.payload.jobIndex].summary =
          action.payload.summary;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setProfileLinkedinUsername,
  setProfileDetails,
  updateSpecificJobSummary,
} = profileSlice.actions;

export default profileSlice.reducer;
