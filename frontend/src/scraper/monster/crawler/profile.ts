import _ from "lodash";
import {
  CANDIDATE_DETAILS_TYPE,
  PUBLIC_CERTIFICATION_DATA_TYPE,
  PUBLIC_EDUCATIOM_DATA_TYPE,
  PUBLIC_EXPERIENCE_DATA_TYPE,
} from "../../../typescript/types/candidate";

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
  platform: "monster",
};

export function crawlMonsterCandidateProfile() {
  const candidateDetailsData = {
    ...defaultCandidateDetailsData,
  };

  candidateDetailsData.profile.display_image = getCandidateProfileImg();
  candidateDetailsData.profile.name = getCandidateName();

  candidateDetailsData.skills = getCandidateKeySkills();
  if (candidateDetailsData.skills.length > 0) {
    candidateDetailsData.skills_complete = true;
  }

  candidateDetailsData.experiences = getCandidateWorkExp();
  if (candidateDetailsData.experiences.length === 0) {
    candidateDetailsData.experiences = getWorkExperienceElsewhere();
  }
  if (candidateDetailsData.experiences.length > 0) {
    candidateDetailsData.experiences_complete = true;
  }

  candidateDetailsData.educations = getCandidateEducation();
  if (candidateDetailsData.educations.length > 0) {
    candidateDetailsData.educations_complete = true;
  }

  candidateDetailsData.certifications = getCandidateCert();
  if (candidateDetailsData.certifications.length > 0) {
    candidateDetailsData.certifications_complete = true;
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const userid = urlParams.get("userid");

  if (
    userid &&
    candidateDetailsData.profile.name &&
    candidateDetailsData.profile.name.replace(/\s/g, "") !== "" &&
    candidateDetailsData.experiences.length > 0
  ) {
    candidateDetailsData.profile.profile_username = userid;
    candidateDetailsData.profile.profile_url = window.location.href;
    candidateDetailsData.profile.url = window.location.href;

    return candidateDetailsData;
  } else {
    return null;
  }
}

// Extract candidate profile image
function getCandidateProfileImg() {
  try {
    const imgElement = document.querySelector<HTMLElement>(
      ".left.av_wrap > img"
    );

    if (imgElement) {
      const result = imgElement["src"];

      return result &&
        result !==
          "https://media.monsterindia.com/monster_2012/boy_100x100.jpg" &&
        result !==
          "https://media.monsterindia.com/monster_2012/girl_100x100.jpg"
        ? result
        : null;
    }

    throw "Not available";
  } catch (err) {
    return null;
  }
}

// Extract candidate name
function getCandidateName() {
  try {
    const nameTxt = document.querySelector(".nametxt");

    return nameTxt ? processString(nameTxt.innerHTML) : null;
  } catch (err) {
    return null;
  }
}

// Extract candidate key skill
function getCandidateKeySkills() {
  try {
    const keySkillsTitle = contains("strong", "Keyskills: ");

    if (keySkillsTitle) {
      const keySkillFulltext = keySkillsTitle.parentElement.innerText;

      if (keySkillFulltext) {
        const processedSkill = processString(
          keySkillFulltext.replace("Keyskills:", "")
        ).split(",");

        return processedSkill.map((item) => {
          return {
            name: item,
            passed_linkedin_assessment: false,
            num_endorsements: null,
          };
        });
      }
    }

    throw "Can't find key skill title";
  } catch (err) {
    return [];
  }
}

// Extract candidate experience
function getCandidateWorkExp() {
  try {
    let crawledExpData: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

    const workHistoryTitle = contains("div.left", "Work History");

    if (workHistoryTitle) {
      const workHistoryTitleParent = workHistoryTitle.parentElement;

      if (workHistoryTitleParent) {
        const workHistoryTitleParentNextSib =
          workHistoryTitleParent.nextElementSibling;

        if (workHistoryTitleParentNextSib) {
          const parentChild = workHistoryTitleParentNextSib.children;

          Array.from(parentChild).forEach((element) => {
            const constructExpData: PUBLIC_EXPERIENCE_DATA_TYPE = {
              job_title: null,
              company_name: null,
              job_subtitles: null,
              dates: null,
              duration: null,
              location: null,
              description: "",
            };

            const leftDiv = element.querySelector<HTMLElement>(".left");
            const leftDivChild = leftDiv.children;

            Array.from(leftDivChild).forEach((item_, index) => {
              const textItself = item_.innerHTML;

              if (index === 0) {
                constructExpData.job_title = processString(textItself);
              }
              if (index === 1) {
                constructExpData.company_name = processString(textItself);
              }
              if (index === 2) {
                const extractDuration = textItself.match(/\(([^)]+)\)/);

                if (extractDuration.length > 0) {
                  constructExpData.duration = processString(extractDuration[1]);

                  const replaceRoundedBracket = processString(
                    textItself.replace(/\(([^)]+)\)/, "")
                  );

                  constructExpData.dates = processString(replaceRoundedBracket);
                } else {
                  constructExpData.dates = processString(textItself);
                }
              }
            });

            if (constructExpData.job_title !== null) {
              crawledExpData.push(constructExpData);
            }
          });
        }
      }
    }

    return crawledExpData;
  } catch (err) {
    return [];
  }
}

