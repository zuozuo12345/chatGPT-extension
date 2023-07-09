export interface JOB_LISTING_DATA_TYPE {
  id: string;
  job_title: string;
  company_id: string;
  company_name: string;
  active: boolean;
  recommended_candidates_count: string;
  created_at: string;
  updated_at: string;
  num_unviewed_recommendations?: number;
}

export interface NORMALISED_JOB_LISTING_DATA_TYPE {
  [jobId: string]: JOB_LISTING_DATA_TYPE;
}

export interface JOB_DATA_TYPE {
  deleted_at: string;
  job_type_id: string;
  job_salary_max: number;
  jd_text: string;
  jd_url: string;
  id: string;
  location_id: string;
  job_description: string;
  has_aws: false;
  job_title: string;
  min_years_experience: number;
  job_description_slate: string;
  active: true;
  created_by_user_id: string;
  max_years_experience: number;
  job_requirements: string;
  is_draft: false;
  company_id: string;
  job_salary_currency_id: string;
  job_requirements_slate: string;
  hiring_probability: string;
  updated_at: string;
  company_name: string;
  job_salary_unit_id: string;
  job_bonus_type_id: string;
  hiring_probability_tier: string;
  created_at: string;
  job_track_id: string;
  job_recruitment_type_id: string;
  bonus_details: string;
  inactivity: number;
  is_deleted: false;
  job_salary_min: number;
  notes: "";
  recruiters: [];
  skills: JOB_SKILLS_DATA_TYPE[];
  visa_types: {
    deleted_at: string;
    created_at: string;
    id: string;
    visa_type_id: string;
    updated_at: string;
    is_deleted: false;
    job_id: string;
  }[];
  url?: string;
  file?: string;
  industries: {
    created_at: string | Date;
    deleted_at: string | Date;
    id: string;
    industry_id: string;
    is_deleted: boolean;
    job_id: string;
    updated_at: string | Date;
    name?: string;
  }[];
  mandatory_skills: JOB_SKILLS_DATA_TYPE[];
  min_educational_qualification: {
    created_at: string | Date;
    deleted_at: string | Date;
    description: string;
    id: string;
    is_deleted: boolean;
    name: string;
    slug: string;
    updated_at: string | Date;
  };
}

export interface JOB_SKILLS_DATA_TYPE {
  created_at: string;
  id: string;
  deleted_at: string;
  skill_id: string;
  updated_at: string;
  is_deleted: false;
  job_id: string;
  required: false;
}
