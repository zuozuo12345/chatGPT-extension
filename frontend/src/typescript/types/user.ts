export interface USER_DETAILS_DATA_TYPE {
  deleted_at: string;
  created_at: string;
  name: string;
  active: boolean;
  id: string;
  updated_at: string;
  is_deleted: boolean;
  email: string;
  group_id: string;
  infinite_credits?: boolean;
  credits: number;
  completed_onboarding_form_datetime?: Date | null;
  completed_stats_datetime?: Date | null;
  completed_tutorial_datetime?: Date | null;
  consented_datetime?: Date | null;
  include_conversation_cc?: boolean;
  is_internal_org?: boolean;
  permissions?: string[];
  roles?: string[];
  consented_summary_disclaimer?: boolean | null;
  current_tier?: USER_TIER_DATA_TYPE;
  last_active_tier?: USER_TIER_DATA_TYPE;
  organization_name?: string;
  countries: string[];
}

export interface USER_TIER_DATA_TYPE {
  name: "premium" | "free";
  category: "free-trial" | "monthly" | "yearly";
  expires: string;
  subscribed: "True" | "False" | null;
}

export type USER_PERMISSION_DATA_TYPE =
  | "LINK_ATS"
  | "LINK_EMAIL"
  | "CREATE_JOB";

export interface USER_SESSION_DATA_TYPE {
  details: USER_DETAILS_DATA_TYPE;
  access_token: string;
  refresh_token: string;
  updated_at?: Date | string;
  created_at?: Date | string;
}
