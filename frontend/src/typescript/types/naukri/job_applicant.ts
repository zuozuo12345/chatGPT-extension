export interface NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE {
  projectInfo: {
    projectName: string;
    projectId: number;
  };
  tabs: {
    id: "ALL" | "SHORTLISTED" | "REJECTED";
    label: string;
    count: number;
    subTabs?: {
      label: string;
      value: string;
      count: number;
    }[];
  }[];
  facets: {
    id: "RATING" | "RATING_TAG" | "VIDEO_PROFILE";
    label: string;
    items: {
      label: string;
      value: number;
      count: number;
      isSelected: boolean;
    }[];
  }[];
  totalFilteredApplications: number;
  applications: NAUKRI_JOB_APPLICANT_DATA_TYPE[];
  searchId: string;
}

// For candidate listing page
export interface NAUKRI_JOB_APPLICANT_DATA_TYPE {
  clientId: number;
  currentStatus: string;
  appStatus: string;
  appSubStatus: string;
  statusState: string;
  statusForEapps: string;
  starRating: number;
  applicationId: number;
  profileId: number;
  candidateId: number;
  projectId: number;
  addedOn: Date;
  photo: string;
  videoThumbnail: string;
  videoProfileLink: string | null;
  name: string;
  profileSummary: string;
  email: NAUKRI_EMAIL_DATA_TYPE[];
  phoneNumber: NAUKRI_PHONE_NUMBER_DATA_TYPE[];
  matchTags: NAUKRI_MATCH_TAGS_DATA_TYPE;
  callStatusList: NAUKRI_CALL_STATUS_LIST_DATA_TYPE[];
  commentCount: number;
  companyName: string;
  currentCity: string;
  preferredLocations: string;
  functionalArea: string;
  role: string;
  industry: string;
  experience: NAUKRI_EXPERIENCE_DATA_TYPE;
  ctc: NAUKRI_CTC_DATA_TYPE;
  expectedCtc: NAUKRI_CTC_DATA_TYPE;
  highestDegree: string;
  noticePeriod: string;
  expectedLastDate: string;
  keySkills: string;
  summary: string;
  workExp: NAUKRI_WORK_EXP_DATA_TYPE[];
  education: NAUKRI_EDUCATION_DATA_TYPE[];
  applyMatched: boolean;
  isViewed: boolean;
  requirementInfo: NAUKRI_REQUIREMENT_INFO_DATA_TYPE;
  highlightMap: any;
  scores: NAUKRI_SCORES_DATA_TYPE;
  jobSeekerUserId: string;
  isCurrentlyUnemployed: boolean;
  featuredCandidate: boolean;
  callTrackingParams: NAUKRI_CALL_TRACKING_PARAMS_DATA_TYPE;
  actionPending: boolean;
}

// For the candidate details
export interface NAUKRI_JOB_APPLICANT_USER_DATA_TYPE {
  clientId: number;
  currentStatus: string;
  appStatus: string;
  appSubStatus: string;
  statusState: string;
  statusForEapps: string;
  starRating: number;
  applicationId: number;
  profileId: number;
  candidateId: number;
  projectId: number;
  addedOn: Date;
  photo: string;
  videoThumbnail: string;
  videoProfileLink: string;
  name: string;
  profileSummary: string;
  email: NAUKRI_EMAIL_DATA_TYPE[];
  phoneNumber: NAUKRI_PHONE_NUMBER_DATA_TYPE[];
  matchTags: NAUKRI_MATCH_TAGS_DATA_TYPE;
  callStatusList: NAUKRI_CALL_STATUS_LIST_DATA_TYPE[];
  commentCount: number;
  companyName: string;
  currentCity: string;
  preferredLocations: string;
  functionalArea: string;
  role: string;
  industry: string;
  experience: NAUKRI_EXPERIENCE_DATA_TYPE;
  ctc: NAUKRI_CTC_DATA_TYPE;
  expectedCtc: NAUKRI_CTC_DATA_TYPE;
  highestDegree: string;
  noticePeriod: string;
  expectedLastDate: Date;
  keySkills: string;
  summary: string;
  workExp: NAUKRI_WORK_EXP_DATA_TYPE[];
  education: NAUKRI_EDUCATION_DATA_TYPE[];
  applyMatched: boolean;
  isViewed: boolean;
  requirementInfo: NAUKRI_REQUIREMENT_INFO_DATA_TYPE;
  highlightMap: any;
  scores: NAUKRI_SCORES_DATA_TYPE;
  jobSeekerUserId: string;
  isCurrentlyUnemployed: boolean;
  featuredCandidate: boolean;
  callTrackingParams: NAUKRI_CALL_TRACKING_PARAMS_DATA_TYPE;
  reffBy: null;
  reffByMedium: null;
  skills: NAUKRI_SKILLS_DATA_TYPE[];
  languages: NAUKRI_LANGUAGE_DATA_TYPE[];
  candidateProjects: any[];
  otherDetails: NAUKRI_OTHER_DETAILS_DATA_TYPE;
  questionnaireResponses: any[];
}

export interface NAUKRI_CALL_STATUS_LIST_DATA_TYPE {
  tagId: number;
  value: string;
}

export interface NAUKRI_CALL_TRACKING_PARAMS_DATA_TYPE {
  jobId: string;
  recruiterId: number;
  applicationId: number;
  timestamp: number;
  jobTitle: string;
  jobType: string;
}

