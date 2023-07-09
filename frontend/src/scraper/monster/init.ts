import _ from "lodash";
import { savePublicProfile } from "../../api/scout/candidate/fetch";
import { passSerialisedMonsterSiteBody } from "../../api/scout/candidate/update";
import { fetchSettingsFromScoutWeb } from "../../api/scout/settings";
import { fetchSettingsFromScoutWebResponseType } from "../../typescript/types/settings";
import { crawlMonsterCandidateProfile } from "./crawler/profile";

let previousUrl = null;

export async function monsterScrapperInit(
  scoutWebSettings: fetchSettingsFromScoutWebResponseType
) {
  const { settings } = scoutWebSettings;

  if (settings && settings.monster && settings.monster.crawlSource) {
    if (settings.monster.crawlSource === "web") {
      // Sending it back to scout web app to process
      const bodyElement = document.querySelector("body");
      const serialiseBody = new XMLSerializer().serializeToString(bodyElement);
      try {
        const storageResponse = await chrome.storage.sync.get([
          "scoutWebToken",
        ]);
        if (storageResponse["scoutWebToken"]) {
          const passSerialisedMonsterSiteBodyResponse =
            await passSerialisedMonsterSiteBody({
              access_token: storageResponse["scoutWebToken"],
              serialisedBody: serialiseBody,
              current_url: window.location.href,
            });

          if (passSerialisedMonsterSiteBodyResponse.candidateProfile) {
            try {
              const storageResponse = await chrome.storage.sync.get([
                "scoutWebToken",
              ]);

              if (storageResponse["scoutWebToken"]) {
                await savePublicProfile({
                  access_token: storageResponse["scoutWebToken"],
                  candidateData:
                    passSerialisedMonsterSiteBodyResponse.candidateProfile ??
                    null,
                });
              }
            } catch (error) {}
          }
        }
      } catch (error) {}
    } else if (settings.monster.crawlSource === "ext") {
      // Crawl from scout extension itself
      const candidateDetailsData = crawlMonsterCandidateProfile();

      if (candidateDetailsData) {
        try {
          const storageResponse = await chrome.storage.sync.get([
            "scoutWebToken",
          ]);

          if (storageResponse["scoutWebToken"]) {
            await savePublicProfile({
              access_token: storageResponse["scoutWebToken"],
              candidateData: candidateDetailsData ?? null,
            });
          }
        } catch (error) {}
      }
    }
  }
}

export const monsterObserver = new MutationObserver(async function (
  mutations,
  observer
) {
  const currentUrl = window.location.href;

  try {
    if (currentUrl !== previousUrl) {
      previousUrl = window.location.href;

      const fetchSettingsFromScoutWebResponse =
        await fetchSettingsFromScoutWeb();

      setTimeout(async () => {
        await monsterScrapperInit(fetchSettingsFromScoutWebResponse);
      }, 250);
    }
  } catch (error) {
    console.log(error);
  }
});
