import {
  SCOUT_EXTENSION_AUTH_COOKIE_NAME,
  SCOUT_WEB_URL,
} from "../scripts/scout/settings";
import { USER_SESSION_TYPE } from "../typescript/types/session";

export const retrieveScoutTokenFromStorage = async () => {
  try {
    const fetchScoutToken: {
      [key: string]: USER_SESSION_TYPE;
    } = await chrome.storage.sync.get([SCOUT_EXTENSION_AUTH_COOKIE_NAME]);

    return fetchScoutToken &&
      Object.keys(fetchScoutToken).length > 0 &&
      fetchScoutToken[SCOUT_EXTENSION_AUTH_COOKIE_NAME]
      ? fetchScoutToken[SCOUT_EXTENSION_AUTH_COOKIE_NAME]
      : null;
  } catch (error) {
    return null;
  }
};

export const retrieveScoutWebAuthCookie = async () => {
  try {
    const cookies = await chrome.cookies.getAll({ url: SCOUT_WEB_URL });

    if (cookies.length > 0) {
      let scoutWebScoutAuthCookie: string | null = null;

      for (const cookie of cookies) {
        if (cookie.name === "scout-auth") {
          scoutWebScoutAuthCookie = cookie.value;
          break;
        }
      }

      return scoutWebScoutAuthCookie;
    } else {
      throw "No cookie";
    }
  } catch (error) {
    return null;
  }
};
