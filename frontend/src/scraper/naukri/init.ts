import { fetchSettingsFromScoutWeb } from "../../api/scout/settings";
import { fetchSettingsFromScoutWebResponseType } from "../../typescript/types/settings";
import { NAUKRI_DOMAIN } from "../shared";
import { fetchApplicantListThruApi } from "./crawler/applicantListingPage";
import { fetchJobApplicantDetailsThruApi } from "./crawler/jobApplicantDetailsPage";

let previousUrl = null;

export async function naukriScrapperInit(
  scoutWebSettings: fetchSettingsFromScoutWebResponseType
) {
  try {
    const currentUrl = window.location.href;
    const splitCurrentUrl = currentUrl.split("/");

    // Job applicant list page
    if (
      window.location.href.includes(`hiring.${NAUKRI_DOMAIN}/hiring`) &&
      splitCurrentUrl[3] === "hiring" &&
      splitCurrentUrl[4] !== undefined &&
      splitCurrentUrl[5] !== undefined &&
      !isNaN(parseInt(splitCurrentUrl[4])) &&
      splitCurrentUrl[5] === "applies"
    ) {
      await fetchApplicantListThruApi();
    }

    // Job applicant details page
    if (
      window.location.href.includes(`hiring.${NAUKRI_DOMAIN}/hiring`) &&
      splitCurrentUrl[3] === "hiring" &&
      splitCurrentUrl[4] !== undefined &&
      splitCurrentUrl[5] !== undefined &&
      !isNaN(parseInt(splitCurrentUrl[4])) &&
      splitCurrentUrl[5] === "apply"
    ) {
      await fetchJobApplicantDetailsThruApi();
    }
  } catch (error) {
    console.log({ error });
  }
}

export const naukriObserver = new MutationObserver(async function (
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
        await naukriScrapperInit(fetchSettingsFromScoutWebResponse);
      }, 250);
    }
  } catch (error) {
    console.log(error);
  }
});
