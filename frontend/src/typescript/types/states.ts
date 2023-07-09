import { STORED_CANDIDATE_DATA_TYPE } from "./candidate";
import { USER_DETAILS_DATA_TYPE } from "./user";

export interface sessionInformationStateInterface {
  access_token: string | null;
  consent: boolean;
  details: USER_DETAILS_DATA_TYPE | null;
}

export interface candidateDataStateInterface {
  details: STORED_CANDIDATE_DATA_TYPE;
  linkedinUsername: string | null;
}
