import moment from "moment";

import {
  PUBLIC_AWARD_DATA_TYPE,
  PUBLIC_COURSE_DATA_TYPE,
  PUBLIC_LANGUAGE_DATA_TYPE,
  PUBLIC_PROJECT_DATA_TYPE,
  PUBLIC_RECOMMENDATION_DATA_TYPE,
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE,
} from "../../../../typescript/types/candidate";
import { checkIfTitleExist, delay } from "../../utils";

export async function rpsRetrieveProfileImg(profileImg) {
  try {
    let fullProfileImgUrl: string = null;

    if (profileImg) {
      const rootUrl = profileImg["rootUrl"] ? profileImg["rootUrl"] : null;

      const artifacts =
        profileImg["artifacts"] &&
        typeof profileImg["artifacts"] === "object" &&
        profileImg["artifacts"].length > 0
          ? profileImg["artifacts"]
          : null;

      if (rootUrl && artifacts) {
        artifacts.forEach((item) => {
          if (item["fileIdentifyingUrlPathSegment"]) {
            fullProfileImgUrl = `${rootUrl}${item["fileIdentifyingUrlPathSegment"]}`;
          }
        });
      }
    } else {
      fullProfileImgUrl = (await rpsScrapProfileImg()).profileImg;
    }

    return {
      profileImg: fullProfileImgUrl,
    };
  } catch (err) {
    return {
      profileImg: null,
    };
  }
}

export async function rpsScrapProfileImg() {
  try {
    const titleContainer = await checkIfTitleExist(
      ".artdeco-entity-lockup__image .lockup__image-container img",
      null,
      false,
      50
    );

    if (!titleContainer) {
      throw "Can't be found";
    }

    const profileImg = titleContainer.getAttribute("src");

    return {
      profileImg: profileImg,
    };
  } catch (error) {
    return {
      profileImg: null,
    };
  }
}

export async function rpsRetrieveEmail(responseEmail: string) {
  try {
    let email: string = null;

    if (responseEmail && typeof responseEmail === "string") {
      email = responseEmail;
    } else {
      const titleContainer = await checkIfTitleExist(
        ".contact-info__email-address",
        null,
        false,
        50
      );

      if (!titleContainer) {
        throw "Can't be found";
      }

      email = titleContainer.textContent.trim();
    }

    return {
      email: email,
    };
  } catch (error) {
    return {
      email: null,
    };
  }
}

export async function rpsRetrievePhoneNumber(responsePhone: string) {
  try {
    let phone: string = null;

    if (responsePhone && typeof responsePhone === "string") {
      phone = responsePhone;
    } else {
      const titleContainer = await checkIfTitleExist(
        "span[data-test-contact-phone]",
        null,
        false,
        50
      );

      if (!titleContainer) {
        throw "Can't be found";
      }

      phone = titleContainer.textContent.trim();
    }

    return {
      phone: phone,
    };
  } catch (error) {
    return {
      phone: null,
    };
  }
}

export async function rpsRetrieveName(
  responseFirstName: string,
  responseLastName: string
) {
  try {
    let name: string = null;

    if (responseFirstName || responseLastName) {
      name = `${responseFirstName ? responseFirstName : ""}${
        responseLastName
          ? `${responseFirstName ? " " : ""}${responseLastName}`
          : ""
      }`;
    } else {
      const nameContainer = await checkIfTitleExist(
        `[data-test-row-lockup-full-name=""]`,
        null,
        false,
        50
      );

      if (!nameContainer) {
        throw "Can't be found";
      }

      name = nameContainer.textContent.trim();
    }

    return {
      name: name,
    };
  } catch (error) {
    return {
      name: null,
    };
  }
}