export interface NAUKRI_CTC_DATA_TYPE {
  lacs: number | null;
  thousands: number | null;
  currency: string;
  absolute: number | null;
}

export interface NAUKRI_EDUCATION_DATA_TYPE {
  degreeType: string;
  courseType: string;
  degree: string;
  specialization: string;
  institute: string;
  year: number;
}

export interface NAUKRI_EMAIL_DATA_TYPE {
  id: number;
  value: string;
  isPrimary: boolean;
  tagStatus?: null;
}

export interface NAUKRI_PHONE_NUMBER_DATA_TYPE {
  id: number;
  value: string;
  isPrimary: boolean;
  tagStatus?: null;
}

export interface NAUKRI_EXPERIENCE_DATA_TYPE {
  years: number;
  months: number;
}

export interface NAUKRI_LANGUAGE_DATA_TYPE {
  language: string;
  proficiency: string;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
}

export interface NAUKRI_MATCH_TAGS_DATA_TYPE {
  skillMatchTag: string;
  desigMatchTag: string;
  ratingTag: string;
  locationMatch: string;
  ctcMatch: string;
  expMatch: string;
  eduMatch: string;
}

export interface NAUKRI_OTHER_DETAILS_DATA_TYPE {
  personal: {
    dob: Date;
    gender: string;
    maritalStatus: string;
  };
  address: {
    addressWithPin: string;
    homeTown: string;
  };
  desiredJD: {
    jobType: string;
    employerStatus: string;
  };
  workAuthorization: null;
  affirmative: {
    category: null;
    physicallyChallenged: string;
    physicallyChallengedDesc: string;
  };
}

export interface NAUKRI_REQUIREMENT_INFO_DATA_TYPE {
  projectId: number;
  projectName: string;
  title: string;
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  status: number;
  statusText: string;
}

export interface NAUKRI_SCORES_DATA_TYPE {
  overallScore: number;
  keySkillRelevanceScore: number;
  desigRelevanceScore: number;
}

export interface NAUKRI_SKILLS_DATA_TYPE {
  skillLabel: string;
  version: string;
  lastUsed: string;
  experienceTime: string;
}

export interface NAUKRI_WORK_EXP_DATA_TYPE {
  designation: string;
  company: string;
  jobProfile: string;
  noticePeriod: string;
  workingFrom: string;
  workingTo: null;
  expectedLastDate: Date;
  current: string;
}

export interface SAVED_NAUKRI_JOB_APPLICANT_LIST_DATA_TYPE {
  clientId: NAUKRI_JOB_APPLICANT_DATA_TYPE["clientId"];
  currentStatus: NAUKRI_JOB_APPLICANT_DATA_TYPE["currentStatus"];
  profileId: NAUKRI_JOB_APPLICANT_DATA_TYPE["profileId"];
  candidateId: NAUKRI_JOB_APPLICANT_DATA_TYPE["candidateId"];
  photo: NAUKRI_JOB_APPLICANT_DATA_TYPE["photo"];
  addedOn: NAUKRI_JOB_APPLICANT_DATA_TYPE["addedOn"];
  name: NAUKRI_JOB_APPLICANT_DATA_TYPE["name"];
  profileSummary: NAUKRI_JOB_APPLICANT_DATA_TYPE["profileSummary"];
  email: {
    value: NAUKRI_EMAIL_DATA_TYPE["value"];
    isPrimary: NAUKRI_EMAIL_DATA_TYPE["isPrimary"];
  }[];
  phoneNumber: {
    value: NAUKRI_PHONE_NUMBER_DATA_TYPE["value"];
    isPrimary: NAUKRI_PHONE_NUMBER_DATA_TYPE["isPrimary"];
  }[];
  companyName: NAUKRI_JOB_APPLICANT_DATA_TYPE["companyName"];
  currentCity: NAUKRI_JOB_APPLICANT_DATA_TYPE["currentCity"];
  preferredLocations: NAUKRI_JOB_APPLICANT_DATA_TYPE["preferredLocations"];
  role: NAUKRI_JOB_APPLICANT_DATA_TYPE["role"];
  industry: NAUKRI_JOB_APPLICANT_DATA_TYPE["industry"];
  experience: NAUKRI_JOB_APPLICANT_DATA_TYPE["experience"];
  workExp: {
    designation: NAUKRI_WORK_EXP_DATA_TYPE["designation"];
    company: NAUKRI_WORK_EXP_DATA_TYPE["company"];
    jobProfile: NAUKRI_WORK_EXP_DATA_TYPE["jobProfile"];
    noticePeriod: NAUKRI_WORK_EXP_DATA_TYPE["noticePeriod"];
    workingFrom: NAUKRI_WORK_EXP_DATA_TYPE["workingFrom"];
    workingTo: NAUKRI_WORK_EXP_DATA_TYPE["workingTo"];
    current: NAUKRI_WORK_EXP_DATA_TYPE["current"];
  }[];
  education: NAUKRI_EDUCATION_DATA_TYPE[];
  highestDegree: NAUKRI_JOB_APPLICANT_DATA_TYPE["highestDegree"];
  keySkills: NAUKRI_JOB_APPLICANT_DATA_TYPE["keySkills"];
  skills: NAUKRI_SKILLS_DATA_TYPE[];
}
