import queryString from "query-string";

import {
  CANDIDATE_DETAILS_TYPE,
  PUBLIC_AWARD_DATA_TYPE,
  PUBLIC_CERTIFICATION_DATA_TYPE,
  PUBLIC_COURSE_DATA_TYPE,
  PUBLIC_EDUCATIOM_DATA_TYPE,
  PUBLIC_EXPERIENCE_DATA_TYPE,
  PUBLIC_LANGUAGE_DATA_TYPE,
  PUBLIC_PROJECT_DATA_TYPE,
  PUBLIC_RECOMMENDATION_DATA_TYPE,
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE,
} from "../../../../typescript/types/candidate";
import { checkIfTitleExist } from "../../utils";

export async function crawlLimitedPublicProfile(): Promise<CANDIDATE_DETAILS_TYPE> {
  try {
    const candidateDetailsData: CANDIDATE_DETAILS_TYPE = {
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
    };

    const locationHref = queryString.parseUrl(window.location.href);

    const currentUrl = locationHref.url;

    candidateDetailsData.username = currentUrl.split("/in/")[1];

    if (candidateDetailsData.username.includes("/")) {
      candidateDetailsData.username =
        candidateDetailsData.username.split("/")[0];
    }

    candidateDetailsData.profile.profile_username =
      candidateDetailsData.username;

    if (candidateDetailsData.username) {
      candidateDetailsData.profile.profile_url = `https://www.linkedin.com/in/${candidateDetailsData.username}`;
      candidateDetailsData.profile.url = `https://www.linkedin.com/in/${candidateDetailsData.username}`;
    }

    candidateDetailsData.profile.name = crawlUserGivenName();

    if (!candidateDetailsData.profile.name)
      throw "Profile doesn't contain name";

    candidateDetailsData.profile.title = crawlUserSummary();
    candidateDetailsData.experiences = crawlUserExperience();
    candidateDetailsData.educations = crawlUserEducation();
    candidateDetailsData.people_also_viewed_links =
      await crawlPeopleAlsoViewedSection();
    candidateDetailsData.recommendations = await crawlRecommendationsSection();
    candidateDetailsData.languages = await crawlLanguagesSection();
    candidateDetailsData.projects = await crawlProjectsSection();
    candidateDetailsData.awards = await crawlAwardsSection();
    candidateDetailsData.volunteers = await crawlVolunteerWorkSection();
    candidateDetailsData.courses = await crawlCoursesSection();
    candidateDetailsData.certifications = await crawlCertificationSection();

    return candidateDetailsData;
  } catch (error) {
    return null;
  }
}

async function crawlCertificationSection(): Promise<
  PUBLIC_CERTIFICATION_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Licenses & Certifications",
      true,
      100
    );

    let certArr: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructCert: PUBLIC_CERTIFICATION_DATA_TYPE = {
            name: null,
            dates: null,
          };

          const certNameContainer = el.querySelector<HTMLElement>(
            "h3.profile-section-card__title"
          );
          const certDateContainer = el.querySelector<HTMLElement>("time");

          constructCert.name = certNameContainer
            ? certNameContainer.textContent.trim()
            : null;
          constructCert.dates = certDateContainer
            ? certDateContainer.textContent.trim()
            : null;

          if (constructCert.name && constructCert.dates) {
            certArr.push(constructCert);
          }
        }
      }
    }

    return certArr;
  } catch (error) {
    return [];
  }
}

async function crawlCoursesSection(): Promise<PUBLIC_COURSE_DATA_TYPE[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Courses",
      true,
      100
    );

    let courseArr: PUBLIC_COURSE_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructVolunteer: PUBLIC_COURSE_DATA_TYPE = {
            name: null,
          };

          const courseNameContainer = el.querySelector<HTMLElement>("h3");

          constructVolunteer.name = courseNameContainer
            ? courseNameContainer.textContent.trim()
            : null;

          if (constructVolunteer.name) {
            courseArr.push(constructVolunteer);
          }
        }
      }
    }

    return courseArr;
  } catch (error) {
    return [];
  }
}

