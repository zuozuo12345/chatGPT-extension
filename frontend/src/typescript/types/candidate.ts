export interface CANDIDATE_DETAILS_TYPE {
  username: string;
  profile: CANDIDATE_PROFILE_TYPE;
  skills: PUBLIC_SKILL_DATA_TYPE[];
  skills_complete: boolean;
  experiences: PUBLIC_EXPERIENCE_DATA_TYPE[];
  experiences_complete: boolean;
  educations: PUBLIC_EDUCATIOM_DATA_TYPE[];
  educations_complete: boolean;
  certifications: PUBLIC_CERTIFICATION_DATA_TYPE[];
  certifications_complete: boolean;
  open_to_work?: string;
  industry?: any;
  platform?: "linkedin" | "monster";
  people_also_viewed_links?: string[];
  recommendations?: PUBLIC_RECOMMENDATION_DATA_TYPE[];
  languages?: PUBLIC_LANGUAGE_DATA_TYPE[];
  projects?: PUBLIC_PROJECT_DATA_TYPE[];
  awards?: PUBLIC_AWARD_DATA_TYPE[];
  volunteers?: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[];
  courses?: PUBLIC_COURSE_DATA_TYPE[];
}

export interface CANDIDATE_PROFILE_TYPE {
  name: string;
  profile_url: string | null;
  url: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  twitter: string | null;
  title?: string | null;
  display_image?: string | null;
  location?: string | null;
  profile_username?: string | null;
}

export interface PUBLIC_COURSE_DATA_TYPE {
  name: string;
}

export interface PUBLIC_VOLUNTEER_WORK_DATA_TYPE {
  title: string;
  company: string;
  date: string;
  description: string;
}

export interface PUBLIC_AWARD_DATA_TYPE {
  award_name: string;
  issuer: string;
  date: string;
  description: string;
}

export interface PUBLIC_PROJECT_DATA_TYPE {
  project_name: string;
  dates: string;
  description: string;
}

export interface PUBLIC_LANGUAGE_DATA_TYPE {
  language: string;
  proficiency: string;
}

export interface PUBLIC_RECOMMENDATION_DATA_TYPE {
  name: string;
  content: string;
}

export interface PUBLIC_EXPERIENCE_DATA_TYPE {
  job_title: string | null;
  company_name: string | null;
  job_subtitles: string | null;
  dates: string | null;
  duration: string | null;
  location: string | null;
  description: string | null;
}

export interface PUBLIC_EDUCATIOM_DATA_TYPE {
  institution: string | null;
  degree_name: string | null;
  field: string | null;
  dates: string | null;
}

export interface PUBLIC_SKILL_DATA_TYPE {
  name: string | null;
  passed_linkedin_assessment: boolean;
  num_endorsements: number | null;
}

export interface PUBLIC_CERTIFICATION_DATA_TYPE {
  name: string | null;
  dates: string | null;
}

// Processed data
export interface PROCESSED_CANDIDATE_DATA {
  certifications: {
    dates: string;
    name: string;
  }[];
  certifications_complete: boolean;
  educations: {
    dates: string;
    degree_name: string;
    field: string;
    institution: string;
  }[];
  educations_complete: boolean;
  experiences: {
    company_name: string;
    dates: string;
    description: string;
    duration: string;
    job_title: string;
    location: string;
  }[];
  experiences_complete: boolean;
  highlights_v2?: string[];
  industry: string | null;
  job: {
    company_name: string;
    job_description: string;
    job_requirements: null;
    location: string;
    max_years_of_exp: 8;
    min_education_qualification: string;
    min_years_of_exp: 4;
    skills_keywords: string[];
    title: string;
  };
  jobs?: CANDIDATE_JOBS_DATA_TYPE[];
  masked_details?: boolean;
  open_to_work: boolean | null;
  profile_id: string;
  profile: {
    current_company_name: string | null;
    current_role_title: string | null;
    display_image: string | null;
    display_image_base64: string | null;
    email: string | string[] | null;
    email_source: string | null;
    github: string | null;
    github_source: string | null;
    location: string | null;
    name: string | null;
    phone: string | null;
    phones?: string[] | null | undefined;
    phone_source: string | null;
    profile_url: string | null;
    title: string | null;
    twitter: string | null;
    twitter_source: string | null;
    url: string | null;
    website: string | null;
    website_source: string | null;
  };
  skills: {
    name: string;
    num_endorsements: number | null;
    passed_linkedin_assessment: boolean;
  }[];
  skills_complete: boolean;
  skip_save: boolean;
  source: string;
  timestamp: string;
  is_member?: boolean;
  gender?: string | null;
}