export async function rpsRetrieveWebsite(responseWebsite: string) {
  try {
    let website: string = null;

    if (responseWebsite && typeof responseWebsite === "string") {
      website = responseWebsite;
    } else {
      const websiteUlContainer = await checkIfTitleExist(
        ".personal-info__website-list",
        null,
        false,
        50
      );

      if (!websiteUlContainer) {
        throw "Can't be found";
      }

      if (websiteUlContainer && websiteUlContainer.childElementCount > 0) {
        const firstLinkEl =
          websiteUlContainer.children[0].querySelector<HTMLElement>("a");

        if (firstLinkEl) {
          website = firstLinkEl.getAttribute("href");
        }
      }
    }

    return {
      website: website,
    };
  } catch (error) {
    return {
      website: null,
    };
  }
}

export async function rpsRetrieveUsername(responseUsername: string) {
  try {
    let username: string = null;

    if (responseUsername && typeof responseUsername === "string") {
      username = responseUsername;
    } else {
      const publicProfileHoverEl = await checkIfTitleExist(
        "#artdeco-hoverable-outlet",
        null,
        false,
        50
      );

      if (!publicProfileHoverEl) {
        throw "Can't be found";
      }

      let goToPublicProfileLink =
        publicProfileHoverEl.querySelector<HTMLElement>(
          `[title="Open link in new tab"]`
        );

      if (!goToPublicProfileLink) {
        goToPublicProfileLink = publicProfileHoverEl.querySelector<HTMLElement>(
          `[href*="https://sg.linkedin.com/in/"]`
        );
      }

      if (goToPublicProfileLink && goToPublicProfileLink.getAttribute("href")) {
        username = goToPublicProfileLink.getAttribute("href").split("/")[4]
          ? goToPublicProfileLink.getAttribute("href").split("/")[4]
          : null;
      }
    }

    return {
      username: username,
    };
  } catch (error) {
    return {
      username: null,
    };
  }
}

export async function rpsRetrieveLocation(responseLocation: string) {
  try {
    let location: string = null;

    if (responseLocation && typeof responseLocation === "string") {
      location = responseLocation;
    } else {
      const locationContainer = await checkIfTitleExist(
        `[data-test-row-lockup-location=""][data-live-test-row-lockup-location=""]`,
        null,
        false,
        50
      );

      if (!locationContainer) {
        throw "Can't be found";
      }

      location = locationContainer.textContent
        .trim()
        .replace(/\s/g, "")
        .replace("·", "");
    }

    return {
      location: location,
    };
  } catch (error) {
    return {
      location: null,
    };
  }
}

export async function rpsRetrieveIndustry(responseIndustry: string) {
  try {
    let industry: string = null;

    if (responseIndustry && typeof responseIndustry === "string") {
      industry = responseIndustry;
    } else {
      const industryContainer = await checkIfTitleExist(
        `[data-test-current-employer-industry=""]`,
        null,
        false,
        50
      );

      if (!industryContainer) {
        throw "Can't be found";
      }

      industry = industryContainer.textContent.trim().replace("·", "").trim();
    }

    return {
      industry: industry,
    };
  } catch (error) {
    return {
      industry: null,
    };
  }
}

export async function rpsScrapProfileSummary(responseSummary: string) {
  try {
    let summary = null;

    if (responseSummary && typeof responseSummary === "string") {
      summary = responseSummary;
    } else {
      let summaryContainer = await checkIfTitleExist(
        ".lt-line-clamp__raw-line",
        null,
        false,
        50
      );

      if (!summaryContainer) {
        const titleContainer = await checkIfTitleExist(
          ".lt-line-clamp__line.lt-line-clamp__line--last",
          null,
          false,
          50
        );

        if (!titleContainer) {
          throw "Can't be found";
        }

        const showMoreSummaryButton = document.querySelector<HTMLElement>(
          ".lt-line-clamp__line.lt-line-clamp__line--last #line-clamp-show-more-button"
        );

        if (showMoreSummaryButton) {
          showMoreSummaryButton.click();

          summaryContainer = document.querySelector<HTMLElement>(
            ".lt-line-clamp__raw-line"
          );

          if (summaryContainer) {
            summary = summaryContainer.textContent
              .trim()
              .replace(/(\r\n|\n|\r)/gm, "");
          }
        }
      } else {
        summary = summaryContainer.textContent
          .trim()
          .replace(/(\r\n|\n|\r)/gm, "");
      }
    }

    return {
      summary:
        typeof summary === "string" && summary.replace(/\s/g, "") === ""
          ? null
          : summary,
    };
  } catch (error) {
    return {
      summary: null,
    };
  }
}

