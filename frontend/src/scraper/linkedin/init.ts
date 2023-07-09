import { scrapRpsProfileinkedin } from "./crawler/rps_profile";
import { scrapSearchResultLinkedin } from "./crawler/rps_search";
import { determinePath } from "./utils";
// import linkedinUserProfileThruApi from "./crawler/profile";
// import { scrapHirePipelineLinkedinPage } from "./crawler/rps_hire";
// import { scrapHireAutomatedSourcingLinkedinPage } from "./crawler/rps_hire_automatedSourcing";

let previousUrl = null;

export async function linkedinScrapperInit() {
  try {
    const currentUrl = window.location.href;

    const { mainPathType, subPathType } = determinePath(currentUrl);

    if (mainPathType === "public_profile") {
      // await linkedinUserProfileThruApi();
    } else if (mainPathType === "rps") {
      if (subPathType === "rps_search") {
        await scrapSearchResultLinkedin();
      } else if (subPathType === "rps_profile") {
        await scrapRpsProfileinkedin();
      } else if (subPathType === "rps_search_profile") {
        await scrapRpsProfileinkedin(true);
      } else if (subPathType === "rps_hire") {
        // await scrapHirePipelineLinkedinPage();
      } else if (subPathType === "rps_hire_profile") {
        await scrapRpsProfileinkedin(false, true);
      } else if (subPathType === "rps_hire_recruiterSearch") {
        // await scrapHirePipelineLinkedinPage("recruiterSearchPage");
      } else if (subPathType === "rps_hire_recruiterSearch_profile") {
        await scrapRpsProfileinkedin(false, true);
      } else if (subPathType === "rps_hire_automatedSourcing_profile") {
        await scrapRpsProfileinkedin(false, true);
      } else if (subPathType === "rps_hire_automatedSourcing") {
        // await scrapHireAutomatedSourcingLinkedinPage();
      }
    }
  } catch (error) {
    console.log({ error });
  }
}

export const linkedinV2Observer = new MutationObserver(async function (
  mutations,
  observer
) {
  const currentUrl = window.location.href;

  try {
    if (currentUrl !== previousUrl) {
      previousUrl = window.location.href;

      await linkedinScrapperInit();
    }
  } catch (error) {
    console.log(error);
  }
});
