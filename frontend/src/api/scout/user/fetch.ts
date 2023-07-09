import { AxiosError } from "axios";
import moment from "moment";
import _ from "lodash";

import {
  SCOUT_NOT_CONSENTED_MESSAGE,
  SCOUT_SESSION_EXPIRED_MESSAGE,
} from "../../../scripts/scout/settings";
import {
  JOB_LISTING_DATA_TYPE,
  NORMALISED_JOB_LISTING_DATA_TYPE,
} from "../../../typescript/types/job";

import { USER_DETAILS_DATA_TYPE } from "../../../typescript/types/user";
import { normaliseData } from "../../../utils/normalizr";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

interface fetchJobDataInterface {
  access_token: string;
}

export async function fetchSessionUserData({
  access_token = null,
}: fetchJobDataInterface): Promise<{
  userData: USER_DETAILS_DATA_TYPE;
  userConsent: boolean;
}> {
  try {
    if (!access_token) {
      throw "No access token";
    }

    const response =
      await axiosScoutBaseBackendInstance.get<USER_DETAILS_DATA_TYPE>(
        `api/scout/auth/me`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
    const data = response.data;

    return {
      userData: data,
      userConsent: true,
    };
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      if (
        err.response.status === 401 ||
        err.response["message"] === "Signature has expired"
      ) {
        throw SCOUT_SESSION_EXPIRED_MESSAGE;
      }

      if (
        err.response.status === 402 &&
        err.response["data"] &&
        err.response["data"]["detail"] === SCOUT_NOT_CONSENTED_MESSAGE
      ) {
        throw SCOUT_NOT_CONSENTED_MESSAGE;
      }
    }

    throw error;
  }
}

interface fetchJobListProps {
  access_token?: string;
}

export async function fetchJobList(props: fetchJobListProps) {
  try {
    const { access_token } = props;

    if (!access_token) {
      throw "No access token";
    }

    const response = await axiosScoutBaseBackendInstance.get<
      JOB_LISTING_DATA_TYPE[]
    >(`api/scout/data/jobs/`, {
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const normaliseJobListData: NORMALISED_JOB_LISTING_DATA_TYPE =
      normaliseData(response.data);

    // remove reverse when the timestamp is correct
    const sortedResponse = _.orderBy(
      Object.keys(normaliseJobListData)
        .reverse()
        .map((jobId) => {
          const specificJob = normaliseJobListData[jobId];

          return {
            id: jobId,
            timestamp: moment(specificJob.created_at).valueOf(),
          };
        }),
      ["timestamp"],
      ["desc"]
    );

    const payload: NORMALISED_JOB_LISTING_DATA_TYPE = {};
    sortedResponse.forEach((sortedJob) => {
      payload[sortedJob.id] = {
        ...normaliseJobListData[sortedJob.id],
      };
    });

    return {
      jobList: payload,
    };
  } catch (error) {
    return {
      jobList: {},
    };
  }
}

interface fetchIfConnectedToMsalInterface {
  access_token: string;
}

export async function fetchIfConnectedToMsal({
  access_token = null,
}: fetchIfConnectedToMsalInterface) {
  try {
    if (!access_token) {
      throw "No access token";
    }

    const response = await axiosScoutBaseBackendInstance.get(
      `api/scout/data/users/ms-oauth/token`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const data = response.data;

    return {
      isConnectedToMsal: data.is_operational,
    };
  } catch (error) {
    return {
      isConnectedToMsal: false,
    };
  }
}