export async function rpsScrapeProfileRecommendations(
  rawRecommendations: any[] | null
): Promise<{
  recommendations: PUBLIC_RECOMMENDATION_DATA_TYPE[];
}> {
  try {
    let arrRec: PUBLIC_RECOMMENDATION_DATA_TYPE[] = [];

    if (rawRecommendations && rawRecommendations.length > 0) {
      for (const rawRec of rawRecommendations) {
        const cosntructRec: PUBLIC_RECOMMENDATION_DATA_TYPE = {
          name: null,
          content: null,
        };

        cosntructRec.name =
          rawRec &&
          rawRec["recommendationText"] &&
          typeof rawRec["recommendationText"] === "string"
            ? rawRec["recommendationText"]
            : null;
        const recFirstName =
          rawRec &&
          rawRec["recommenderResolutionResult"] &&
          rawRec["recommenderResolutionResult"]["firstName"] &&
          typeof rawRec["recommenderResolutionResult"]["firstName"] === "string"
            ? rawRec["recommenderResolutionResult"]["firstName"]
            : null;
        const recLastName =
          rawRec &&
          rawRec["recommenderResolutionResult"] &&
          rawRec["recommenderResolutionResult"]["lastName"] &&
          typeof rawRec["recommenderResolutionResult"]["lastName"] === "string"
            ? rawRec["recommenderResolutionResult"]["lastName"]
            : null;

        if (recFirstName || recLastName) {
          cosntructRec.content = `${recFirstName ? `${recFirstName} ` : ""}${
            recLastName ? `${recLastName}` : ""
          }`;
        }

        if (cosntructRec.name && cosntructRec.content) {
          arrRec.push(cosntructRec);
        }
      }
    } else {
      const recommendationTitle = await checkIfTitleExist(
        "header",
        "Recommendations",
        false,
        50
      );

      const listEl = recommendationTitle
        ? recommendationTitle.nextElementSibling
        : null;

      const listElChild = listEl ? listEl.children : null;

      if (listElChild && listElChild.length > 0) {
        Array.from(listElChild).forEach(async (liEl) => {
          const cosntructRec: PUBLIC_RECOMMENDATION_DATA_TYPE = {
            name: null,
            content: null,
          };

          const recDetails = liEl.querySelector<HTMLElement>(
            ".recommendation__details"
          );
          const recContent = liEl.querySelector<HTMLElement>(
            ".recommendation__content"
          );

          cosntructRec.name =
            recDetails &&
            recDetails.querySelector(`dt[data-test-recommender-name=""]`)
              ? recDetails
                  .querySelector(`dt[data-test-recommender-name=""]`)
                  .textContent.trim()
              : null;

          if (recContent) {
            const showMoreBtn = recContent.querySelector<HTMLElement>(
              ".lt-line-clamp__more"
            );

            if (showMoreBtn) {
              showMoreBtn.click();
              await delay(50, null);

              const queryNewRecContent = liEl.querySelector<HTMLElement>(
                ".recommendation__content"
              );

              if (queryNewRecContent) {
                const paragraphEl =
                  queryNewRecContent.querySelector<HTMLElement>("p");
                const rawDescEl = paragraphEl.firstElementChild;
                cosntructRec.content = rawDescEl
                  ? rawDescEl.textContent.trim()
                  : null;
              }
            }
          }

          if (cosntructRec.name && cosntructRec.content) {
            arrRec.push(cosntructRec);
          }
        });
      }
    }

    return {
      recommendations: arrRec,
    };
  } catch (error) {
    return {
      recommendations: [],
    };
  }
}