async function crawlVolunteerWorkSection(): Promise<
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Volunteer Experience",
      true,
      100
    );

    let volunteerArr: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructVolunteer: PUBLIC_VOLUNTEER_WORK_DATA_TYPE = {
            title: null,
            company: null,
            date: null,
            description: null,
          };

          const volunteerTitleContainer = el.querySelector<HTMLElement>("h3");
          const volunteerCompanyContainer = el.querySelector<HTMLElement>("h4");
          const volunteerDateContainer = el.querySelector<HTMLElement>(
            ".volunteering__item.volunteering__item--duration time"
          );
          const causeContainer = el.querySelector<HTMLElement>(
            ".volunteering__item.volunteering__item--cause"
          );

          constructVolunteer.title = volunteerTitleContainer
            ? volunteerTitleContainer.textContent.trim()
            : null;
          constructVolunteer.company = volunteerCompanyContainer
            ? volunteerCompanyContainer.textContent.trim()
            : null;
          constructVolunteer.date = volunteerDateContainer
            ? volunteerDateContainer.textContent.trim()
            : null;

          if (causeContainer) {
            const causeContainerNextEl = causeContainer.nextElementSibling;

            constructVolunteer.description = causeContainerNextEl
              ? causeContainerNextEl.textContent.trim()
              : null;
          }

          if (
            constructVolunteer.title &&
            constructVolunteer.company &&
            constructVolunteer.date &&
            constructVolunteer.description
          ) {
            volunteerArr.push(constructVolunteer);
          }
        }
      }
    }

    return volunteerArr;
  } catch (error) {
    return [];
  }
}

async function crawlAwardsSection(): Promise<PUBLIC_AWARD_DATA_TYPE[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Honors & Awards",
      true,
      100
    );

    let awardArr: PUBLIC_AWARD_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructAward: PUBLIC_AWARD_DATA_TYPE = {
            award_name: null,
            issuer: null,
            date: null,
            description: null,
          };

          const awardNameContainer = el.querySelector<HTMLElement>("h3");
          const awardIssuerContainer = el.querySelector<HTMLElement>("h4");
          const dateContainer = el.querySelector<HTMLElement>(
            ".profile-section-card__meta .date-range time"
          );
          const descContainer = el.querySelector<HTMLElement>(
            ".profile-section-card__meta p"
          );

          constructAward.award_name = awardNameContainer
            ? awardNameContainer.textContent.trim()
            : null;
          constructAward.issuer = awardIssuerContainer
            ? awardIssuerContainer.textContent.trim().replace("-", "")
            : "";
          constructAward.date = dateContainer
            ? dateContainer.textContent.trim()
            : null;
          constructAward.description = descContainer
            ? descContainer.textContent.trim()
            : "";

          if (
            constructAward.award_name &&
            constructAward.issuer !== null &&
            constructAward.issuer !== undefined &&
            constructAward.date &&
            constructAward.description !== null &&
            constructAward.description !== undefined
          ) {
            awardArr.push(constructAward);
          }
        }
      }
    }

    return awardArr;
  } catch (error) {
    return [];
  }
}

async function crawlProjectsSection(): Promise<PUBLIC_PROJECT_DATA_TYPE[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Projects",
      true,
      100
    );

    const projArr: PUBLIC_PROJECT_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructProj: PUBLIC_PROJECT_DATA_TYPE = {
            project_name: null,
            dates: null,
            description: null,
          };

          const projectNameContainer = el.querySelector<HTMLElement>("h3");
          const projectDatesContainer = el.querySelector<HTMLElement>("h4");
          const projectDescContainer = el.querySelector<HTMLElement>(
            ".profile-section-card__meta .show-more-less-text p"
          );

          constructProj.project_name = projectNameContainer
            ? projectNameContainer.textContent.trim()
            : null;
          constructProj.dates = projectDatesContainer
            ? projectDatesContainer.textContent.trim()
            : null;
          constructProj.description = projectDescContainer
            ? projectDescContainer.textContent.trim()
            : null;

          if (
            constructProj.project_name &&
            constructProj.dates &&
            constructProj.description
          ) {
            projArr.push(constructProj);
          }
        }
      }
    }

    return projArr;
  } catch (error) {
    return [];
  }
}

