import moment from "moment";
import _ from "lodash";

import {
  JOB_LISTING_DATA_TYPE,
  NORMALISED_JOB_LISTING_DATA_TYPE,
} from "../../../typescript/types/job";
import { normaliseData } from "../../../utils/normalizr";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

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
    >(`api/ext/scout/data/jobs/`, {
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
