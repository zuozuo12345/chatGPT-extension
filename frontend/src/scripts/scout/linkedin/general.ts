import _ from "lodash";
import { savePublicProfile } from "../../../api/scout/candidate/fetch";

import { CANDIDATE_DETAILS_TYPE } from "../../../typescript/types/candidate";
import crawlPublicSkillsDataFromProfilePage, {
  crawlAwardsDetailsPage,
  crawlAwardsSection,
  crawlCoursesDetailsPage,
  crawlCoursesSection,
  crawlExperienceDataFromProfilePage,
  crawlLanguageDetailsPage,
  crawlLanguageSection,
  crawlPeopleAlsoViewedSection,
  crawlPeopleYouMayKnowSection,
  crawlProfileDataFromContactInfoPage,
  crawlProjectsDetailsPage,
  crawlProjectsSection,
  crawlPublicCertDataFromProfilePage,
  crawlPublicEducationDataFromProfilePage,
  crawlPublicProfileDataFromProfilePage,
  crawlPuiblicCertFromDetailsCertPage,
  crawlPuiblicEducationFromDetailsEducationPage,
  crawlPuiblicExperiencesFromDetailsExperiencePage,
  crawlPuiblicProfileSection,
  crawlPuiblicSkillsFromDetailsSkillsPage,
  crawlRecommendationsDetailsPage,
  crawlRecommendationsSection,
  crawlVolunteerWorkDetailsPage,
  crawlVolunteerWorkSection,
} from "./public_profile/data-fetching";
import { crawlLimitedPublicProfile } from "../../../scraper/linkedin/crawler/modules/limitedPublicProfile";
import {
  checkIfTitleExist,
  determinePath,
  determinePathType,
} from "../../../scraper/linkedin/utils";
import { saveLinkedinScrapUserLinksSearchResult } from "../../../api/scout/candidate/create";

const defaultCandidateDetailsData: CANDIDATE_DETAILS_TYPE = {
  username: null,
  profile: {
    name: null,
    profile_url: null,
    url: null,
    website: null,
    phone: null,
    email: null,
    twitter: null,
    title: null,
    display_image: null,
    location: null,
    profile_username: null,
  },
  skills: [],
  skills_complete: false,
  experiences: [],
  experiences_complete: false,
  educations: [],
  educations_complete: false,
  certifications: [],
  certifications_complete: false,
  open_to_work: null,
  industry: null,
  platform: "linkedin",
  people_also_viewed_links: [],
  recommendations: [],
  languages: [],
  projects: [],
  awards: [],
  volunteers: [],
  courses: [],
};