export async function rpsScrapeProfileLanguages(
  rawLanguages:
    | {
        language: PUBLIC_LANGUAGE_DATA_TYPE["language"];
        id: number;
        proficiency: PUBLIC_LANGUAGE_DATA_TYPE["proficiency"];
      }[]
    | null
): Promise<{
  languages: PUBLIC_LANGUAGE_DATA_TYPE[];
}> {
  try {
    let arrLang: PUBLIC_LANGUAGE_DATA_TYPE[] = [];

    if (rawLanguages && rawLanguages.length > 0) {
      for (const rawRec of rawLanguages) {
        const cosntructLang: PUBLIC_LANGUAGE_DATA_TYPE = {
          language: null,
          proficiency: null,
        };

        cosntructLang.language = rawRec["name"] ? rawRec["name"] : null;
        cosntructLang.proficiency = rawRec["proficiency"]
          ? rawRec["proficiency"]
          : null;

        if (cosntructLang.proficiency) {
          cosntructLang.proficiency =
            cosntructLang.proficiency === "FULL_PROFESSIONAL"
              ? "Full professional proficiency"
              : cosntructLang.proficiency === "NATIVE_OR_BILINGUAL"
              ? "Native or bilingual proficiency"
              : cosntructLang.proficiency === "ELEMENTARY"
              ? "Elementary proficiency"
              : cosntructLang.proficiency === "LIMITED_WORKING"
              ? "Limited working proficiency"
              : cosntructLang.proficiency;
        }

        if (cosntructLang.language && cosntructLang.proficiency) {
          arrLang.push(cosntructLang);
        }
      }
    } else {
      const langTitle = await checkIfTitleExist(
        "header",
        "Languages",
        false,
        50
      );

      if (langTitle) {
        const headerTitleParent = langTitle
          ? langTitle.closest(
              ".accomplishments-expandable-list__title-container"
            )
          : null;

        let headerTitleParent_Parent = headerTitleParent
          ? headerTitleParent.parentElement
          : null;

        const showMoreButton = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("button")
          : null;

        if (showMoreButton) {
          showMoreButton.click();
          await delay(50, null);
          headerTitleParent_Parent = headerTitleParent
            ? headerTitleParent.parentElement
            : null;
        }

        const ulEl = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("ul")
          : null;

        if (ulEl && ulEl.children.length > 0) {
          Array.from(ulEl.children).forEach((liEl) => {
            const cosntructLang: PUBLIC_LANGUAGE_DATA_TYPE = {
              language: null,
              proficiency: null,
            };

            const liElChildren = liEl.children;

            if (liElChildren && liElChildren.length === 2) {
              cosntructLang.language = liElChildren[0].textContent.trim();
              cosntructLang.proficiency = liElChildren[1].textContent.trim();
            }

            if (cosntructLang.language && cosntructLang.proficiency) {
              arrLang.push(cosntructLang);
            }
          });
        }
      }
    }

    return {
      languages: arrLang,
    };
  } catch (error) {
    return {
      languages: [],
    };
  }
}

