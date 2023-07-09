import { SCOUT_WEB_URL } from "../../../scripts/scout/settings";
import { USER_SESSION_DATA_TYPE } from "../../../typescript/types/user";
import { unsealData } from "../../../utils/iron";

interface getAccessTokenInterface {
  cookieValue?: string;
  scoutWebsiteUrl?: string;
  unsealLocally?: boolean;
}

export async function getAccessToken({
  cookieValue = null,
  scoutWebsiteUrl = SCOUT_WEB_URL,
  unsealLocally = true,
}: getAccessTokenInterface) {
  try {
    if (unsealLocally) {
      let token = null;

      const response: {
        user: USER_SESSION_DATA_TYPE;
      } = await unsealData(cookieValue, null);

      const userSessionData = response.user;

      if (userSessionData) {
        token = userSessionData.access_token ?? null;
      }

      return {
        access_token: token,
      };
    } else {
      if (!cookieValue || !scoutWebsiteUrl)
        throw "No cookie value or website url provided";

      const response = await fetch(
        `${scoutWebsiteUrl}api/me-scout?cookieValue=${cookieValue}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );

      const data = await response.json();

      return {
        access_token: data.access_token,
      };
    }
  } catch (error) {
    return {
      access_token: null,
    };
  }
}
