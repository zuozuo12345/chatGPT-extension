import { LISTING_DATA_TYPE } from "../listing";

export interface CREATE_JOB_RESPONSE_DATA_TYPE {
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at?: string | null;
  id: string;
  created_by_user_id: string;
  company_id?: string | null;
  company_name: string;
  job_track_id?: string | null;
  job_type_id?: string | null;
  location_id: string;
  min_years_experience: number;
  max_years_experience: number;
  job_salary_currency_id?: string | null;
  job_salary_unit_id?: string | null;
  job_recruitment_type_id?: string | null;
  job_salary_min: number;
  job_salary_max: number;
  job_description: string;
  job_description_slate: string;
  job_requirements?: string | null;
  job_requirements_slate: string;
  job_bonus_type_id?: string | null;
  bonus_details?: string | null;
  has_aws: boolean;
  active: boolean;
  is_draft: boolean;
  hiring_probability?: string | null;
  hiring_probability_tier?: string | null;
  inactivity: number;
  notes: string;
  jd_text?: string | null;
  jd_url?: string | null;
  job_title: string;
  file?: File;
  url?: string;
}

export interface CREATE_JOB_PAYLOAD_DATA_TYPE {
  job_bonus_type_id: string;
  job_recruitment_type_id: string;
  job_track_id: string;
  job_type_id: string;
  location_id: string;
  job_title: string;
  company_name: string;
  recruiter_ids: string[];
  created_by_user_id: string;
  min_years_experience: number;
  max_years_experience: number;
  job_salary_min: number;
  job_salary_max: number;
  job_description: string;
  job_description_slate: string;
  job_requirements: string;
  job_requirements_slate: string;
  bonus_details: string;
  skill_ids: string[];
  visa_type_ids: string[];
  required_skill_ids: string[];
  inactivity: number;
  notes: string;
  has_aws: boolean;
  is_draft: boolean;
  file?: string;
  url?: string;
  min_educational_qualification?: string;
  accepted_industry_ids?: string[];
}

export interface PARSED_JOB_DATA_TYPE {
  bonus_details: string;
  bonus_type: string;
  company: string;
  job_description: string;
  job_requirements: string;
  job_title: string;
  job_track: string[];
  job_type: string;
  location: {
    country_code: string;
    created_at: string;
    deleted_at: string;
    description: string;
    id: string;
    is_deleted: boolean;
    name: string;
    updated_at: string;
  };
  max_years_experience: number;
  min_years_experience: number;
  recruiters: string[];
  salary_max: number;
  salary_min: number;
  salary_unit: string;
  required_skills: PARSED_JOB_SKILLS_DATA_TYPE[];
  skills: PARSED_JOB_SKILLS_DATA_TYPE[];
  visa_types: string[];
  file?: string;
  suggested_industries: LISTING_DATA_TYPE[];
}

interface PARSED_JOB_SKILLS_DATA_TYPE {
  created_at: string;
  deleted_at: string;
  description: string;
  id: string;
  is_deleted: boolean;
  name: string;
  slug: string;
  updated_at: string;
}
