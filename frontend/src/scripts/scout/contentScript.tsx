import _ from "lodash";

import { fetchSettingsFromScoutWeb } from "../../api/scout/settings";
import { checkContainsUrl } from "../../utils/url";
import { linkedinObserver } from "./linkedin/general";
import { naukriObserver } from "../../scraper/naukri/init";
import { linkedinV2Observer } from "../../scraper/linkedin/init";

export {};

// chrome.storage.onChanged.addListener(
//   async (
//     changes: chrome.storage.StorageChange,
//     string: chrome.storage.AreaName
//   ) => {
//     if (changes) {
//       if (changes["scoutWebToken"] !== undefined) {
//         if (
//           window.location.href.includes("linkedin.com/in") ||
//           window.location.href.indexOf("/profile") > -1 ||
//           window.location.href.includes("linkedin.com/talent")
//         ) {
//           const updateDetails = await mainLogicFlow();

//           try {
//             const storageResponse = await chrome.storage.sync.get([
//               "scoutWebToken",
//             ]);

//             if (storageResponse["scoutWebToken"]) {
//               await savePublicProfile({
//                 access_token: storageResponse["scoutWebToken"],
//                 candidateData: updateDetails ?? null,
//               });
//             }
//           } catch (error) {}
//         }
//       }
//     }
//   }
// );

(async () => {
  window.addEventListener("load", async () => {
    if (window.location.href.includes("linkedin.com")) {
      linkedinV2Observer.observe(document, {
        subtree: true,
        childList: true,
      });

      linkedinObserver.observe(document, {
        subtree: true,
        childList: true,
      });
    } else if (window.location.href.includes("getscout.ai")) {
      const installExtBtn =
        document.querySelector<HTMLElement>("#chrome-ext-btn");

      if (installExtBtn) {
        installExtBtn.style.display = "none";
      }
    } else {
      const { settings } = await fetchSettingsFromScoutWeb();

      const isNaukri = checkContainsUrl(
        settings.naukri.urls,
        window.location.href
      );

      if (isNaukri) {
        naukriObserver.observe(document, { subtree: true, childList: true });
      }
    }
  });

  return {};
})();
