import moment from "moment";
import { saveNaukriSearchResult } from "../../../api/scout/candidate/create";

import {
  NAUKRI_JOB_COUNT_DATA_TYPE,
  NAUKRI_JOB_DATA,
} from "../../../typescript/types/naukri/job";
import { NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE } from "../../../typescript/types/naukri/job_applicant";
import {
  NAUKRI_APPLICANT_LIST_COUNT,
  FIXED_NAUKRI_HEADERS,
  getDefaultJobApplicantListFilter,
  NAUKRI_PAGE_REFERENCE,
} from "../utils";

export async function fetchApplicantListThruApi() {
  const currentUrl = window.location.href;
  const splitCurrentUrl = currentUrl.split("/");
  const momentNow = moment();
  const naukriCookie = document.cookie;

  try {
    const jobId = splitCurrentUrl[4];

    const getJobDataReesponse = await fetch(
      `https://hiring.naukri.com/cloudgateway-jobposting/job-services/v1/job/${jobId}`,
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
    const parseGetJobDataReesponse: NAUKRI_JOB_DATA =
      await getJobDataReesponse.json();

    const companyId = parseGetJobDataReesponse.companyId;
    const createdByUserId = parseGetJobDataReesponse.createdBy;
    //new Date(Date.now() - 7776e6).getTime()
    const fromDate = moment(new Date(Date.now() - 7776e6))
      .utc()
      .valueOf();
    const toDate = momentNow.utc().valueOf();

    const getJobApplicantCountResponse = await fetch(
      `https://hiring.naukri.com/cloudgateway-rm/rms-profile-retrieval-services/v0/infographics/clients/${companyId}/recruiters/${createdByUserId}/jobs/${jobId}/applyCount?applyDateFrom=${fromDate}&applyDateTo=${toDate}`,
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
    const parsedGetJobApplicantCountResponse: NAUKRI_JOB_COUNT_DATA_TYPE =
      await getJobApplicantCountResponse.json();
    const totalApplicant = parsedGetJobApplicantCountResponse.allAppliesCount;
    const totalPages = Math.ceil(totalApplicant / NAUKRI_APPLICANT_LIST_COUNT);

    const result_: {
      jobApplicants: NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE["applications"];
    } = {
      jobApplicants: [],
    };

    const promises = await Promise.all([
      ...Array.from(Array(totalPages).keys()).map(async (item, index) => {
        const response = await fetch(
          `https://hiring.naukri.com/cloudgateway-jobposting/jplite-rm-services/v0/rm/rmsproxy/v0/rms-profile-retrieval-services/v0/response-manager/jobs/${jobId}/inbox`,
          {
            headers: {
              ...FIXED_NAUKRI_HEADERS,
              cookie: `${naukriCookie}`,
              Referer: `${currentUrl}`,
            },
            body: JSON.stringify({
              pageReference: `${NAUKRI_PAGE_REFERENCE}`,
              filters: {
                ...getDefaultJobApplicantListFilter(fromDate, toDate),
              },
              pagination: {
                pageNo: item + 1,
                pageSize: NAUKRI_APPLICANT_LIST_COUNT,
              },
              sort: { sortBy: "APPLY_DATE", orderBy: "DESC" },
              refreshLastVisit: false,
            }),
            method: "POST",
          }
        );
        const parsedResponse: NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE =
          await response.json();

        return {
          result: parsedResponse.applications,
        };
      }),
    ]);

    promises.forEach((promise) => {
      result_.jobApplicants = [...result_.jobApplicants, ...promise.result];
    });

    const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

    if (storageResponse["scoutWebToken"]) {
      await saveNaukriSearchResult({
        access_token: storageResponse["scoutWebToken"],
        list: result_.jobApplicants,
      });
    }

    return result_;
  } catch (error) {
    return {
      jobApplicants: null,
    };
  }
}
