// Staging
// export const SCOUT_WEB_URL = "https://app-staging.getscout.ai/";
// export const SCOUT_WEB_URL_HOST = "app-staging.getscout.ai";
// export const SCOUT_API_URL =
//   "https://scout-backend-gateway.263vhv6loth9g.ap-southeast-1.cs.amazonlightsail.com/";
export const SCOUT_WEB_URL = "https://localhost:8090/";
export const SCOUT_WEB_URL_HOST = "https://localhost:8090/";
export const SCOUT_API_URL = "https://localhost:8090/";
export const SCOUT_PORT_NAME = "scout-extension-service-worker";
export const SCOUT_EXTENSION_AUTH_COOKIE_NAME = "scout-cookie-auth";
export const SCOUT_SESSION_EXPIRED_MESSAGE = "session_expired";
export const SCOUT_WEB_SECRET_COOKIE_PASSWORD =
  "QB7Xdb1czWFwwmoGBUQAz6VkDs7q9hGY";
export const SCOUT_WEB_TOKEN_EXPIRY_IN_SECONDS = 259200;
export const AMOUNT_TO_REVEAL_CANDIDATE = 1;
export const MAXIMUM_JOB_COUNT = 10;
export const SCOUT_NOT_CONSENTED_MESSAGE = "User Agreement not consented";
export const ENV_MODE: ENV_MODE_TYPE = "staging";

// Production
// export const SCOUT_WEB_URL = "https://app.getscout.ai/";
// export const SCOUT_WEB_URL_HOST = "app.getscout.ai";
// export const SCOUT_API_URL = "https://api.getscout.ai/";
// export const SCOUT_PORT_NAME = "scout-extension-service-worker";
// export const SCOUT_EXTENSION_AUTH_COOKIE_NAME = "scout-cookie-auth";
// export const SCOUT_SESSION_EXPIRED_MESSAGE = "session_expired";
// export const SCOUT_WEB_SECRET_COOKIE_PASSWORD =
//   "QB7Xdb1czWFwwmoGBUQAz6VkDs7q9hGY";
// export const SCOUT_WEB_TOKEN_EXPIRY_IN_SECONDS = 259200;
// export const AMOUNT_TO_REVEAL_CANDIDATE = 1;
// export const MAXIMUM_JOB_COUNT = 10;
// export const SCOUT_NOT_CONSENTED_MESSAGE = "User Agreement not consented";
// export const ENV_MODE: ENV_MODE_TYPE = "production";

export const UPGRADE_TO_PREMIUM_TEXT =
  "Upgrade to our premium subscription to unlock this feature";

type ENV_MODE_TYPE = "staging" | "production";