export async function mainLogicFlow() {
  const candidateDetailsData = {
    ...defaultCandidateDetailsData,
  };

  const currentUrl = window.location.href;

  const { mainPathType, subPathType } = determinePath(currentUrl);

  if (mainPathType === "public_profile") {
    candidateDetailsData.username = currentUrl.split("/in/")[1];

    if (candidateDetailsData.username.includes("/")) {
      candidateDetailsData.username =
        candidateDetailsData.username.split("/")[0];
    }

    if (subPathType === "contact_info") {
      const capturedLinkedinInformation = crawlProfileDataFromContactInfoPage(
        candidateDetailsData.username
      );

      candidateDetailsData.profile = capturedLinkedinInformation;
    } else if (subPathType === "details_experience") {
      const experienceContainer = document.querySelector<HTMLElement>(
        "section.artdeco-card.ember-view.pb3"
      );

      if (experienceContainer) {
        const capturedLinkedinInExpformation =
          crawlPuiblicExperiencesFromDetailsExperiencePage();

        candidateDetailsData.experiences = capturedLinkedinInExpformation;
      }

      candidateDetailsData.experiences_complete = true;
    } else if (subPathType === "details_skills") {
      const crawlSkills = await crawlPuiblicSkillsFromDetailsSkillsPage();

      if (crawlSkills.skills) {
        candidateDetailsData.skills = crawlSkills.skills;
      }

      candidateDetailsData.skills_complete = true;
    } else if (subPathType === "details_education") {
      const crawlEducation =
        await crawlPuiblicEducationFromDetailsEducationPage();

      if (crawlEducation.educations) {
        candidateDetailsData.educations = crawlEducation.educations;
      }

      candidateDetailsData.educations_complete = true;
    } else if (subPathType === "details_certifications") {
      const crawlCertifications = await crawlPuiblicCertFromDetailsCertPage();

      if (crawlCertifications.certifications) {
        candidateDetailsData.certifications =
          crawlCertifications.certifications;
      }

      candidateDetailsData.certifications_complete = true;
    } else if (subPathType === "details_languages") {
      candidateDetailsData.languages = await crawlLanguageDetailsPage();
    } else if (subPathType === "details_recommendations") {
      candidateDetailsData.recommendations =
        await crawlRecommendationsDetailsPage();
    } else if (subPathType === "details_projects") {
      candidateDetailsData.projects = await crawlProjectsDetailsPage();
    } else if (subPathType === "details_awards") {
      candidateDetailsData.awards = await crawlAwardsDetailsPage();
    } else if (subPathType === "details_volunteer") {
      candidateDetailsData.volunteers = await crawlVolunteerWorkDetailsPage();
    } else if (subPathType === "details_courses") {
      candidateDetailsData.courses = await crawlCoursesDetailsPage();
    } else if (
      !currentUrl.includes("/recent-activity") &&
      !currentUrl.includes("/details") &&
      !currentUrl.includes("/overlay")
    ) {
      const view_profile_in_recruiter_btn = document.querySelector<HTMLElement>(
        'button[data-control-name="view_profile_in_recruiter"]'
      );

      const publicProfileSections = await crawlPuiblicProfileSection();

      candidateDetailsData.profile = crawlPublicProfileDataFromProfilePage(
        publicProfileSections,
        candidateDetailsData.username
      );

      const { experiences, more_experience, more_experience_btn } =
        crawlExperienceDataFromProfilePage(publicProfileSections);
      candidateDetailsData.experiences = experiences;
      candidateDetailsData.experiences_complete = !more_experience;

      candidateDetailsData.educations = crawlPublicEducationDataFromProfilePage(
        publicProfileSections
      );

      const { skills } = crawlPublicSkillsDataFromProfilePage(
        publicProfileSections
      );
      candidateDetailsData.skills = skills;

      const { certifications } = crawlPublicCertDataFromProfilePage();
      candidateDetailsData.certifications = certifications;

      if (view_profile_in_recruiter_btn) {
        const more_experience_el = document.createElement("div");

        more_experience_el.id = "more_experience_message";
        more_experience_el.innerText = "Click for detailed insights";
        more_experience_el.style.color = "#f66700";
        more_experience_el.style.fontSize = "0.8em";
        more_experience_el.style.paddingLeft = "1em";

        view_profile_in_recruiter_btn
          .querySelector<HTMLElement>("span")
          .insertAdjacentElement("afterend", more_experience_el);
      }

      const showAllSkillsButton = document.querySelector<HTMLElement>(
        ".pvs-list__outer-container .pvs-list__footer-wrapper .optional-action-target-wrapper[href*='details/skills']"
      );
      const showAllExperienceButton = document.querySelector<HTMLElement>(
        ".pvs-list__outer-container .pvs-list__footer-wrapper .optional-action-target-wrapper[href*='details/experience']"
      );
      const showAllEducationButton = document.querySelector<HTMLElement>(
        ".pvs-list__outer-container .pvs-list__footer-wrapper .optional-action-target-wrapper[href*='details/education']"
      );
      const showAllCertificationsButton = document.querySelector<HTMLElement>(
        ".pvs-list__outer-container .pvs-list__footer-wrapper .optional-action-target-wrapper[href*='details/certifications']"
      );

      candidateDetailsData.skills_complete = !showAllSkillsButton;
      candidateDetailsData.experiences_complete = !showAllExperienceButton;
      candidateDetailsData.educations_complete = !showAllEducationButton;
      candidateDetailsData.certifications_complete =
        !showAllCertificationsButton;

      const profileImageContainer = document.querySelector<HTMLElement>(
        "img.pv-top-card-profile-picture__image"
      );

      if (profileImageContainer) {
        const getImgUrl = profileImageContainer.getAttribute("src");

        candidateDetailsData.profile.display_image = getImgUrl;

        // const base64String: any = await getBase64ImageFromUrl(getImgUrl);

        // if (base64String) {
        //   candidateDetailsData.profile.display_image = base64String;
        // }
      }

      candidateDetailsData.people_also_viewed_links =
        await crawlPeopleAlsoViewedSection();
      candidateDetailsData.recommendations =
        await crawlRecommendationsSection();
      candidateDetailsData.languages = await crawlLanguageSection();
      candidateDetailsData.projects = await crawlProjectsSection();
      candidateDetailsData.awards = await crawlAwardsSection();
      candidateDetailsData.volunteers = await crawlVolunteerWorkSection();
      candidateDetailsData.courses = await crawlCoursesSection();
    }

    if (
      subPathType !== "root" &&
      subPathType !== "root_rps" &&
      !candidateDetailsData.profile.profile_url
    ) {
      const headTitle = document.querySelector<HTMLElement>("head title");

      if (headTitle) {
        let name =
          headTitle.innerText && headTitle.innerText.length > 1
            ? headTitle.innerText.split("|").length >= 1
              ? headTitle.innerText.split("|")[1]
                ? headTitle.innerText.split("|")[1].trim()
                : ""
              : ""
            : "";

        if (name.toLowerCase() === "linkedin") {
          name = document.querySelector<HTMLElement>(
            ".artdeco-entity-lockup__title"
          ).innerText
            ? document.querySelector<HTMLElement>(
                ".artdeco-entity-lockup__title"
              ).innerText
            : name;
        }

        candidateDetailsData.profile.profile_url = `https://www.linkedin.com/in/${candidateDetailsData.username}`;
        candidateDetailsData.profile.url = `https://www.linkedin.com/in/${candidateDetailsData.username}`;
        candidateDetailsData.profile.name = name;
        candidateDetailsData.profile.profile_username =
          candidateDetailsData.username;
        candidateDetailsData.platform = "linkedin";
      }
    }
  }

  return candidateDetailsData;
}