async function crawlLanguagesSection(): Promise<PUBLIC_LANGUAGE_DATA_TYPE[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Languages",
      true,
      100
    );

    const langArr: PUBLIC_LANGUAGE_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructLang: PUBLIC_LANGUAGE_DATA_TYPE = {
            language: null,
            proficiency: null,
          };

          constructLang.language = el.querySelector<HTMLElement>(
            ".profile-section-card__title"
          )
            ? el
                .querySelector<HTMLElement>(".profile-section-card__title")
                .textContent.trim()
            : null;
          constructLang.proficiency = el.querySelector<HTMLElement>(
            ".profile-section-card__subtitle"
          )
            ? el
                .querySelector<HTMLElement>(".profile-section-card__subtitle")
                .textContent.trim()
            : null;

          if (constructLang.language && constructLang.proficiency) {
            langArr.push(constructLang);
          }
        }
      }
    }

    return langArr;
  } catch (error) {
    return [];
  }
}

async function crawlRecommendationsSection(): Promise<
  PUBLIC_RECOMMENDATION_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "Recommendations received",
      true,
      100
    );

    const recArr: PUBLIC_RECOMMENDATION_DATA_TYPE[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructRec: PUBLIC_RECOMMENDATION_DATA_TYPE = {
            name: null,
            content: null,
          };

          const linkEl = el.querySelector<HTMLElement>("a");
          const contentContainer = linkEl ? linkEl.lastElementChild : null;

          if (contentContainer) {
            const nameContaienr =
              contentContainer.querySelector<HTMLElement>("h3");
            const descContaienr =
              contentContainer.querySelector<HTMLElement>("p");

            constructRec.name = nameContaienr
              ? nameContaienr.textContent.trim()
              : null;
            constructRec.content = descContaienr
              ? descContaienr.textContent.trim()
              : null;
          }

          if (constructRec.name && constructRec.content) {
            recArr.push(constructRec);
          }
        }
      }
    }

    return recArr;
  } catch (error) {
    return [];
  }
}

async function crawlPeopleAlsoViewedSection(): Promise<string[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".section-title",
      "People also viewed",
      true,
      100
    );

    const linksArr: string[] = [];

    if (titleContainer) {
      const nextEl = titleContainer.nextElementSibling;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul")
        : null;

      if (nextElListContainer) {
        // const showMoreBtn = nextEl.querySelector<HTMLElement>("button");

        // if (showMoreBtn) {
        //   showMoreBtn.click();
        //   await delay(250, null);
        //   nextElListContainer = nextEl.querySelector<HTMLElement>("ul");
        // }

        if (nextElListContainer && nextElListContainer.children.length > 0) {
          const lookForAllEl = Array.from(nextElListContainer.children);

          for (const el of lookForAllEl) {
            const linkEl = el.querySelector<HTMLElement>("a");
            const profileUrl = linkEl ? linkEl.getAttribute("href") : null;

            if (profileUrl) {
              linksArr.push(profileUrl);
            }
          }
        }
      }
    }

    return linksArr;
  } catch (error) {
    return [];
  }
}

function crawlUserGivenName() {
  let name = null;

  const infoContainer = document.querySelector<HTMLElement>(
    ".top-card-layout__entity-info"
  );

  const nameContainer = infoContainer
    ? infoContainer.querySelector<HTMLElement>("h1.top-card-layout__title")
    : null;

  name = nameContainer ? nameContainer.textContent.trim() : null;

  return name;
}

function crawlUserSummary() {
  let summary = null;

  const summaryContainer =
    document.querySelector<HTMLElement>("section.summary");

  const summaryContentContainer = summaryContainer
    ? summaryContainer.querySelector<HTMLElement>(
        ".core-section-container__content"
      )
    : null;

  summary = summaryContentContainer
    ? summaryContentContainer.textContent.trim()
    : null;

  return summary;
}