export async function rpsScrapeProfileProjects(
  rawProjects: any[] | null
): Promise<{
  projects: PUBLIC_PROJECT_DATA_TYPE[];
}> {
  try {
    let arrProj: PUBLIC_PROJECT_DATA_TYPE[] = [];

    if (rawProjects && rawProjects.length > 0) {
      for (const rawRec of rawProjects) {
        const constructProj: PUBLIC_PROJECT_DATA_TYPE = {
          project_name: null,
          dates: null,
          description: null,
        };

        constructProj.description =
          rawRec && rawRec["description"] ? rawRec["description"] : null;
        constructProj.project_name =
          rawRec && rawRec["title"] ? rawRec["title"] : null;

        if (rawRec && (rawRec["endDateOn"] || rawRec["startDateOn"])) {
          let date_ = "";

          if (
            rawRec["startDateOn"] &&
            (rawRec["startDateOn"]["month"] || rawRec["startDateOn"]["year"])
          ) {
            date_ += `${
              rawRec["startDateOn"]["month"]
                ? `${moment(`${rawRec["startDateOn"]["month"]}`, "M").format(
                    "MMMM"
                  )}${
                    rawRec["startDateOn"]["year"]
                      ? ` ${rawRec["startDateOn"]["year"]}`
                      : ""
                  }`
                : rawRec["startDateOn"]["year"]
                ? `${rawRec["startDateOn"]["year"]}`
                : ""
            }`;
          }

          if (
            rawRec["endDateOn"] &&
            (rawRec["endDateOn"]["month"] || rawRec["endDateOn"]["year"])
          ) {
            date_ += `${date_.replace(/\s/g, "") !== "" ? ` - ` : " "}${
              rawRec["endDateOn"]["month"]
                ? `${moment(`${rawRec["endDateOn"]["month"]}`, "M").format(
                    "MMMM"
                  )}${
                    rawRec["endDateOn"]["year"]
                      ? ` ${rawRec["endDateOn"]["year"]}`
                      : ""
                  }`
                : rawRec["endDateOn"]["year"]
                ? `${rawRec["endDateOn"]["year"]}`
                : ""
            }`;
          }

          constructProj.dates = date_.replace(/\s/g, "") === "" ? null : date_;
        }

        if (
          constructProj.project_name &&
          constructProj.dates &&
          constructProj.description
        ) {
          arrProj.push(constructProj);
        }
      }
    } else {
      const langTitle = await checkIfTitleExist(
        "header",
        "Projects",
        false,
        50
      );

      if (langTitle) {
        const headerTitleParent = langTitle
          ? langTitle.closest(
              ".accomplishments-expandable-list__title-container"
            )
          : null;

        let headerTitleParent_Parent = headerTitleParent
          ? headerTitleParent.parentElement
          : null;

        const showMoreButton = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("button")
          : null;

        if (showMoreButton) {
          showMoreButton.click();
          await delay(50, null);
          headerTitleParent_Parent = headerTitleParent
            ? headerTitleParent.parentElement
            : null;
        }

        const ulEl = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("ul")
          : null;

        if (ulEl && ulEl.children.length > 0) {
          Array.from(ulEl.children).forEach((liEl) => {
            const constructProj: PUBLIC_PROJECT_DATA_TYPE = {
              project_name: null,
              dates: null,
              description: null,
            };

            const liContainer = liEl.firstElementChild;

            if (liContainer) {
              const projectNameContainer =
                liContainer.querySelector<HTMLElement>("header h3");
              const projectDescContainer =
                liContainer.querySelector<HTMLElement>(
                  ".accomplishments-base-entity__description"
                );
              const projectDatesContainer =
                liContainer.querySelector<HTMLElement>(
                  ".accomplishments-base-entity__date"
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
            }

            if (
              constructProj.project_name &&
              constructProj.dates &&
              constructProj.description
            ) {
              arrProj.push(constructProj);
            }
          });
        }
      }
    }

    return {
      projects: arrProj,
    };
  } catch (error) {
    return {
      projects: [],
    };
  }
}

export async function rpsScrapeProfileAwards(honors: any[] | null): Promise<{
  awards: PUBLIC_AWARD_DATA_TYPE[];
}> {
  try {
    let arrAwards: PUBLIC_AWARD_DATA_TYPE[] = [];

    if (honors && honors.length > 0) {
      for (const honor of honors) {
        const constructAward: PUBLIC_AWARD_DATA_TYPE = {
          award_name: null,
          issuer: null,
          date: null,
          description: null,
        };

        constructAward.award_name = honor["title"] ?? null;
        constructAward.issuer = honor["issuer"] ? honor["issuer"] : "";
        constructAward.date =
          honor["issueDateOn"] &&
          (honor["issueDateOn"]["month"] || honor["issueDateOn"]["year"])
            ? `${
                honor["issueDateOn"]["month"] &&
                typeof honor["issueDateOn"]["month"] === "number" &&
                honor["issueDateOn"]["month"] <= 12
                  ? `${moment(`${honor["issueDateOn"]["month"]}`, "M").format(
                      "MMMM"
                    )}`
                  : ""
              }${`${honor["issueDateOn"]["month"] ? " " : ""}${
                honor["issueDateOn"]["year"] ? honor["issueDateOn"]["year"] : ""
              }`}`
            : null;
        constructAward.description = honor["description"]
          ? honor["description"]
          : "";

        if (
          constructAward.award_name &&
          constructAward.issuer !== null &&
          constructAward.issuer !== undefined &&
          constructAward.date &&
          constructAward.description !== null &&
          constructAward.description !== undefined
        ) {
          arrAwards.push(constructAward);
        }
      }
    } else {
      const awardTitle = await checkIfTitleExist(
        "header",
        "Honors & Awards",
        false,
        50
      );

      if (awardTitle) {
        const headerTitleParent = awardTitle
          ? awardTitle.closest(
              ".accomplishments-expandable-list__title-container"
            )
          : null;

        let headerTitleParent_Parent = headerTitleParent
          ? headerTitleParent.parentElement
          : null;

        const showMoreButton = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("button")
          : null;

        if (showMoreButton) {
          showMoreButton.click();
          await delay(50, null);
          headerTitleParent_Parent = headerTitleParent
            ? headerTitleParent.parentElement
            : null;
        }

        const ulEl = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("ul")
          : null;

        if (ulEl && ulEl.children.length > 0) {
          Array.from(ulEl.children).forEach((liEl) => {
            const constructAward: PUBLIC_AWARD_DATA_TYPE = {
              award_name: null,
              issuer: null,
              date: null,
              description: null,
            };

            const liContainer = liEl.firstElementChild;

            if (liContainer) {
              const awardNameContainer =
                liContainer.querySelector<HTMLElement>("header h3");
              const awardDescContainer = liContainer.querySelector<HTMLElement>(
                ".accomplishments-base-entity__description"
              );
              const awardIssuerContainer =
                liContainer.querySelector<HTMLElement>(
                  ".accomplishments-base-entity__metadata"
                );
              const awardDateContainer = liContainer.querySelector<HTMLElement>(
                ".accomplishments-base-entity__date"
              );

              constructAward.award_name = awardNameContainer
                ? awardNameContainer.textContent.trim()
                : null;
              constructAward.issuer = awardIssuerContainer
                ? awardIssuerContainer.textContent.trim()
                : null;
              constructAward.date = awardDateContainer
                ? awardDateContainer.textContent.trim()
                : null;
              constructAward.description = awardDescContainer
                ? awardDescContainer.textContent.trim()
                : null;
            }

            if (
              constructAward.award_name &&
              constructAward.issuer &&
              constructAward.date &&
              constructAward.description
            ) {
              arrAwards.push(constructAward);
            }
          });
        }
      }
    }

    return {
      awards: arrAwards,
    };
  } catch (error) {
    return {
      awards: [],
    };
  }
}

export async function rpsScrapeProfileVolunteer(
  volunteeringExperiences: any[] | null
): Promise<{
  volunteers: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[];
}> {
  try {
    let volunterArr: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] = [];

    if (volunteeringExperiences && volunteeringExperiences.length > 0) {
      for (const volunteeringExp of volunteeringExperiences) {
        const constructVolunteer: PUBLIC_VOLUNTEER_WORK_DATA_TYPE = {
          title: null,
          company: null,
          date: null,
          description: null,
        };

        constructVolunteer.title = volunteeringExp["role"] ?? null;
        constructVolunteer.company = volunteeringExp["companyName"] ?? null;
        constructVolunteer.description = volunteeringExp["description"] ?? null;

        if (
          volunteeringExp &&
          (volunteeringExp["endDateOn"] || volunteeringExp["startDateOn"])
        ) {
          let date_ = "";

          if (
            volunteeringExp["startDateOn"] &&
            (volunteeringExp["startDateOn"]["month"] ||
              volunteeringExp["startDateOn"]["year"])
          ) {
            date_ += `${
              volunteeringExp["startDateOn"]["month"]
                ? `${moment(
                    `${volunteeringExp["startDateOn"]["month"]}`,
                    "M"
                  ).format("MMMM")}${
                    volunteeringExp["startDateOn"]["year"]
                      ? ` ${volunteeringExp["startDateOn"]["year"]}`
                      : ""
                  }`
                : volunteeringExp["startDateOn"]["year"]
                ? `${volunteeringExp["startDateOn"]["year"]}`
                : ""
            }`;
          }

          if (
            volunteeringExp["endDateOn"] &&
            (volunteeringExp["endDateOn"]["month"] ||
              volunteeringExp["endDateOn"]["year"])
          ) {
            date_ += `${date_.replace(/\s/g, "") !== "" ? ` - ` : " "}${
              volunteeringExp["endDateOn"]["month"]
                ? `${moment(
                    `${volunteeringExp["endDateOn"]["month"]}`,
                    "M"
                  ).format("MMMM")}${
                    volunteeringExp["endDateOn"]["year"]
                      ? ` ${volunteeringExp["endDateOn"]["year"]}`
                      : ""
                  }`
                : volunteeringExp["endDateOn"]["year"]
                ? `${volunteeringExp["endDateOn"]["year"]}`
                : ""
            }`;
          }

          constructVolunteer.date =
            date_.replace(/\s/g, "") === "" ? null : date_;
        }

        if (
          constructVolunteer.title &&
          constructVolunteer.company &&
          constructVolunteer.date &&
          constructVolunteer.description
        ) {
          volunterArr.push(constructVolunteer);
        }
      }
    } else {
      const volunteerTitle = await checkIfTitleExist(
        "header",
        "Volunteer Experience",
        false,
        50
      );

      if (volunteerTitle) {
        let headerTitleParent_Parent = volunteerTitle.parentElement
          ? volunteerTitle.parentElement
          : null;

        const showMoreButton = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>(
              "button.background-section__expandable-btn"
            )
          : null;

        if (showMoreButton) {
          showMoreButton.click();
          await delay(50, null);
          headerTitleParent_Parent = volunteerTitle.parentElement;
        }

        const ulEl = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("ul")
          : null;

        if (ulEl && ulEl.children.length > 0) {
          Array.from(ulEl.children).forEach((liEl) => {
            const constructVolunteer: PUBLIC_VOLUNTEER_WORK_DATA_TYPE = {
              title: null,
              company: null,
              date: "",
              description: null,
            };

            const liContainer = liEl.firstElementChild;

            if (liContainer) {
              const volunteerCompanyContainer =
                liContainer.querySelector<HTMLElement>(
                  "h3.background-entity__summary-definition--title"
                );
              const volunteerTitleContainer =
                liContainer.querySelector<HTMLElement>(
                  ".background-entity__summary-definition"
                );
              const volunteerDescContainer =
                liContainer.querySelector<HTMLElement>(
                  ".background-entity__summary-definition--description"
                );

              constructVolunteer.title = volunteerTitleContainer
                ? volunteerTitleContainer.textContent.trim()
                : null;
              constructVolunteer.company = volunteerCompanyContainer
                ? volunteerCompanyContainer.textContent.trim()
                : null;
              constructVolunteer.description = volunteerDescContainer
                ? volunteerDescContainer.textContent.trim()
                : null;
            }

            if (
              constructVolunteer.title &&
              constructVolunteer.company &&
              constructVolunteer.description
            ) {
              volunterArr.push(constructVolunteer);
            }
          });
        }
      }
    }

    return {
      volunteers: volunterArr,
    };
  } catch (error) {
    return {
      volunteers: [],
    };
  }
}