let candidateData: CANDIDATE_DETAILS_TYPE = {
  ...defaultCandidateDetailsData,
};

export const handlerTriggerInitFunction = async (incognito?: boolean) => {
  if (!incognito) {
    const updateDetails = await mainLogicFlow();

    if (updateDetails.profile.name) {
      const candidateDataHolder = _.cloneDeep(candidateData);

      if (candidateDataHolder.username === updateDetails.username) {
        candidateDataHolder.username = updateDetails.username;

        candidateDataHolder.profile = updateDetails.profile;

        if (updateDetails.skills.length >= candidateDataHolder.skills.length) {
          candidateDataHolder.skills = updateDetails.skills;
        }

        if (
          updateDetails.experiences.length >=
          candidateDataHolder.experiences.length
        ) {
          candidateDataHolder.experiences = updateDetails.experiences;
        }

        if (
          updateDetails.educations.length >=
          candidateDataHolder.educations.length
        ) {
          candidateDataHolder.educations = updateDetails.educations;
        }

        if (
          updateDetails.certifications.length >=
          candidateDataHolder.certifications.length
        ) {
          candidateDataHolder.certifications = updateDetails.certifications;
        }

        candidateDataHolder.experiences_complete =
          updateDetails.experiences_complete;
        candidateDataHolder.educations_complete =
          updateDetails.educations_complete;
        candidateDataHolder.certifications_complete =
          updateDetails.certifications_complete;
        candidateDataHolder.people_also_viewed_links =
          updateDetails.people_also_viewed_links ?? [];
        candidateDataHolder.recommendations =
          updateDetails.recommendations ?? [];
        candidateDataHolder.languages = updateDetails.languages ?? [];
        candidateDataHolder.projects = updateDetails.projects ?? [];
        candidateDataHolder.awards = updateDetails.awards ?? [];
        candidateDataHolder.volunteers = updateDetails.volunteers ?? [];
        candidateDataHolder.courses = updateDetails.courses ?? [];

        candidateData = {
          ...candidateDataHolder,
        };
      } else {
        candidateData = {
          ...updateDetails,
        };
      }

      try {
        const storageResponse = await chrome.storage.sync.get([
          "scoutWebToken",
        ]);

        if (storageResponse["scoutWebToken"]) {
          await savePublicProfile({
            access_token: storageResponse["scoutWebToken"],
            candidateData: candidateData ?? null,
          });
        }
      } catch (error) {}

      if (
        !candidateData.profile.profile_url ||
        !candidateData.username ||
        !candidateData.profile.name
      ) {
        setTimeout(() => {
          handlerTriggerInitFunction();
        }, 1500);
      }
    }
  } else {
    const profileData = await crawlLimitedPublicProfile();

    try {
      const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

      if (
        storageResponse["scoutWebToken"] &&
        profileData.profile.name &&
        profileData.profile.profile_username
      ) {
        await savePublicProfile({
          access_token: storageResponse["scoutWebToken"],
          candidateData: profileData ?? null,
        });
      }
    } catch (error) {}
  }
};

