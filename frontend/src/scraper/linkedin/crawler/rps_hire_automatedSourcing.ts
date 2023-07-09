import { saveLinkedinRpsSearchResult } from "../../../api/scout/candidate/create";
import { constructTalentHireProfile } from "./modules/constructProfile";

export async function scrapHireAutomatedSourcingLinkedinPage() {
  try {
    const getAllCodeTag = document.querySelectorAll<HTMLElement>("code");

    let elements: any[] = [];

    for (let codeEl of Array.from(getAllCodeTag)) {
      const txtContent = codeEl.textContent.trim();

      try {
        const parseTxtContent = JSON.parse(txtContent);

        if (parseTxtContent) {
          if (
            parseTxtContent["elements"] &&
            typeof parseTxtContent["elements"] === "object" &&
            parseTxtContent["elements"].length > 0 &&
            parseTxtContent["metadata"] &&
            parseTxtContent["metadata"]["recommendedMatchRequestId"] &&
            parseTxtContent["paging"]
          ) {
            if (
              parseTxtContent["elements"][0][
                "linkedInMemberProfileResolutionResult"
              ]
            ) {
              elements = parseTxtContent["elements"];
              break;
            }
          }
        }
      } catch (err) {}
    }

    if (elements && elements.length > 0) {
      const list = elements
        .map((el, index) => {
          return constructTalentHireProfile({
            el: el,
            resultFieldName: "linkedInMemberProfileResolutionResult",
          });
        })
        .filter(
          (item) =>
            item !== null &&
            (item["linkedInMemberProfileUrnResolutionResult"]["firstName"] !==
              null ||
              item["linkedInMemberProfileUrnResolutionResult"]["lastName"] !==
                null)
        );

      const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

      if (storageResponse["scoutWebToken"] && list.length > 0) {
        await saveLinkedinRpsSearchResult({
          access_token: storageResponse["scoutWebToken"],
          elements: list,
        });
      }
    }
  } catch (error) {
    console.log({
      error,
    });
  }
}