function crawlUserExperience(): PUBLIC_EXPERIENCE_DATA_TYPE[] {
  let experienceList: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

  const expListContainer = document.querySelector<HTMLElement>(
    "ul.experience__list"
  );

  if (expListContainer && expListContainer.children.length > 0) {
    experienceList = Array.from(expListContainer.children)
      .map((el) => {
        try {
          const exp_: PUBLIC_EXPERIENCE_DATA_TYPE = {
            job_title: null,
            company_name: null,
            job_subtitles: null,
            dates: null,
            duration: null,
            location: null,
            description: "",
          };

          const contentContainer = el.querySelector<HTMLElement>(
            ".profile-section-card__contents"
          );

          if (contentContainer) {
            const job_title_container =
              contentContainer.querySelector<HTMLElement>(
                "h3.profile-section-card__title"
              );
            exp_.job_title = job_title_container
              ? job_title_container.textContent.trim()
              : null;

            const company_name_container =
              contentContainer.querySelector<HTMLElement>(
                "h4.profile-section-card__subtitle"
              );
            exp_.company_name = company_name_container
              ? company_name_container.textContent.trim()
              : null;

            const subTitleContainer =
              contentContainer.querySelector<HTMLElement>(
                ".profile-section-card__meta"
              );

            if (subTitleContainer) {
              const durationContainer =
                subTitleContainer.querySelector<HTMLElement>(
                  ".experience-item__duration span"
                );
              const locationCotnainer =
                subTitleContainer.querySelector<HTMLElement>(
                  ".experience-item__location"
                );

              if (durationContainer) {
                const durationTextContainer =
                  durationContainer.querySelector<HTMLElement>(
                    "span.date-range__duration"
                  );

                exp_["duration"] = durationTextContainer
                  ? durationTextContainer.textContent.trim()
                  : null;
                exp_["dates"] = exp_["duration"]
                  ? durationContainer.textContent
                      .trim()
                      .replace(exp_["duration"], "")
                  : null;
              }

              if (locationCotnainer) {
                const locationRawTxt = locationCotnainer.textContent.trim();
                exp_.location = locationRawTxt;
              }
            }
          }

          return exp_.job_title ? exp_ : null;
        } catch (error) {
          return null;
        }
      })
      .filter((item) => item !== null);
  }

  return experienceList;
}

function crawlUserEducation() {
  let educationList: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

  const eduListContainer =
    document.querySelector<HTMLElement>("ul.education__list");

  if (eduListContainer && eduListContainer.children.length > 0) {
    educationList = Array.from(eduListContainer.children)
      .map((el) => {
        try {
          const edu_: PUBLIC_EDUCATIOM_DATA_TYPE = {
            institution: null,
            degree_name: null,
            field: null,
            dates: null,
          };

          const contentContainer = el.querySelector<HTMLElement>(
            ".profile-section-card__contents"
          );

          if (contentContainer) {
            const institution_title_container =
              contentContainer.querySelector<HTMLElement>(
                "h3.profile-section-card__title"
              );
            edu_.institution = institution_title_container
              ? institution_title_container.textContent.trim()
              : null;

            const degree_name_container =
              contentContainer.querySelector<HTMLElement>(
                "h4.profile-section-card__subtitle"
              );
            edu_.degree_name = degree_name_container
              ? degree_name_container.textContent.trim()
              : null;

            edu_.field = edu_.degree_name ? edu_.degree_name : null;

            const durationContainer =
              contentContainer.querySelector<HTMLElement>(
                ".education__item--duration"
              );

            edu_.dates = durationContainer
              ? durationContainer.textContent.trim()
              : null;
          }

          return edu_.institution && edu_.degree_name && edu_.field
            ? edu_
            : null;
        } catch (error) {
          return null;
        }
      })
      .filter((item) => item !== null);
  }

  return educationList;
}
