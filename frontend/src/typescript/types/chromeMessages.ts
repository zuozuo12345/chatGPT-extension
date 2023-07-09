import { CANDIDATE_DETAILS_TYPE } from "./candidate";

export interface backgroundIncomingMessageInterface {
  scout?: {
    action: "init" | "tab-closed" | "candidate-details";
    payload?: {
      candidateData?: CANDIDATE_DETAILS_TYPE;
      portId?: string | null;
    };
  };
}

export interface backgroundMessagePayloadInterface {
  scout?: {
    authenticated?: boolean;
    auth_token?: string | null;
    portId?: string | null;
  };
}

export interface popupIncomingMessageInterface {
  scout?: {
    action: "init" | "candidate_details";
    payload: {
      auth_token?: string | null;
      candidateData?: CANDIDATE_DETAILS_TYPE;
    };
  };
}

// v2
export interface contentScriptMessagePayloadInterface {
  scout?: {
    content: {
      action: "candidate_details";
      payload?: {
        candidateData?: CANDIDATE_DETAILS_TYPE;
      };
    };
  };
}

export interface popupScriptMessagePayloadInterface {
  scout?: {
    popup: {
      action:
        | "init"
        | "clear_session_cookie"
        | "check_for_session"
        | "inject_crawler_init_function";
      payload?: {
        [key: string]: any;
      };
    };
  };
}

export interface backgroundScriptMessagePayloadInterface {
  scout?: {
    background: {
      action: "creds" | "candidate_details";
      payload?: {
        auth_cookie?: string | null;
        access_token?: string | null;
        candidateData?: CANDIDATE_DETAILS_TYPE | null;
      };
    };
  };
}
