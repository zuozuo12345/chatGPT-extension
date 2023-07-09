import axios from "axios";

import {
  PUBLIC_CERTIFICATION_DATA_TYPE,
  PUBLIC_SKILL_DATA_TYPE,
} from "../../../../typescript/types/candidate";
import { checkIfTitleExist, delay } from "../../utils";

export async function rpsRetrieveSkills(
  parsedSkillResponse,
  profileUrn: string
): Promise<{
  skills: PUBLIC_SKILL_DATA_TYPE[];
  fromApi: boolean;
}> {
  try {
    let fromApi = false;

    // if (parsedSkillResponse) {
    //   // Linkedin talent api's data came with profileSkills

    //   const skills: PUBLIC_SKILL_DATA_TYPE[] = parsedSkillResponse
    //     ? parsedSkillResponse
    //         .map((item) => {
    //           return item["name"]
    //             ? ({
    //                 name: item["name"] ?? null,
    //                 passed_linkedin_assessment: item["hasInsight"] ?? false,
    //                 num_endorsements: item["endorsementCount"] ?? 0,
    //               } as PUBLIC_SKILL_DATA_TYPE)
    //             : null;
    //         })
    //         .filter(
    //           (item) =>
    //             item !== null && item !== undefined && item.name !== null
    //         )
    //     : [];

    //   return {
    //     skills: skills,
    //     fromApi: true,
    //   };
    // } else {
    //   // Linkedin talent api's data came without profileSkills

    //   let skills: PUBLIC_SKILL_DATA_TYPE[] = [];

    //   const sessionToken = document.cookie
    //     .split("; ")
    //     .find((row) => row.startsWith("JSESSIONID="))
    //     ?.split("=")[1];

    //   if (!sessionToken) {
    //     throw "No JSESSIONID";
    //   }

    //   let response_ = null;

    //   try {
    //     if (!profileUrn) {
    //       throw "No profile urn";
    //     }

    //     response_ = await axios.get(
    //       `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(start:0,count:100,paginationToken:null,pagedListComponent:urn%3Ali%3Afsd_profilePagedListComponent%3A%28${profileUrn}%2CSKILLS_VIEW_DETAILS%2Curn%3Ali%3Afsd_profileTabSection%3AALL_SKILLS%2CNONE%2Cen_US%29)&&queryId=voyagerIdentityDashProfileComponents.23ee0f673b4a1da7d0c5f63f54f90475`,
    //       {
    //         headers: {
    //           accept: "application/vnd.linkedin.normalized+json+2.1",
    //           "accept-language": "en-US,en;q=0.9",
    //           "csrf-token": JSON.parse(sessionToken),
    //         },
    //       }
    //     );

    //     const skillsPageApiResponse = response_.data;

    //     if (
    //       skillsPageApiResponse &&
    //       skillsPageApiResponse["data"] &&
    //       typeof skillsPageApiResponse["data"] === "object" &&
    //       skillsPageApiResponse["data"]["data"] &&
    //       skillsPageApiResponse["data"]["data"][
    //         "identityDashProfileComponentsByPagedListComponent"
    //       ] &&
    //       typeof skillsPageApiResponse["data"]["data"][
    //         "identityDashProfileComponentsByPagedListComponent"
    //       ] === "object" &&
    //       skillsPageApiResponse["data"]["data"][
    //         "identityDashProfileComponentsByPagedListComponent"
    //       ]["elements"] &&
    //       typeof skillsPageApiResponse["data"]["data"][
    //         "identityDashProfileComponentsByPagedListComponent"
    //       ]["elements"] === "object" &&
    //       skillsPageApiResponse["data"]["data"][
    //         "identityDashProfileComponentsByPagedListComponent"
    //       ]["elements"].length > 0
    //     ) {
    //       const skillsCrawlerResponse = skillsCrawler(
    //         skillsPageApiResponse["data"]["data"][
    //           "identityDashProfileComponentsByPagedListComponent"
    //         ]["elements"]
    //       );

    //       skills = skillsCrawlerResponse.skills;
    //       fromApi = true;
    //     }
    //   } catch (err) {
    //     skills = (await rpsScrapeSkills()).skills;
    //     fromApi = false;
    //   }

    //   return {
    //     skills: skills,
    //     fromApi: fromApi,
    //   };
    // }

    const skills: PUBLIC_SKILL_DATA_TYPE[] = (await rpsScrapeSkills()).skills;

    return {
      skills: skills ?? [],
      fromApi: false,
    };
  } catch (error) {
    return {
      skills: [],
      fromApi: false,
    };
  }
}