export async function rpsScrapeCoursesProfile(
  rawCourses: any[] | null
): Promise<{
  courses: PUBLIC_COURSE_DATA_TYPE[];
}> {
  try {
    let courseArr: PUBLIC_COURSE_DATA_TYPE[] = [];

    if (rawCourses && rawCourses.length > 0) {
      for (const rawCourse of rawCourses) {
        const constructCourse: PUBLIC_COURSE_DATA_TYPE = {
          name: null,
        };

        constructCourse.name = rawCourse["name"] ?? null;

        if (constructCourse.name) {
          courseArr.push(constructCourse);
        }
      }
    } else {
      const awardTitle = await checkIfTitleExist(
        "header",
        "Courses",
        false,
        50
      );

      if (awardTitle) {
        const headerTitleParent = awardTitle
          ? awardTitle.closest(
              ".accomplishments-expandable-list__title-container"
            )
          : null;

        let headerTitleParent_Parent = headerTitleParent
          ? headerTitleParent.parentElement
          : null;

        const showMoreButton = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("button")
          : null;

        if (showMoreButton) {
          showMoreButton.click();
          await delay(50, null);
          headerTitleParent_Parent = headerTitleParent
            ? headerTitleParent.parentElement
            : null;
        }

        const ulEl = headerTitleParent_Parent
          ? headerTitleParent_Parent.querySelector<HTMLElement>("ul")
          : null;

        if (ulEl && ulEl.children.length > 0) {
          Array.from(ulEl.children).forEach((liEl) => {
            const constructCourse: PUBLIC_COURSE_DATA_TYPE = {
              name: null,
            };

            const liContainer = liEl.firstElementChild;

            if (liContainer) {
              constructCourse.name = liContainer.textContent.trim();
            }

            if (constructCourse.name) {
              courseArr.push(constructCourse);
            }
          });
        }
      }
    }

    return {
      courses: courseArr,
    };
  } catch (error) {
    return {
      courses: [],
    };
  }
}

