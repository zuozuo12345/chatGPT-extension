import axios, { AxiosError } from "axios";
import {
  SCOUT_NOT_CONSENTED_MESSAGE,
  SCOUT_SESSION_EXPIRED_MESSAGE,
  SCOUT_WEB_URL,
} from "../../../scripts/scout/settings";
import { CANDIDATE_DETAILS_TYPE } from "../../../typescript/types/candidate";

import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

interface showCandidateDetailsProps {
  access_token?: string;
  candidateLinkedinUsername?: string;
}

export async function showCandidateDetails(props: showCandidateDetailsProps) {
  try {
    const { access_token = null, candidateLinkedinUsername = null } = props;

    if (!access_token || !candidateLinkedinUsername) {
      throw "No access token or candidate id";
    }

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/extension/candidate/unlock`,
      {
        username: candidateLinkedinUsername,
      },
      {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return {
      status: response.status,
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

interface passSerialisedMonsterSiteBodyProps {
  access_token?: string;
  serialisedBody?: string;
  current_url?: string;
}

interface passSerialisedMonsterSiteBodyAxiosResponse {
  candidateProfile: CANDIDATE_DETAILS_TYPE;
}

export async function passSerialisedMonsterSiteBody(
  props: passSerialisedMonsterSiteBodyProps
) {
  try {
    const {
      access_token = null,
      serialisedBody = null,
      current_url = null,
    } = props;

    if (!access_token || !serialisedBody) {
      throw "No access token or serialised body";
    }

    // `http://localhost:3000/api/scout/monster`
    // `${SCOUT_WEB_URL}api/scout/monster`

    const response =
      await axios.post<passSerialisedMonsterSiteBodyAxiosResponse>(
        `${SCOUT_WEB_URL}api/scout/monster`,
        {
          serialisedBody,
          access_token,
          current_url,
        },
        {
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

    return response.data;
  } catch (error) {
    throw error;
  }
}

interface shortlistCandidateArgs {
  access_token: string;
  profile_id: string;
  job_id: string;
}

export async function shortlistCandidate(props: shortlistCandidateArgs) {
  try {
    const { access_token = null, profile_id = null, job_id = null } = props;

    if (!access_token || !profile_id || !job_id) {
      throw "No access token or candidate id";
    }

    const response = await axiosScoutBaseBackendInstance.get(
      `/api/scout/data/extension/candidate/shortlist?profile_id=${profile_id}&job_id=${job_id}`,
      {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return {
      status: response.status,
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
