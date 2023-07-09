export interface NAUKRI_JOB_COUNT_DATA_TYPE {
  allAppliesCount: number;
  highMatchCount: number;
  responseCount: number;
}

export interface NAUKRI_JOB_DATA {
  title: string;
  description: string;
  keySkillsGid: {
    [key: string]: {
      label: string;
      preferred: boolean;
      id: string | null;
    };
  };
  minimumExperience: number;
  maximumExperience: number;
  nationalLocationsGid: {
    [key: string]: {
      id: string;
      label: string;
      isCustomGroup: boolean;
    };
  };
  internationalLocationsGid: any;
  localitiesGid: any;
  companyId: number;
  companyDetail: {
    name: string;
    details: string;
    address: string;
    media: { ppt: any[]; video: any[]; photos: any[] };
    hiringFor: string;
  };
  deleted: boolean;
  createdBy: string;
  lastUpdatedBy: string;
  createdDate: number;
  updateDate: number;
  jobId: string;
  shortJobId: string;
  companyType: string;
  jobType: string;
  wfhType: string;
  category: string;
  vacancy: number;
  employmentType: string;
  baseLocation: {
    nationalLocations: {
      [key: string]: {
        id: string;
        label: string;
        isCustomGroup: boolean;
      };
    };
    internationalLocations: any;
    otherNationalLocationsWithStates: any[];
    otherNationalLocations: any[];
    otherInternationalLocations: any[];
  };
  responseManager: string;
  responseManagerSettings: {
    emails: string[];
    frequency: string;
    subjectSettings: {
      isSubjectCustomized: boolean;
      Designation: boolean;
      Company: boolean;
      Experience: boolean;
      Location: boolean;
    };
    relevanceRating: string;
    starRating: number;
  };
  visibility: number;
  requirementId: string;
  industryGid: string;
  otherIndustry: string;
  functionalAreaGid: string;
  jobRoleGid: string;
  roleCategoryGid: string;
  otherNationalLocations: any[];
  otherNationalLocationsWithStates: any[];
  otherInternationalLocations: any[];
  otherLocalities: any[];
  education: {
    ugGid: {
      course: string;
      courseLabel: string;
      spec: any[];
      specLabels: any;
    }[];
    pgGid: any[];
    ppgGid: any[];
    degreeCombination: string;
    premiumProcessed: boolean;
  };
  walkIn: boolean;
  salaryDetail: {
    minimumSalary: number;
    maximumSalary: number;
    currency: string;
    hideSalary: boolean;
    variablePercentage: number;
  };
  recruiterProfile: string;
  showRecruiterDetail: boolean;
  subscriptionId: number;
  shareJobLegacyFlag: boolean;
  appliedFilters: {
    industry: {
      industryIds: string | null;
      industryGIds: string | null;
      industryOtherLabels: string | null;
      industryOtherFlag: boolean;
    };
    education: {
      ugEducationGId: string | null;
      pgEducationGId: string | null;
      ppgEducationGId: string | null;
      ugInstituteGIds: string | null;
      pgInstituteGIds: string | null;
      anyEducationFlag: boolean;
      degreeCombination: string | null;
      nonGraduateFlag: boolean;
      doesNotMatterFlag: boolean;
    };
    locations: string;
  };
  videoProfilePreferred: boolean;
  source: string;
  mode: string;
  board: string;
  registrationType: string;
  validTill: number;
  initialPostedDate: number;
  totalCreditsUsed: number;
  totalRefreshes: number;
  enrichedJobData: {
    companyPageUrl: string;
    groupLogoNew: {
      desktop: {
        v1: string;
        v2: string;
      };
      mobile: {
        v1: string;
        v2: string;
      };
    };
    logo_name: string;
    companyTags: any;
    city: string;
    fc_comname: string;
    bitFlag: number;
    logoToBeHidden: boolean;
    compName: string;
    rp_Url: string;
    jdUrl: string;
    jobSpec: string;
    psu: string;
    commonCompanyName: string;
    skill_tags: any[];
    static_compname: string;
    logoExists: boolean;
    cb_name: string;
    rpemail: string;
    shortDesc: string;
    recruiter_DISPLAY_NAME: string;
    keySkills: {
      Scalability: {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      Architecture: {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      "Design Patterns": {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      "Data Structures": {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      OOPS: { clickable: string; label: string; preferred: boolean };
      GO: { clickable: string; label: string; preferred: boolean };
      "Object Oriented Design": {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      nodejs: { clickable: string; label: string; preferred: boolean };
      "Express°js": { clickable: string; label: string; preferred: boolean };
      "node°js": { clickable: string; label: string; preferred: true };
      Algorithms: {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      "Algorithm Design": {
        clickable: string;
        label: string;
        preferred: boolean;
      };
      MongoDB: { clickable: string; label: string; preferred: boolean };
    };
    vcardDetails: {
      creditsLeft: string;
      photoPath: string;
      companyName: string;
      name: string;
      hasOptForRJ: string;
      lastActiveDate: string;
      location: string;
      slugPrimary: string;
      designation: string;
      companyUrl: string;
      id: string;
      followerCount: string;
    };
    premium_logo: string;
  };
  indexerData: {
    cityfield: string;
    clmask: number;
    deDupHash: string;
    productJobSource: string[];
    keywords: string;
    searchField: string;
    citymask: number;
    groupId: number;
    datepriority: number;
    conv_MINSAL: number;
    sal_clus: string;
    eduText: string;
    classId: string;
    ugSpec: string;
    ugCourseGid: string;
    nflStr: string;
    jobsearchProcessed: boolean;
    pgSpecGid: string;
    searchField3: string;
    pgCourseGid: string;
    searchField2: string;
    pgmask: number;
    roleText: string;
    ctcmask: number;
    nflStrGid: string;
    pgSpec: string;
    roleTextGid: string;
    eduMapText: string;
    conv_MAXSAL: number;
    charCode: number;
    deDupStr: string;
    cityid: string;
    slope: number;
    dateprior_DECIMAL: number;
    groupName: string;
    roleCatGid: string;
    ugSpecGid: string;
    ctype: number;
    eduMapTextGid: string;
    makesenseResponse: {
      weak_focus_skill_ids: string;
      title_ids: string;
      searchfield_noindex: string;
      medium_focus_skill_ids: string;
      post_relevant_skill_ids: string;
      extracted_company_ids: string;
      searchfield2_noindex: string;
      payload: string;
      searchfield3_noindex: string;
      skill_tags: any[];
      title_vector: number[];
      shortDesc: string;
      comscore: number;
      skill_vector: number[];
      strong_focus_skill_ids: string;
    };
    glbl_cityId: string;
    ugmask: number;
    ugCourse: string;
    pgCourse: string;
  };
  draftId: string;
  initialPostedBy: string;
  assignedSubUsers: string[];
  successMailerProcessed: boolean;
  currentDate: string;
}
