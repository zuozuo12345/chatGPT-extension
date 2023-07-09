export interface SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE {
  linkedInMemberProfileUrnResolutionResult: {
    fullProfileNotVisible: boolean;
    firstName: string;
    lastName: string;
    entityUrn: string;
    publicProfileUrl: string;
    industryName: string;
    headline: string;
    emails?: string[];
    phoneNumbers?: string[];
    workExperience: [
      {
        companyName: string;
        description: string;
        title: string;
        startDateOn: { month: number; year: number };
        endDateOn: { month: number; year: number };
      }
    ];
    currentPositions: [
      {
        companyName: string;
        description: string;
        title: string;
        startDateOn: { month: number; year: number };
        endDateOn: { month: number; year: number };
      }
    ];
    memberPreferences: { openToNewOpportunities: boolean };
    skills?: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE[];
    educations?: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_EDU_INTERFACE[];
  };
}

export interface SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE {
  skillName: string;
  skillAssessmentVerified: boolean;
}

export interface SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_EDU_INTERFACE {
  degreeName: string;
  schoolName: string;
  startDateOn: {
    month: number;
    year: number;
  };
  endDateOn: {
    month: number;
    year: number;
  };
}
