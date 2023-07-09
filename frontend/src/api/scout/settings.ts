import axios, { AxiosError } from "axios";
import { SCOUT_WEB_URL } from "../../scripts/scout/settings";
import { MONSTER_URL, NAUKRI_DOMAIN } from "../../scripts/scout/shared";
import { fetchSettingsFromScoutWebResponseType } from "../../typescript/types/settings";

export async function fetchSettingsFromScoutWeb() {
  try {
    // `http://localhost:3000/api/scout/monster`
    // `${SCOUT_WEB_URL}api/scout/monster`

    const response = await axios.get<fetchSettingsFromScoutWebResponseType>(
      `${SCOUT_WEB_URL}api/scout/settings`,
      {
        headers: {
          "content-Type": "application/json",
        },
      }
    );

    if (!response.data.settings["naukri"]) {
      return {
        ...response.data,
        settings: {
          ...response.data.settings,
          naukri: {
            crawlSource: "ext",
            urls: [NAUKRI_DOMAIN],
          },
        },
      } as fetchSettingsFromScoutWebResponseType;
    } else {
      return response.data as fetchSettingsFromScoutWebResponseType;
    }
  } catch (error) {
    return {
      settings: {
        monster: {
          crawlSource: "ext",
          urls: [MONSTER_URL],
        },
        naukri: {
          crawlSource: "ext",
          urls: [NAUKRI_DOMAIN],
        },
      },
    } as fetchSettingsFromScoutWebResponseType;
  }
}