function retrieveLinkedinUsername(url: string) {
  try {
    const urlClass = typeof url === "string" ? new URL(url) : null;

    if (
      url &&
      (url.includes("linkedin.com/in") ||
        url.includes("linkedin.com/talent")) &&
      urlClass &&
      urlClass.pathname &&
      urlClass.pathname.split("/").length > 1
    ) {
      const urlParams = new URLSearchParams(urlClass.search);

      const username =
        (url.includes("linkedin.com/in")
          ? urlClass.pathname.split("/")[2]
          : urlParams.get("username")) ?? null;

      return username;
    } else {
      throw "Not a valid LinkedIn URL";
    }
  } catch (error) {
    return null;
  }
}

let previousUrl = null;

export const linkedinObserver = new MutationObserver(async function (
  mutations,
  observer
) {
  const currentUrl = window.location.href;

  try {
    const currentProfileUsername = retrieveLinkedinUsername(currentUrl);

    if (currentProfileUsername && currentUrl !== previousUrl) {
      const { mainPathType, subPathType } = determinePath(currentUrl);

      if (mainPathType !== "unrelated" && mainPathType === "public_profile") {
        let proceed = true;

        if (
          subPathType === "details_skills" ||
          subPathType === "details_experience" ||
          subPathType === "details_languages" ||
          subPathType === "details_recommendations" ||
          subPathType === "details_projects" ||
          subPathType === "details_awards" ||
          subPathType === "details_volunteer" ||
          subPathType === "details_courses"
        ) {
          const requiredContainer = await checkIfTitleExist(
            "main section.artdeco-card.ember-view.pb3"
          );

          proceed = requiredContainer ? true : false;
        } else {
          const topProfileContainer = await checkIfTitleExist(
            "section.artdeco-card.ember-view.pv-top-card",
            null,
            null,
            250
          );

          if (topProfileContainer) {
            for (let key of Array.from(Array(30).keys())) {
              await delay(key > 15 ? 1000 : 250, null);

              const topContainerNextEl = topProfileContainer.nextElementSibling;

              if (
                topProfileContainer &&
                topContainerNextEl &&
                !topContainerNextEl.classList.contains(
                  "pvs-loader__profile-card"
                )
              ) {
                proceed = true;
                break;
              } else {
                proceed = false;
              }
            }
          } else {
            proceed = false;
          }
        }

        if (currentUrl !== previousUrl && proceed) {
          previousUrl = currentUrl;
          await handlerTriggerInitFunction();

          if (mainPathType === "public_profile" && subPathType === "root") {
            const peopleYouMayKnowPublicUrls =
              await crawlPeopleYouMayKnowSection();

            const storageResponse = await chrome.storage.sync.get([
              "scoutWebToken",
            ]);

            if (peopleYouMayKnowPublicUrls.length > 0) {
              await saveLinkedinScrapUserLinksSearchResult({
                access_token: storageResponse["scoutWebToken"],
                source: window.location.href,
                urls: peopleYouMayKnowPublicUrls,
              });
            }
          }
        } else if (
          !proceed &&
          mainPathType === "public_profile" &&
          currentUrl !== previousUrl
        ) {
          previousUrl = currentUrl;
          await handlerTriggerInitFunction(true);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});

function delay(t, v) {
  return new Promise((resolve) => setTimeout(resolve, t, v));
}
