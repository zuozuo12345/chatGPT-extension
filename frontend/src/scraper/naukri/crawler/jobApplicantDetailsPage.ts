import queryString from "query-string";
import { saveNaukriProfileDetails } from "../../../api/scout/candidate/create";

import { NAUKRI_JOB_APPLICANT_USER_DATA_TYPE } from "../../../typescript/types/naukri/job_applicant";

import { FIXED_NAUKRI_HEADERS } from "../utils";

export async function fetchJobApplicantDetailsThruApi() {
  const currentUrl = window.location.pathname;
  const splitCurrentUrl = currentUrl.split("/");
  const naukriCookie = document.cookie;

  const jobApplicantUserId =
    splitCurrentUrl &&
    splitCurrentUrl["4"] !== undefined &&
    !isNaN(parseInt(splitCurrentUrl[4]))
      ? splitCurrentUrl["4"]
      : null;

  const parsedUrl = queryString.parse(window.location.search);
  const searchId =
    parsedUrl && "searchId" in parsedUrl ? `${parsedUrl["searchId"]}` : null;

  try {
    const getCandidateDetailResponse = await fetch(
      `https://hiring.naukri.com/cloudgateway-jobposting/jplite-rm-services/v0/rm/rmsproxy/v0/rms-profile-retrieval-services/v0/response-manager/applications/${jobApplicantUserId}?searchId=${searchId}`,
      {
        headers: {
          ...FIXED_NAUKRI_HEADERS,
          cookie: `${naukriCookie}`,
          Referer: `${window.location.href}`,
        },
        body: null,
        method: "GET",
      }
    );
    const parsedGetCandidateDetailResponse: NAUKRI_JOB_APPLICANT_USER_DATA_TYPE =
      await getCandidateDetailResponse.json();

    const result_ = {
      jobApplicantDetail: parsedGetCandidateDetailResponse,
    };

    const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

    if (storageResponse["scoutWebToken"]) {
      await saveNaukriProfileDetails({
        access_token: storageResponse["scoutWebToken"],
        profileData: parsedGetCandidateDetailResponse,
      });
    }

    return result_;
  } catch (error) {
    return {
      jobApplicantDetail: null,
    };
  }
}