// Extract current exp if no experience list
function getWorkExperienceElsewhere() {
  try {
    const currentCompanyTxt = document.querySelector(".prof > span");
    if (!currentCompanyTxt) {
      throw "Not found";
    }

    let currentRoleTxt = null;
    const currentRoleTitle = Array.from(
      document.querySelectorAll("strong")
    ).find((el) => {
      const strongTxt = processString(el.innerHTML);

      return strongTxt.toLowerCase().includes("roles:");
    });

    if (currentRoleTitle) {
      const nextSib = currentRoleTitle.nextSibling;

      if (nextSib) {
        currentRoleTxt = processString(nextSib.textContent);
      }
    }

    const constructExpData: PUBLIC_EXPERIENCE_DATA_TYPE = {
      job_title: currentRoleTxt ? processString(currentRoleTxt) : null,
      company_name: processString(currentCompanyTxt.innerHTML),
      job_subtitles: null,
      dates: null,
      duration: null,
      location: null,
      description: "",
    };

    if (constructExpData.job_title && constructExpData.company_name) {
      return [
        {
          ...constructExpData,
        },
      ];
    }

    throw "Not found";
  } catch (error) {
    return [];
  }
}

// Extract candidate education
function getCandidateEducation() {
  try {
    let crawledEduData: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

    const eduListContainer =
      document.querySelector<HTMLElement>(".pf_cont_wrap.edu");

    if (eduListContainer) {
      const eduitle =
        eduListContainer.querySelector<HTMLElement>(".pf_oth_txt");

      if (eduitle && eduitle.innerHTML.includes("Certifications"))
        throw "Not found";

      const eduListContainerChild = eduListContainer.children;

      if (eduListContainerChild.length > 0) {
        Array.from(eduListContainerChild).forEach((item_, index) => {
          const constructEduData: PUBLIC_EDUCATIOM_DATA_TYPE = {
            institution: null,
            degree_name: null,
            field: null,
            dates: null,
          };

          const leftContainer = item_.querySelector<HTMLElement>("div.left");
          const rightContainer = item_.querySelector<HTMLElement>("div.right");

          if (leftContainer && leftContainer.children.length > 1) {
            const leftContainerChild = leftContainer.children;

            constructEduData.degree_name = processString(
              leftContainerChild[0].innerHTML
            );

            constructEduData.institution = processString(
              leftContainerChild[1].innerHTML
            );
          }

          if (rightContainer && rightContainer.children.length > 0) {
            const rightContainerChild = rightContainer.children[1];

            if (rightContainerChild) {
              constructEduData.dates = processString(
                rightContainerChild.innerHTML
              );
            }
          }

          if (constructEduData.institution) {
            crawledEduData.push(constructEduData);
          }
        });
      }
    }

    return crawledEduData;
  } catch (err) {
    return [];
  }
}

// Extract candidate certification
function getCandidateCert() {
  try {
    let crawledCertData: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    const certListContainer =
      document.querySelector<HTMLElement>(".pf_cont_wrap.edu");

    if (certListContainer) {
      const certTitle =
        certListContainer.querySelector<HTMLElement>(".pf_oth_txt");

      if (certTitle && certTitle.innerHTML.includes("Certifications")) {
        const certListContainerChild = certListContainer.children;

        if (certListContainerChild.length > 0) {
          Array.from(certListContainerChild).forEach((item_, index) => {
            const constructCertData: PUBLIC_CERTIFICATION_DATA_TYPE = {
              name: null,
              dates: null,
            };

            const leftContainer = item_.querySelector<HTMLElement>("div.left");
            const rightContainer =
              item_.querySelector<HTMLElement>("div.right");

            if (leftContainer && leftContainer.children.length > 1) {
              const leftContainerChild = leftContainer.children;

              constructCertData.name = processString(
                leftContainerChild[0].innerHTML
              );
            }

            if (rightContainer && rightContainer.children.length > 0) {
              const rightContainerChild = rightContainer.children[1];

              if (rightContainerChild) {
                constructCertData.dates = processString(
                  rightContainerChild.innerHTML
                );
              }
            }

            if (constructCertData.name) {
              crawledCertData.push(constructCertData);
            }
          });
        }
      }
    }

    return crawledCertData;
  } catch (err) {
    return [];
  }
}

// Utility functions
function processString(s: string) {
  return s
    .replace(/(\r\n|\r\n\t|\n|\r|\t)/gm, "")
    .replace(/\&nbsp;/g, "")
    .trim();
}

function contains(selector: string, text: string): HTMLElement {
  try {
    const elements = document.querySelectorAll<HTMLElement>(selector);

    const filterResult = Array.prototype.filter.call(
      elements,
      function (element) {
        return RegExp(text).test(element.textContent);
      }
    );

    return filterResult.length > 0 ? filterResult[0] : null;
  } catch (err) {
    return null;
  }
}
