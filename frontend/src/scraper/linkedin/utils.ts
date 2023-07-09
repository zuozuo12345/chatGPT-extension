import queryString from "query-string";

import { PATH_TYPE, SUB_PATH_TYPE } from "../../typescript/types/url";

export function determinePathType(url: string): PATH_TYPE {
  let type: PATH_TYPE = null;

  if (url.includes("linkedin.com/in")) {
    type = "public_profile";
  } else if (
    (url.includes("linkedin.com") && url.indexOf("/profile") > -1) ||
    (url.includes("linkedin.com") && url.indexOf("/talent") > -1)
  ) {
    type = "rps";
  } else {
    type = "unrelated";
  }

  return type;
}

export function determineSubPathType(
  pathType: PATH_TYPE,
  url: string
): SUB_PATH_TYPE {
  let type: SUB_PATH_TYPE = null;

  const urlClass = new URL(url);
  const parseQueryParams = queryString.parse(urlClass.search);
  const searchContextIdQuery =
    parseQueryParams && "searchContextId" in parseQueryParams
      ? parseQueryParams["searchContextId"]
      : null;

  if (pathType === "public_profile") {
    if (url.includes("/overlay/contact-info")) {
      type = "contact_info";
    } else if (url.includes("details/experience")) {
      type = "details_experience";
    } else if (url.includes("details/skills")) {
      type = "details_skills";
    } else if (url.includes("details/education")) {
      type = "details_education";
    } else if (url.includes("details/certifications")) {
      type = "details_certifications";
    } else if (url.includes("details/languages")) {
      type = "details_languages";
    } else if (url.includes("details/recommendations")) {
      type = "details_recommendations";
    } else if (url.includes("details/projects")) {
      type = "details_projects";
    } else if (url.includes("details/honors")) {
      type = "details_awards";
    } else if (url.includes("details/volunteering-experiences")) {
      type = "details_volunteer";
    } else if (url.includes("details/courses")) {
      type = "details_courses";
    } else if (url.includes("/recent-activity")) {
      type = "recent_activity";
    } else {
      type = "root";
    }
  } else if (pathType === "rps") {
    type = "root_rps";

    if (
      url.includes("talent/search") &&
      !url.includes("talent/search/profile")
    ) {
      type = "rps_search";
    } else if (url.includes("talent/profile")) {
      type = "rps_profile";
    } else if (url.includes("talent/search/profile")) {
      type = "rps_search_profile";
    } else if (
      (url.includes("talent/hire") &&
        url.includes("manage") &&
        !url.includes("profile")) ||
      (url.includes("talent/hire") &&
        url.includes("discover") &&
        url.includes("applicants") &&
        !url.includes("profile"))
    ) {
      type = "rps_hire";
    } else if (
      (url.includes("talent/hire") &&
        url.includes("manage") &&
        url.includes("profile")) ||
      (url.includes("talent/hire") &&
        url.includes("discover") &&
        url.includes("applicants") &&
        url.includes("profile"))
    ) {
      type = "rps_hire_profile";
    } else if (
      url.includes("talent/hire") &&
      url.includes("discover") &&
      url.includes("recruiterSearch") &&
      (!url.includes("profile") ||
        (searchContextIdQuery && url.includes("profile")))
    ) {
      type = "rps_hire_recruiterSearch";
    } else if (
      url.includes("talent/hire") &&
      url.includes("discover") &&
      url.includes("recruiterSearch") &&
      url.includes("profile")
    ) {
      type = "rps_hire_recruiterSearch_profile";
    } else if (
      url.includes("talent/hire") &&
      url.includes("discover") &&
      url.includes("automatedSourcing") &&
      url.includes("review") &&
      !url.includes("profile")
    ) {
      type = "rps_hire_automatedSourcing";
    } else if (
      url.includes("talent/hire") &&
      url.includes("discover") &&
      url.includes("automatedSourcing") &&
      url.includes("review") &&
      url.includes("profile")
    ) {
      type = "rps_hire_automatedSourcing_profile";
    }
  } else {
    type = "unrelated";
  }

  return type;
}

export function determinePath(url: string) {
  const mainPathType = determinePathType(url);
  const subPathType = determineSubPathType(mainPathType, url);

  return {
    mainPathType,
    subPathType,
  };
}

export const getDurationFromMonthYear = (
  startMonth,
  startYear,
  endMonth,
  endYear
) => {
  if (!endYear) {
    //Get current year
    endYear = new Date().getFullYear();
    endMonth = new Date().getMonth() + 1;
  }
  if (!endMonth) {
    endMonth = new Date().getMonth() + 1;
  }
  if (!startMonth) {
    startMonth = new Date().getMonth() + 1;
  }
  let numYears = 0;
  let numMonths = 0;
  if (startMonth > endMonth) {
    numMonths = endMonth + (12 - startMonth);
    numYears = endYear - startYear - 1;
  } else {
    numMonths = endMonth - startMonth;
    numYears = endYear - startYear;
  }
  if (numYears && numMonths) {
    return `${numYears} yrs ${numMonths} mos`;
  } else if (numYears) {
    return `${numYears} yrs`;
  }
  return `${numMonths} mos`;
};

export function delay(t, v) {
  return new Promise((resolve) => setTimeout(resolve, t, v));
}

export async function checkIfTitleExist(
  elementClass: string,
  innerText?: string,
  contains?: boolean,
  timer?: number
) {
  try {
    const containsText = contains ?? false;

    let titleContainer: HTMLElement = null;

    for (let i = 0; i < 20; i++) {
      if (titleContainer) {
        break;
      }

      if (innerText) {
        const lookForAllEl = Array.from(
          document.querySelectorAll<HTMLElement>(elementClass)
        );

        if (lookForAllEl && lookForAllEl.length) {
          const filterResult = lookForAllEl.find((el) => {
            return contains
              ? el.innerText
                  .trim()
                  .toLowerCase()
                  .includes(`${innerText.toLowerCase()}`)
              : el.innerText.trim().toLowerCase() === innerText.toLowerCase();
          });

          titleContainer = filterResult;
          break;
        }
      } else {
        const titleContainerQuerySelector =
          document.querySelector<HTMLElement>(elementClass);

        if (titleContainerQuerySelector) {
          titleContainer = titleContainerQuerySelector;
          break;
        }
      }

      await delay(timer ? timer : 250, null);
    }

    if (!titleContainer) {
      throw "Can't be found";
    }

    return titleContainer;
  } catch (err) {
    return null;
  }
}