export async function rpsScrapeSkills() {
  try {
    const titleContainer = await checkIfTitleExist(
      ".skills-card__header",
      "skills",
      true,
      50
    );

    if (!titleContainer) {
      throw "Can't be found";
    }

    const titleContainerParent = titleContainer.parentElement;

    let showMoreBtn = null;

    if (titleContainerParent) {
      showMoreBtn = titleContainerParent.querySelector<HTMLElement>(
        "button.expandable-list__button"
      );

      if (showMoreBtn) {
        showMoreBtn.click();
        await delay(50, null);
      }
    }

    const skills: PUBLIC_SKILL_DATA_TYPE[] = [];

    const skillsUlElement = titleContainer.nextElementSibling;

    if (
      skillsUlElement &&
      skillsUlElement.classList.contains("expandable-list-profile-core__list")
    ) {
      Array.from(skillsUlElement.children).forEach((el) => {
        const nameContainer = el.querySelector<HTMLElement>(
          ".skill-entity__skill-name"
        );

        let passedAssessmentContainer = null;
        let numEndorsementsContainer = null;

        const skillAssociationUlContainer = el.querySelector<HTMLElement>(
          ".skill-entity__skill-insights"
        );

        const skillAssociationUl = skillAssociationUlContainer
          ? skillAssociationUlContainer.querySelector<HTMLElement>(
              "ul.skill-entity__list"
            )
          : null;

        if (skillAssociationUl && skillAssociationUl.childElementCount > 0) {
          Array.from(skillAssociationUl.children).forEach((el_) => {
            const textContent = el_.textContent.trim().toLowerCase();

            if (textContent) {
              if (textContent === "linkedin skill assessment badge") {
                passedAssessmentContainer = el_;
              } else if (
                textContent.includes("endorsement") ||
                textContent.includes("endorsements")
              ) {
                numEndorsementsContainer = el_;
              }
            }
          });
        }

        let num_endorsements = 0;

        if (numEndorsementsContainer) {
          let numEndorsementsContainerText =
            numEndorsementsContainer.innerText.trim();

          numEndorsementsContainerText = numEndorsementsContainerText.includes(
            "endorsement"
          )
            ? numEndorsementsContainerText
                .replace("endorsement", "")
                .replace(/\s/g, "")
            : numEndorsementsContainerText.includes("endorsements")
            ? numEndorsementsContainerText
                .replace("endorsements", "")
                .replace(/\s/g, "")
            : null;

          if (
            numEndorsementsContainerText &&
            !isNaN(parseInt(numEndorsementsContainerText))
          ) {
            num_endorsements = parseInt(numEndorsementsContainerText);
          }
        }

        const constructCert: PUBLIC_SKILL_DATA_TYPE = nameContainer
          ? {
              name: nameContainer ? nameContainer.innerText.trim() : null,
              passed_linkedin_assessment: passedAssessmentContainer
                ? true
                : false,
              num_endorsements: num_endorsements,
            }
          : null;

        if (constructCert) {
          skills.push(constructCert);
        }
      });
    }

    if (
      skills.length > 0 &&
      showMoreBtn &&
      titleContainer &&
      titleContainer.parentElement
    ) {
      const titleContainer__ = await checkIfTitleExist(
        ".skills-card__header",
        "skills",
        true,
        25
      );

      showMoreBtn = titleContainer__ ? titleContainer__.lastElementChild : null;

      if (showMoreBtn) {
        showMoreBtn.click();
      }
    }

    return {
      skills: skills,
    };
  } catch (err) {
    return {
      skills: [],
    };
  }
}

function skillsCrawler(skillElements) {
  try {
    let skills: PUBLIC_SKILL_DATA_TYPE[] = [];

    for (let item of skillElements) {
      if (
        item["components"]["entityComponent"] &&
        item["components"]["entityComponent"]["title"]
      ) {
        const entityComponent = item["components"]["entityComponent"];

        if (entityComponent["title"] && entityComponent["title"]["text"]) {
          let passedAssessment = false;
          let num_endorsements = 0;

          if (
            entityComponent["subComponents"] &&
            entityComponent["subComponents"]["components"] &&
            typeof entityComponent["subComponents"]["components"] ===
              "object" &&
            entityComponent["subComponents"]["components"].length > 0
          ) {
            entityComponent["subComponents"]["components"].forEach(
              (subCompComp) => {
                if (
                  subCompComp["components"] &&
                  subCompComp["components"]["insightComponent"] &&
                  subCompComp["components"]["insightComponent"]["text"] &&
                  subCompComp["components"]["insightComponent"]["text"][
                    "text"
                  ] &&
                  subCompComp["components"]["insightComponent"]["text"]["text"][
                    "text"
                  ]
                ) {
                  if (
                    subCompComp["components"]["insightComponent"]["text"][
                      "text"
                    ]["text"].toLowerCase() ===
                    "passed linkedin skill assessment"
                  ) {
                    passedAssessment = true;
                  }
                }
              }
            );
          }

          if (
            entityComponent["supplementaryInfo"] &&
            entityComponent["supplementaryInfo"]["text"]
          ) {
            const check_ = parseInt(
              entityComponent["supplementaryInfo"]["text"]
                .replace(/\s/g, "")
                .replace(/\W+/g, "")
            );

            if (!isNaN(check_)) {
              num_endorsements = check_;
            }
          }

          skills.push({
            name: entityComponent["title"]["text"] ?? null,
            passed_linkedin_assessment: passedAssessment,
            num_endorsements: num_endorsements,
          } as PUBLIC_SKILL_DATA_TYPE);
        }
      }
    }

    return {
      skills,
    };
  } catch (error) {
    return {
      skills: [],
    };
  }
}