export async function crawlRpsPeopleAlsoViewedSection(): Promise<{
  people_also_viewed_links: string[];
}> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".similar-profiles__container",
      null,
      true,
      50
    );

    const linksArr: string[] = [];

    if (titleContainer) {
      const sectionEl = Array.from(
        titleContainer.querySelectorAll<HTMLElement>(
          "section.similar-profiles__row"
        )
      );

      sectionEl.forEach((el) => {
        const linkEl = el.querySelector<HTMLElement>(
          "span.lockup__content-title a"
        );

        if (linkEl && linkEl.getAttribute("href")) {
          linksArr.push(linkEl.getAttribute("href"));
        }
      });
    }

    return {
      people_also_viewed_links: linksArr,
    };
  } catch (error) {
    return {
      people_also_viewed_links: [],
    };
  }
}

// for public profile
export async function crawlRpsSimilarProfileSection(): Promise<{
  similar_profile_links: string[];
}> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".similar-profiles__container",
      null,
      true,
      50
    );

    const linksArr: string[] = [];

    if (titleContainer) {
      const sectionEl = Array.from(
        titleContainer.querySelectorAll<HTMLElement>(
          "section.similar-profiles__row"
        )
      );

      sectionEl.forEach((el) => {
        const linkEl = el.querySelector<HTMLElement>(
          "span.lockup__content-title a"
        );

        if (linkEl && linkEl.getAttribute("href")) {
          linksArr.push(
            "https://www.linkedin.com/in/" +
              linkEl.getAttribute("href").split("/")[5].split("?")[0]
          );
        }
      });
    }

    return {
      similar_profile_links: linksArr,
    };
  } catch (error) {
    return {
      similar_profile_links: [],
    };
  }
}
