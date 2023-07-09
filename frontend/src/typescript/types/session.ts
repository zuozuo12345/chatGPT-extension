export interface USER_SESSION_TYPE {
  source: "https://app.getscout.ai/" | "https://app-staging.getscout.ai/";
  access_token: string;
  updated_at: string;
}

export type SESSION_TYPE = "local" | "scout_web_app";
export interface SESSION_TYPE_INTERFACE {
  sessionType: SESSION_TYPE;
}
