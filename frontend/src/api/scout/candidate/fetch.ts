import { AxiosError } from "axios";
import {
  SCOUT_API_URL,
  SCOUT_NOT_CONSENTED_MESSAGE,
  SCOUT_SESSION_EXPIRED_MESSAGE,
} from "../../../scripts/scout/settings";
import {
  CANDIDATE_DETAILS_TYPE,
  PROCESSED_CANDIDATE_DATA,
  STORED_CANDIDATE_DATA_TYPE,
} from "../../../typescript/types/candidate";
import { axiosScoutBaseBackendInstance } from "../../axiosOrder";

interface savePublicProfileArgsInterface {
  access_token: string | null;
  candidateData: CANDIDATE_DETAILS_TYPE;
}

export async function savePublicProfile(args: savePublicProfileArgsInterface) {
  const { access_token = null, candidateData = null } = args;

  try {
    if (!access_token || !candidateData) {
      throw "No access token or candidate data";
    }

    const payload = {
      profile: candidateData.profile,
      skills: candidateData.skills,
      skills_complete: candidateData.skills_complete,
      experiences: candidateData.experiences,
      experiences_complete: candidateData.experiences_complete,
      educations: candidateData.educations,
      educations_complete: candidateData.educations_complete,
      certifications: candidateData.certifications,
      certifications_complete: candidateData.certifications_complete,
      people_also_viewed_links: candidateData.people_also_viewed_links ?? [],
      recommendations: candidateData.recommendations ?? [],
      languages: candidateData.languages ?? [],
      projects: candidateData.projects ?? [],
      awards: candidateData.awards ?? [],
      volunteers: candidateData.volunteers ?? [],
      courses: candidateData.courses ?? [],
    };

    if (candidateData && candidateData.open_to_work) {
      payload["open_to_work"] = candidateData.open_to_work;
    }

    if (candidateData && candidateData.industry) {
      payload["industry"] = candidateData.industry;
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${SCOUT_API_URL}api/scout/data/extension/candidate/public`,
      requestOptions
    );

    if (response.status !== 200) {
      throw "Failed to save profile data";
    }

    const data: PROCESSED_CANDIDATE_DATA = await response.json();

    return data;
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

interface fetchPublicProfileBasedOnLinkedinUsernameArgsInterface {
  access_token: string | null;
  linkedinUsername?: string;
}

export async function fetchPublicProfileBasedOnLinkedinUsername(
  args: fetchPublicProfileBasedOnLinkedinUsernameArgsInterface
) {
  try {
    const { access_token = null, linkedinUsername = null } = args;

    if (!access_token || !linkedinUsername) {
      throw "No access token or linkedin username";
    }

    const response = await axiosScoutBaseBackendInstance.post(
      `/api/scout/data/extension/candidate`,
      {
        username: linkedinUsername,
      },
      {
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.data as STORED_CANDIDATE_DATA_TYPE;
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

interface fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApiArgsInterface {
  access_token: string | null;
  linkedinUsername?: string;
}

export async function fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApi(
  args: fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApiArgsInterface
) {
  try {
    const { access_token = null, linkedinUsername = null } = args;

    if (!access_token || !linkedinUsername) {
      throw "No access token or linkedin username";
    }

    const payload = {
      username: linkedinUsername,
    };

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${SCOUT_API_URL}api/scout/data/extension/candidate`,
      requestOptions
    );

    if (response.status !== 200) {
      throw "Failed";
    }

    const data: STORED_CANDIDATE_DATA_TYPE = await response.json();

    if (
      data &&
      data["detail"] &&
      data["detail"].toLowerCase() === "candidate not found"
    ) {
      throw data["details"];
    }

    return data;
  } catch (error) {
    throw error;
  }
}

interface fecthRecommendedCandidateResumeProps {
  access_token?: string;
  recommendationCandidateId?: string;
}

export async function fecthRecommendedCandidateResume(
  props: fecthRecommendedCandidateResumeProps
): Promise<{
  resume: {
    download_url: string;
    file_name: string;
  };
}> {
  try {
    const { access_token = null, recommendationCandidateId = null } = props;

    if (!access_token || !recommendationCandidateId) {
      throw "No access token or recommendation candidate id";
    }

    const response = await axiosScoutBaseBackendInstance.get<{
      download_url: string;
      file_name: string;
    }>(`/api/scout/data/jobs/resume/${recommendationCandidateId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.data.download_url) {
      return {
        resume: {
          download_url: response.data.download_url,
          file_name: response.data.file_name,
        },
      };
    } else {
      throw "No resume";
    }
  } catch (error) {
    return {
      resume: {
        download_url: null,
        file_name: null,
      },
    };
  }
}

interface fetchProfileShortlistedJobIdsProps {
  access_token?: string;
  profileId?: string;
}

export async function fetchProfileShortlistedJobIds(
  props: fetchProfileShortlistedJobIdsProps
): Promise<{
  shortlisted_job_ids: string[];
}> {
  try {
    const { access_token = null, profileId = null } = props;

    if (!access_token || !profileId) {
      throw "No access token or profile id";
    }

    const response = await axiosScoutBaseBackendInstance.get<{
      shortlisted_job_ids: string[];
      recommended_job_ids: string[];
    }>(`/api/scout/data/extension/candidate/shortlist/${profileId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if ("shortlisted_job_ids" in response.data) {
      const { shortlisted_job_ids } = response.data;

      return {
        shortlisted_job_ids,
      };
    } else {
      throw "Wrong response";
    }
  } catch (error) {
    return {
      shortlisted_job_ids: [],
    };
  }
}

interface fetchJobMatchingCountArgsInterface {
  access_token: string | null;
  linkedinUsername?: string;
}

export async function fetchJobMatchingCount(
  args: fetchJobMatchingCountArgsInterface
) {
  try {
    const { access_token = null, linkedinUsername = null } = args;

    if (!access_token || !linkedinUsername) {
      throw "No access token or linkedin username";
    }

    const payload = {
      username: linkedinUsername,
    };

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${access_token}`);
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      redirect: "follow" as RequestRedirect,
    };

    const response = await fetch(
      `${SCOUT_API_URL}api/scout/data/extension/candidate/recommended_jobs`,
      requestOptions
    );

    if (response.status !== 200) {
      throw "Failed";
    }

    const data: STORED_CANDIDATE_DATA_TYPE = await response.json();

    return data && data["job_count"] && typeof data["job_count"] === "number"
      ? data["job_count"]
      : 0;
  } catch (error) {
    return 0;
  }
}