export type STORED_CANDIDATE_DATA_TYPE = Omit<
  PROCESSED_CANDIDATE_DATA,
  "source"
>;

export interface CANDIDATE_JOBS_DATA_TYPE {
  candidate_skills: {
    candidate_core_skills: string[];
    linkedin_skills: string[];
    linkedin_top_skills: string[];
    recent_skills: string[];
  };
  job: {
    company_name: string;
    id: string;
    job_description: string;
    job_requirements: string;
    job_title: string;
    location: string;
    max_years_of_exp: number;
    min_years_of_exp: number;
    skills: string[];
    visa_types: string[];
  };
  job_skills: string[];
  matched_skill_details: {
    match: string;
    score: number;
    skill: string;
    type: string;
  }[];
  matching_experience: boolean;
  relevant_projects: boolean;
  score: number;
  total_experience_years: number;
  visa_status: string;
  matching_industries?: boolean;
  has_resume: boolean;
  interested?: null;
  recommendation_id?: string;
  summary?: string;
  conversation_responded: boolean;
  conversation_updated_at: Date;
  open_to_opportunities: boolean | null;
  open_to_work: boolean | null;
  resume_discoverable: boolean;
  nurturing_campaign?: {
    last_sent?: Date;
    email_step_1?: RECOMMENDED_CANDIDATE_EMAIL_STEP_DATA_TYPE;
    email_step_2?: RECOMMENDED_CANDIDATE_EMAIL_STEP_DATA_TYPE;
    email_step_3?: RECOMMENDED_CANDIDATE_EMAIL_STEP_DATA_TYPE;
  };
}

export interface RECOMMENDED_CANDIDATE_EMAIL_STEP_DATA_TYPE {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  recipient: string;
  body: string;
  sent: boolean;
  is_deleted: boolean;
  id: string;
  subject: string;
  to_send_at: Date;
  is_stale: boolean;
}

export interface NORMALISED_CANDIDATE_JOBS_LIST_TYPE {
  [key: string]: CANDIDATE_JOBS_DATA_TYPE;
}

export interface RECOMMENDED_CANDIDATE_DATA_TYPE {
  viewed: boolean;
  matching_job_family?: boolean;
  candidate_id: boolean;
  id: string;
  is_member: boolean;
  job_id: string;
  job_skills?: string[];
  masked_detals?: boolean;
  masked_details?: boolean;
  matching_experience: boolean;
  matching_skills: string[];
  recommendation_text: string;
  recommendation_tier: number;
  relevant_projects: boolean;
  score: number;
  url: string;
  open_to_work?: string;
  candidate: {
    current_company_name: string;
    current_role_title: string;
    email: string;
    name: string;
    phone_number: string;
    urls: CANDIDATE_URLS_DATA_TYPE;
    skills: string[];
    visa_status?: string;
    certifications?: string[];
    recent_education?: {
      degree_name: string;
      institution: string;
      dates: string;
      field: string;
    } | null;
    company_industries?: string[] | null;
    company_nature?: string[];
    company_size?: string[];
    company_sector?: string[];
    is_member?: boolean | null;
  };
  visa_status?: string;
  other_suitable_roles?: RECOMMENDED_CANDIDATE_DETAILS_DATA_TYPE["other_suitable_roles"];
  num_similar_candidates?: number;
  feedback?: "positive" | "negative" | "none";
  matching_industries?: string[];
  display_image_base64?: string | null;
  conversation_updated_at?: string | Date | null;
  gender?: "male" | "female" | null;
  has_resume?: boolean;
  resume_discoverable?: boolean;
  open_to_opportunities?: boolean;
  conversation_responded?: boolean;
  interested?: boolean;
  summary?: string | null;
  has_greenhouse?: boolean;
  greenhouse_url?: string | null;
}

export interface RECOMMENDED_CANDIDATE_DETAILS_DATA_TYPE {
  id: string;
  job_id: string;
  candidate_id: boolean | null;
  is_member: boolean;
  url: string;
  candidate: {
    name: string;
    visa_status: string;
    email: string;
    phone_number: string;
    current_role_title: string;
    current_company_name: string;
    urls: CANDIDATE_URLS_DATA_TYPE;
    skills: string[];
  };
  masked_details: boolean;
  score: 90;
  matching_skills: string[];
  job_skills: string[];
  matching_experience: boolean;
  relevant_projects: boolean;
  recommendation_tier: number;
  recommendation_text: string;
  viewed: boolean;
  other_suitable_roles: string[];
  visa_status?: string;
  matching_industries?: string[];
}

export interface CANDIDATE_URLS_DATA_TYPE {
  linkedin: string | null;
  github: string | null;
  stackoverflow: string | null;
}
