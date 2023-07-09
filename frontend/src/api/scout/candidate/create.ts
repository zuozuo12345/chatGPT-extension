import { ENV_MODE } from "../../../scripts/scout/settings";
import { RECOMMENDED_CANDIDATE_DATA_TYPE } from "../../../typescript/types/candidate";
import { SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE } from "../../../typescript/types/linkedin/searched_profile";
import {
  NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE,
  NAUKRI_JOB_APPLICANT_USER_DATA_TYPE,
  SAVED_NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE,
} from "../../../typescript/types/naukri/job_applicant";
import { SCOUT_API_URL } from "../../../scripts/scout/settings";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

interface generateCandidateWriteUpInterface {
  access_token?: string;
  recommended_candidate_id?: string;
}

export async function generateCandidateWriteUp(
  props: generateCandidateWriteUpInterface
): Promise<{
  candidateData: RECOMMENDED_CANDIDATE_DATA_TYPE;
}> {
  const { access_token = null, recommended_candidate_id = null } = props;

  try {
    if (!access_token || !recommended_candidate_id) {
      throw "No access token or recommended candidate id";
    }

    const response = await axiosScoutBaseBackendInstance.get(
      `api/scout/data/jobs/recommendation/summary/${recommended_candidate_id}?consented_summary_disclaimer=true`,
      {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return {
      candidateData: response.data,
    };
  } catch (error) {
    throw error;
  }
}

interface outlookInitialConversationWithCandidateeInterface {
  access_token?: string;
  recommendation_id?: string;
}

export async function outlookInitialConversationWithCandidate(
  props: outlookInitialConversationWithCandidateeInterface
) {
  const { access_token = null, recommendation_id = null } = props;

  try {
    if (!access_token || !recommendation_id) {
      throw "No access token";
    }

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/nurture/schedule-nurturing-email/${recommendation_id}`,
      {},
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
    throw error;
  }
}

interface saveLinkedinRpsSearchResultInterface {
  access_token?: string;
  elements: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE[];
}

export async function saveLinkedinRpsSearchResult(
  args: saveLinkedinRpsSearchResultInterface
) {
  const { access_token = null, elements = null } = args;

  try {
    if (!access_token || !elements) {
      throw "No access token or no search result";
    }

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/extension/talent-linkedin-member-profiles`,
      {
        elements: ENV_MODE === "staging" ? elements.slice(0, 5) : elements,
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
    throw error;
  }
}

// add new urls
interface SaveLinkedinScrapUserLinksSearchResultInterface {
  access_token?: string;
  urls: string[];
  source: string;
}

export async function saveLinkedinScrapUserLinksSearchResult(
  args: SaveLinkedinScrapUserLinksSearchResultInterface
) {
  try {
    const { access_token = null, urls = null, source = null } = args;

    if (!access_token || !urls) {
      throw new Error("No access token or linkedin public urls");
    }

    const payload = {
      urls: urls,
      source: source,
    };

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      `${SCOUT_API_URL}api/scout/data/extension/talent-linkedin-tape`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }

    return response.status;
  } catch (error) {
    return 0;
  }
}

interface saveNaukriSearchResultInteface {
  access_token?: string;
  list?: NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE["applications"];
}

export async function saveNaukriSearchResult(
  args: saveNaukriSearchResultInteface
) {
  const { access_token, list = [] } = args;

  try {
    if (!access_token || list.length === 0) {
      throw "No access token or no search result";
    }

    const payload = list
      .map((result) => {
        return result
          ? ({
              clientId: result.clientId ?? null,
              currentStatus: result.currentStatus ?? null,
              profileId: result.profileId ?? null,
              candidateId: result.candidateId ?? null,
              photo: result.photo ?? null,
              addedOn: result.addedOn ?? null,
              name: result.name ?? null,
              profileSummary: result.profileSummary ?? null,
              email:
                result.email &&
                typeof result.email === "object" &&
                result.email.length > 0
                  ? result.email
                      .map((email) => {
                        return email
                          ? {
                              value: email.value ?? null,
                              isPrimary: email.isPrimary ?? false,
                            }
                          : null;
                      })
                      .filter((item) => item !== null && item.value !== null)
                  : [],
              phoneNumber:
                result.phoneNumber &&
                typeof result.phoneNumber === "object" &&
                result.phoneNumber.length > 0
                  ? result.phoneNumber
                      .map((phoneNumber) => {
                        return phoneNumber
                          ? {
                              value: phoneNumber.value ?? null,
                              isPrimary: phoneNumber.isPrimary ?? false,
                            }
                          : null;
                      })
                      .filter((item) => item !== null && item.value !== null)
                  : [],
              companyName: result.companyName ?? null,
              currentCity: result.currentCity ?? null,
              preferredLocations: result.preferredLocations ?? null,
              role: result.role ?? null,
              industry: result.industry ?? null,
              experience: result.experience ?? null,
              workExp:
                result.workExp &&
                typeof result.workExp === "object" &&
                result.workExp.length > 0
                  ? result.workExp
                      .map((workExp) => {
                        return workExp
                          ? {
                              designation: workExp.designation ?? null,
                              company: workExp.company ?? null,
                              jobProfile: workExp.jobProfile ?? null,
                              noticePeriod: workExp.noticePeriod ?? null,
                              workingFrom: workExp.workingFrom ?? null,
                              workingTo: workExp.workingTo ?? null,
                              current: workExp.current ?? null,
                            }
                          : null;
                      })
                      .filter(
                        (item) =>
                          item !== null &&
                          item.company !== null &&
                          item.designation !== null
                      )
                  : [],
              education:
                result.education &&
                typeof result.education === "object" &&
                result.education.length > 0
                  ? result.education
                  : [],
              highestDegree: result.highestDegree ?? null,
              keySkills: result.keySkills ?? null,
              skills: [],
            } as SAVED_NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE)
          : null;
      })
      .filter(
        (item) =>
          item !== null && item.candidateId !== null && item.name !== null
      );

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/extension/naukri/candidate/list`,
      payload,
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
    throw error;
  }
}

interface saveNaukriProfileDetailsInterface {
  access_token?: string;
  profileData?: NAUKRI_JOB_APPLICANT_USER_DATA_TYPE;
}

export async function saveNaukriProfileDetails(
  args: saveNaukriProfileDetailsInterface
) {
  const { access_token, profileData = null } = args;

  try {
    if (!access_token || profileData === null) {
      throw "No access token or no profile data";
    }

    const payload: SAVED_NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE = {
      clientId: profileData.clientId ?? null,
      currentStatus: profileData.currentStatus ?? null,
      profileId: profileData.profileId ?? null,
      candidateId: profileData.candidateId ?? null,
      photo: profileData.photo ?? null,
      addedOn: profileData.addedOn ?? null,
      name: profileData.name ?? null,
      profileSummary: profileData.profileSummary ?? null,
      email:
        profileData.email &&
        typeof profileData.email === "object" &&
        profileData.email.length > 0
          ? profileData.email
              .map((email) => {
                return email
                  ? {
                      value: email.value ?? null,
                      isPrimary: email.isPrimary ?? false,
                    }
                  : null;
              })
              .filter((item) => item !== null && item.value !== null)
          : [],
      phoneNumber:
        profileData.phoneNumber &&
        typeof profileData.phoneNumber === "object" &&
        profileData.phoneNumber.length > 0
          ? profileData.phoneNumber
              .map((phoneNumber) => {
                return phoneNumber
                  ? {
                      value: phoneNumber.value ?? null,
                      isPrimary: phoneNumber.isPrimary ?? false,
                    }
                  : null;
              })
              .filter((item) => item !== null && item.value !== null)
          : [],
      companyName: profileData.companyName ?? null,
      currentCity: profileData.currentCity ?? null,
      preferredLocations: profileData.preferredLocations ?? null,
      role: profileData.role ?? null,
      industry: profileData.industry ?? null,
      experience: profileData.experience ?? null,
      workExp:
        profileData.workExp &&
        typeof profileData.workExp === "object" &&
        profileData.workExp.length > 0
          ? profileData.workExp
              .map((workExp) => {
                return workExp
                  ? {
                      designation: workExp.designation ?? null,
                      company: workExp.company ?? null,
                      jobProfile: workExp.jobProfile ?? null,
                      noticePeriod: workExp.noticePeriod ?? null,
                      workingFrom: workExp.workingFrom ?? null,
                      workingTo: workExp.workingTo ?? null,
                      current: workExp.current ?? null,
                    }
                  : null;
              })
              .filter(
                (item) =>
                  item !== null &&
                  item.company !== null &&
                  item.designation !== null
              )
          : [],
      education:
        profileData.education &&
        typeof profileData.education === "object" &&
        profileData.education.length > 0
          ? profileData.education
          : [],
      highestDegree: profileData.highestDegree ?? null,
      keySkills: profileData.keySkills ?? null,
      skills:
        profileData.skills &&
        typeof profileData.skills === "object" &&
        profileData.skills.length > 0
          ? profileData.skills
          : [],
    };

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/extension/naukri/candidate`,
      payload,
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
    throw error;
  }
}
