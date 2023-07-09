import queryString from "query-string";
import moment from "moment";
// could do
import { checkIfTitleExist, delay } from "../../../../scraper/linkedin/utils";
import {
  CANDIDATE_PROFILE_TYPE,
  PUBLIC_AWARD_DATA_TYPE,
  PUBLIC_CERTIFICATION_DATA_TYPE,
  PUBLIC_COURSE_DATA_TYPE,
  PUBLIC_EDUCATIOM_DATA_TYPE,
  PUBLIC_EXPERIENCE_DATA_TYPE,
  PUBLIC_LANGUAGE_DATA_TYPE,
  PUBLIC_PROJECT_DATA_TYPE,
  PUBLIC_RECOMMENDATION_DATA_TYPE,
  PUBLIC_SKILL_DATA_TYPE,
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE,
} from "../../../../typescript/types/candidate";

export function crawlProfileDataFromContactInfoPage(username: string) {
  const headerName = document.querySelector<HTMLElement>(
    ".artdeco-modal__header.ember-view h1"
  );
  const contactInfoContainer = document.querySelectorAll(
    "section.pv-contact-info__contact-type"
  );

  const payload: CANDIDATE_PROFILE_TYPE = {
    name: headerName ? headerName.innerText.trim() : null,
    profile_url: `https://www.linkedin.com/in/${username}`,
    url: `https://www.linkedin.com/in/${username}`,
    website: null,
    phone: null,
    email: null,
    twitter: null,
    location: null,
  };

  if (contactInfoContainer.length > 0) {
    document
      .querySelectorAll<HTMLElement>("section.pv-contact-info__contact-type")
      .forEach((vanity_url) => {
        const title = vanity_url.querySelector("h3").innerText.toLowerCase();

        if (
          title === "email" ||
          title === "phone" ||
          title === "website" ||
          title === "twitter"
        ) {
          payload[title] =
            title === "phone"
              ? vanity_url.querySelector("span")?.innerText?.trim() || null
              : vanity_url.querySelector("a")?.innerText?.trim() || null;
        } else {
          if (title === "websites") {
            if (vanity_url.querySelector("a")) {
              payload.website = vanity_url.querySelector("a").innerText;
            }
          }
        }
      });
  }

  return payload;
}

export function crawlPuiblicExperiencesFromDetailsExperiencePage() {
  const experience_items = document.querySelectorAll<HTMLElement>(
    ".pvs-entity.pvs-entity--padded"
  );

  let public_experiences: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

  if (experience_items.length > 0) {
    experience_items.forEach((experience_item) => {
      const experience_list =
        experience_item.querySelectorAll<HTMLElement>(".pvs-entity");

      if (experience_list && experience_list.length > 0) {
        // Case where multiple experiences in same company
        const company_name = experience_item
          .querySelector<HTMLElement>(".mr1.hoverable-link-text.t-bold")
          ?.querySelector<HTMLElement>("span")?.innerText;
        const location = experience_item
          .querySelector<HTMLElement>(".t-14.t-normal.t-black--light")
          ?.querySelector<HTMLElement>("span")?.innerText;

        const experienceListExperinces = fetchPublicExperienceList(
          experience_list,
          company_name,
          location
        );

        public_experiences = public_experiences.concat(
          experienceListExperinces
        );
      } else {
        // Case where single experience in same company
        const constructExpData: PUBLIC_EXPERIENCE_DATA_TYPE = {
          job_title: null,
          company_name: null,
          job_subtitles: null,
          dates: null,
          duration: null,
          location: null,
          description: "",
        };

        const job_title_tag = experience_item
          .querySelector<HTMLElement>(".mr1.t-bold")
          ?.querySelector<HTMLElement>("span");
        const company_name_tag =
          experience_item.querySelector<HTMLElement>(".t-14.t-normal");
        const job_subtitle_tags = experience_item.querySelectorAll<HTMLElement>(
          ".t-14.t-normal.t-black--light"
        );
        const description_span_tags =
          experience_item.querySelectorAll<HTMLElement>("ul.pvs-list");

        if (job_title_tag) {
          constructExpData["job_title"] = job_title_tag.innerText;
        }

        if (company_name_tag.querySelector("span")) {
          constructExpData["company_name"] =
            company_name_tag.querySelector("span").innerText;
        } else {
          constructExpData["company_name"] = company_name_tag.innerText;
        }

        if (
          constructExpData["company_name"] &&
          constructExpData["company_name"].includes("·")
        ) {
          constructExpData["company_name"] = constructExpData["company_name"]
            .split("·")[0]
            ?.trim();
        }

        if (job_subtitle_tags.length > 0) {
          job_subtitle_tags.forEach((job_subtitle_tag) => {
            const job_subtitle_span_tag =
              job_subtitle_tag.querySelector<HTMLElement>("span");

            if (job_subtitle_span_tag) {
              if (job_subtitle_span_tag.innerText.includes("·")) {
                constructExpData["dates"] = job_subtitle_span_tag.innerText
                  .split("·")[0]
                  ?.trim();
                constructExpData["duration"] = job_subtitle_span_tag.innerText
                  .split("·")[1]
                  ?.trim();
              } else {
                constructExpData["location"] =
                  job_subtitle_span_tag.innerText?.trim() || null;
              }
            }
          });
        }

        if (description_span_tags && description_span_tags.length > 0) {
          description_span_tags.forEach((description_span_tag) => {
            const description_span_tag_span =
              description_span_tag.querySelector("span");

            if (description_span_tag && description_span_tag_span) {
              constructExpData[
                "description"
              ] += `${description_span_tag_span.innerText?.trim()}${"\n"}`;
            }
          });
        }

        if (
          constructExpData["company_name"] === null ||
          constructExpData["company_name"] === undefined
        ) {
          constructExpData["company_name"] = "";
        }

        public_experiences.push(constructExpData);
      }
    });
  }

  return public_experiences;
}

const fetchPublicExperienceList = (
  multipleExperience: NodeListOf<HTMLElement>,
  company_name: string,
  location: string
) => {
  let multipleExperiences: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

  multipleExperience.forEach((experience) => {
    let newLocation = null;

    const locationEl = experience.querySelectorAll<HTMLElement>(
      ".t-14.t-normal.t-black--light"
    );

    if (locationEl && locationEl.length > 1) {
      if (locationEl[locationEl.length - 1]) {
        const locationSpanContainer = locationEl[locationEl.length - 1];
        const firstSpan = locationSpanContainer.querySelector("span");

        if (firstSpan) {
          newLocation = processString(firstSpan.innerText);
        }
      }
    }

    const constructExpData: PUBLIC_EXPERIENCE_DATA_TYPE = {
      job_title: null,
      company_name: company_name,
      job_subtitles: null,
      dates: null,
      duration: null,
      location: newLocation ? newLocation : location,
      description: "",
    };

    const subtitle =
      experience
        .querySelector<HTMLElement>(".t-14.t-normal.t-black--light")
        ?.querySelector<HTMLElement>("span")
        ?.innerText.trim() || null;
    constructExpData["job_title"] =
      experience
        .querySelector<HTMLElement>(".mr1.hoverable-link-text.t-bold")
        ?.querySelector<HTMLElement>("span")
        ?.innerText.trim() || null;

    if (subtitle?.includes("·")) {
      constructExpData["dates"] = subtitle.split("·")[0].trim();
      constructExpData["duration"] = subtitle.split("·")[1].trim();
    }

    const descriptionSpans = experience.querySelectorAll<HTMLElement>(
      ".inline-show-more-text"
    );
    descriptionSpans?.forEach((span) => {
      if (span.querySelector("span")) {
        constructExpData["description"] +=
          span.querySelector("span").innerText + "\n";
      }
    });

    multipleExperiences.push(constructExpData);
  });

  return multipleExperiences;
};

export async function crawlPuiblicSkillsFromDetailsSkillsPage() {
  try {
    let skills: PUBLIC_SKILL_DATA_TYPE[] = [];

    document
      ?.querySelectorAll<HTMLElement>(
        "li.artdeco-list__item.pvs-list__item--line-separated"
      )
      ?.forEach((skill_item) => {
        let name =
          skill_item
            .querySelector("span.mr1.t-bold")
            ?.querySelector("span")
            ?.innerText?.trim() || null;
        let passed_linkedin_assessment = false;
        let num_endorsements = null;
        let bottomContainer = skill_item.querySelectorAll<HTMLElement>(
          "a.optional-action-target-wrapper.display-flex.mv1.link-without-hover-visited"
        );

        if (
          skill_item?.innerText?.includes("Passed LinkedIn Skill Assessment")
        ) {
          passed_linkedin_assessment = true;
        }

        bottomContainer.forEach((item) => {
          if (
            item
              .querySelector<HTMLElement>("span[aria-hidden]")
              ?.innerText?.trim()
              .includes("endorsements")
          ) {
            num_endorsements =
              parseInt(
                item
                  .querySelector<HTMLElement>("span[aria-hidden]")
                  ?.innerText?.trim()
                  .split(" ")[0]
              ) || null;
          }
        });

        skills.push({
          name: name,
          passed_linkedin_assessment: passed_linkedin_assessment,
          num_endorsements: num_endorsements,
        });
      });

    return {
      skills: skills.filter(
        (skill) => skill.name !== null && skill.name !== undefined
      ),
    };
  } catch (error) {
    return { skills: [] };
  }
}

export async function crawlPuiblicEducationFromDetailsEducationPage() {
  try {
    let educations: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

    document
      ?.querySelectorAll<HTMLElement>(
        "li.artdeco-list__item.pvs-list__item--line-separated"
      )
      ?.forEach((education_item) => {
        const constructEducationData = {
          institution:
            education_item
              .querySelector<HTMLElement>("span.mr1.hoverable-link-text.t-bold")
              ?.querySelector<HTMLElement>("span")
              ?.innerText?.trim() || null,
          degree_name:
            education_item
              .querySelector<HTMLElement>("span.t-14.t-normal")
              ?.querySelector<HTMLElement>("span")
              ?.innerText?.trim() || null,
          field:
            education_item
              .querySelector<HTMLElement>("span.t-14.t-normal")
              ?.querySelector<HTMLElement>("span")
              ?.innerText?.trim() || null,
          dates:
            education_item
              .querySelector<HTMLElement>("span.t-14.t-normal.t-black--light")
              ?.querySelector<HTMLElement>("span")
              ?.innerText?.trim() || null,
        };

        educations.push(constructEducationData);
      });

    return { educations };
  } catch (error) {
    return { educations: null };
  }
}

export async function crawlPuiblicCertFromDetailsCertPage() {
  try {
    let certs: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    document
      ?.querySelectorAll<HTMLElement>(
        "li.artdeco-list__item.pvs-list__item--line-separated"
      )
      ?.forEach((skill_item) => {
        const name =
          skill_item
            .querySelector<HTMLElement>("span.mr1.t-bold")
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim() || null;
        const dates =
          skill_item
            .querySelector<HTMLElement>(".t-14.t-normal.t-black--light")
            ?.innerText?.trim() || null;

        certs.push({
          name: name,
          dates: dates,
        });
      });

    return { certifications: certs };
  } catch (error) {
    return { certifications: null };
  }
}

interface crawlPuiblicProfileSectionResponse {
  about: HTMLElement | null;
  experience: HTMLElement | null;
  education: HTMLElement | null;
  skills: HTMLElement | null;
  projects: HTMLElement | null;
}

export async function crawlPuiblicProfileSection(): Promise<crawlPuiblicProfileSectionResponse> {
  await delay(1000, null);

  const sections = document.querySelectorAll<HTMLElement>(
    ".artdeco-card.ember-view.relative.break-words.pb3.mt2"
  );

  const payload: crawlPuiblicProfileSectionResponse = {
    about: null,
    experience: null,
    education: null,
    skills: null,
    projects: null,
  };

  sections.forEach((section) => {
    let sectionTitle = section
      .querySelector("h2")
      ?.querySelector("span").innerText;

    if (sectionTitle === "About") {
      payload["about"] = section;
    }
    if (sectionTitle === "Experience") {
      payload["experience"] = section;
    }
    if (sectionTitle === "Education") {
      payload["education"] = section;
    }
    if (sectionTitle === "Skills") {
      payload["skills"] = section;
    }
    if (sectionTitle === "Projects") {
      payload["projects"] = section;
    }
  });

  return payload;
}

/* Public Profile */
export function crawlPublicProfileDataFromProfilePage(
  publicProfileSections: crawlPuiblicProfileSectionResponse,
  username: string
) {
  const profileBox = document.querySelector<HTMLElement>(
    ".artdeco-card.ember-view.pv-top-card"
  );

  const payload: CANDIDATE_PROFILE_TYPE = {
    name: null,
    profile_url: `https://www.linkedin.com/in/${username}`,
    url: `https://www.linkedin.com/in/${username}`,
    website: null,
    phone: null,
    email: null,
    twitter: null,
    title: null,
    location: null,
  };

  if (profileBox) {
    // Get name H1 text-heading-xlarge inline t-24 v-align-middle break-words
    payload["name"] = profileBox.querySelector<HTMLElement>("h1").innerText;

    try {
      const locationSpan = profileBox.querySelector<HTMLElement>(
        ".text-body-small.inline.t-black--light.break-words"
      );

      if (locationSpan) {
        payload["location"] = processString(locationSpan.innerText);
      }

      throw "Try alternative";
    } catch (err) {
      const contactLinkEl = document.querySelector<HTMLElement>(
        "#top-card-text-details-contact-info"
      );

      if (contactLinkEl) {
        const contactLinkElParent = contactLinkEl.parentElement;

        const contactLinkElParentPrevEl =
          contactLinkElParent.previousElementSibling;

        if (contactLinkElParentPrevEl) {
          payload["location"] = processString(
            contactLinkElParentPrevEl["innerText"]
              ? contactLinkElParentPrevEl["innerText"]
              : contactLinkElParentPrevEl["innerHTML"]
          );
        }
      }
    }

    const locationBox = profileBox.querySelector<HTMLElement>(
      ".pv-text-details__left-panel.pb2"
    );

    if (
      locationBox &&
      locationBox.querySelector(
        ".text-body-small.inline.t-black--light.break-words"
      )
    ) {
      payload["location"] = locationBox.querySelector<HTMLElement>(
        ".text-body-small.inline.t-black--light.break-words"
      ).innerText;
    }
  }

  if (publicProfileSections.about) {
    const targetedTitleBox =
      publicProfileSections.about.querySelector<HTMLElement>(
        ".inline-show-more-text"
      );

    if (targetedTitleBox) {
      const targetedTitleBoxSpan =
        targetedTitleBox.querySelector<HTMLElement>("span");

      if (targetedTitleBoxSpan) {
        payload["title"] = targetedTitleBoxSpan.innerText;
      }
    }
  }
  return payload;
}

export function crawlExperienceDataFromProfilePage(
  publicProfileSections: crawlPuiblicProfileSectionResponse
) {
  const experience_section = publicProfileSections.experience;

  let experience: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

  const experience_more_btn = experience_section
    ? experience_section.querySelector<HTMLElement>(".pvs-list__footer-wrapper")
    : null;
  const more_experience = experience_more_btn ? true : false;

  if (experience_section) {
    const experience_items = experience_section.querySelectorAll<HTMLElement>(
      ".pvs-entity.pvs-entity--padded"
    );

    experience_items.forEach((experience_item) => {
      const experience_list =
        experience_item.querySelectorAll<HTMLElement>(".pvs-entity");

      if (experience_list && experience_list.length > 0) {
        // Case where multiple experiences in same company
        const company_name = experience_item
          .querySelector<HTMLElement>(".mr1.hoverable-link-text.t-bold")
          ?.querySelector<HTMLElement>("span")?.innerText;
        let location = experience_item
          .querySelector<HTMLElement>(".t-14.t-normal.t-black--light")
          ?.querySelector<HTMLElement>("span")?.innerText;

        if (location.includes("yr") || location.includes("mos")) {
          location = null;
        }

        const experienceListExperinces = fetchPublicExperienceList(
          experience_list,
          company_name,
          location
        );

        experience = experience.concat(experienceListExperinces);
      } else {
        // Case where single experience in same company
        const company_name_container =
          experience_item.querySelector<HTMLElement>(".t-14.t-normal");
        let company_name = null;

        if (company_name_container.querySelector("span")) {
          company_name =
            company_name_container.querySelector<HTMLElement>("span").innerText;
        } else {
          company_name = company_name_container.innerText;
        }

        if (company_name?.includes("·")) {
          company_name = company_name.split("·")[0]?.trim();
        }

        const constructExpData: PUBLIC_EXPERIENCE_DATA_TYPE = {
          job_title: experience_item
            .querySelector<HTMLElement>(".mr1.t-bold")
            ?.querySelector<HTMLElement>("span")?.innerText,
          company_name: company_name,
          job_subtitles: null,
          dates: null,
          duration: null,
          location: null,
          description: "",
        };

        const job_subtitles = experience_item.querySelectorAll<HTMLElement>(
          ".t-14.t-normal.t-black--light"
        );

        if (job_subtitles && job_subtitles.length > 0) {
          job_subtitles.forEach((job_subtitle) => {
            if (
              job_subtitle
                ?.querySelector<HTMLElement>("span")
                .innerText.includes("·")
            ) {
              constructExpData["dates"] = job_subtitle
                ?.querySelector<HTMLElement>("span")
                .innerText.split("·")[0]
                ?.trim();
              constructExpData["duration"] = job_subtitle
                ?.querySelector<HTMLElement>("span")
                .innerText.split("·")[1]
                ?.trim();
            } else {
              constructExpData["location"] =
                job_subtitle
                  ?.querySelector<HTMLElement>("span")
                  .innerText?.trim() || null;
            }
          });
        }

        const descriptionSpans =
          experience_item.querySelectorAll<HTMLElement>("ul.pvs-list");

        if (descriptionSpans && descriptionSpans.length > 0) {
          descriptionSpans.forEach((descriptionSpan) => {
            if (descriptionSpan?.querySelector<HTMLElement>("span")) {
              constructExpData["description"] +=
                descriptionSpan
                  ?.querySelector<HTMLElement>("span")
                  ?.innerText?.trim() + "\n";
            }
          });
        }

        experience.push(constructExpData);
      }
    });
  }

  return {
    experiences: experience,
    more_experience: more_experience,
    more_experience_btn: experience_more_btn,
  };
}

export function crawlPublicEducationDataFromProfilePage(
  publicProfileSections: crawlPuiblicProfileSectionResponse
) {
  const experience_section = publicProfileSections.education;
  let educations: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

  const education_items = experience_section?.querySelectorAll<HTMLElement>(
    "li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column"
  );

  if (education_items && education_items.length > 0) {
    education_items.forEach((education_item) => {
      educations.push({
        institution:
          education_item
            .querySelector<HTMLElement>("span.mr1.hoverable-link-text.t-bold")
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim() || null,
        degree_name:
          education_item
            .querySelector<HTMLElement>("span.t-14.t-normal")
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim() || null,
        field:
          education_item
            .querySelector<HTMLElement>("span.t-14.t-normal")
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim() || null,
        dates:
          education_item
            .querySelector<HTMLElement>("span.t-14.t-normal.t-black--light")
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim() || null,
      });
    });
  }

  return educations;
}

export function crawlPublicCertDataFromProfilePage() {
  try {
    let certs: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    const getAllSection = document.querySelectorAll<HTMLElement>(
      "section.artdeco-card"
    );

    let certSectionContainer: HTMLElement | null = null;

    getAllSection.forEach((section) => {
      const findSectionWithCertId = section.querySelector<HTMLElement>(
        "#licenses_and_certifications"
      );

      if (findSectionWithCertId) {
        certSectionContainer = section;
      }
    });

    if (certSectionContainer) {
      const ulContainer = certSectionContainer.querySelector<HTMLElement>(
        ".pvs-list__outer-container ul.pvs-list"
      );

      if (ulContainer) {
        const liContainer = ulContainer.querySelectorAll<HTMLElement>(
          "li.artdeco-list__item"
        );

        if (liContainer) {
          liContainer.forEach((cert) => {
            let name =
              cert
                .querySelector<HTMLElement>("span.mr1.t-bold")
                ?.querySelector<HTMLElement>("span")
                ?.innerText?.trim() || null;

            if (!name) {
              name =
                cert
                  .querySelector<HTMLElement>(`span[aria-hidden=true]`)
                  ?.textContent?.trim() || null;
            }

            const dates =
              cert
                .querySelector<HTMLElement>(".t-14.t-normal.t-black--light")
                ?.textContent?.trim() || null;

            certs.push({
              name: name,
              dates: dates,
            });
          });
        }
      }
    }

    return { certifications: certs && certs.length > 0 ? certs : [] };
  } catch (error) {
    return { certifications: [] };
  }
}

export default function crawlPublicSkillsDataFromProfilePage(
  publicProfileSections: crawlPuiblicProfileSectionResponse
) {
  const skillBox = publicProfileSections.skills;
  const skill_more_button = skillBox?.querySelector<HTMLElement>(
    ".pvs-list__footer-wrapper"
  );

  let skills: PUBLIC_SKILL_DATA_TYPE[] = [];

  skillBox
    ?.querySelectorAll<HTMLElement>(
      "li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column"
    )
    ?.forEach((skill_item) => {
      let name =
        skill_item
          .querySelector<HTMLElement>("span.mr1.t-bold")
          ?.querySelector<HTMLElement>("span")
          ?.innerText?.trim() || null;

      if (!name) {
        name =
          skill_item
            .querySelector<HTMLElement>(`a[data-field=skill_card_skill_topic]`)
            ?.querySelector<HTMLElement>(`span[aria-hidden=true]`)
            ?.textContent?.trim() || null;
      }

      let passed_linkedin_assessment: boolean = false;
      let num_endorsements: number | null = null;
      let bottomContainer = skill_item.querySelectorAll(
        "li.pvs-list__outer-container"
      );

      bottomContainer.forEach((item) => {
        if (
          item
            .querySelector<HTMLElement>(
              "inline-show-more-text.inline-show-more-text--is-collapsed"
            )
            ?.querySelector<HTMLElement>("span")
            ?.innerText.trim() == "Passed LinkedIn Skill Assessment"
        ) {
          passed_linkedin_assessment = true;
        }
        if (
          item
            .querySelector<HTMLElement>(
              "hoverable-link-text.display-flex.align-items-center.t-14.t-normal.t-black"
            )
            ?.querySelector<HTMLElement>("span")
            ?.innerText?.trim()
            .includes("endorsements")
        ) {
          num_endorsements =
            parseInt(
              item
                .querySelector<HTMLElement>(
                  "hoverable-link-text.display-flex.align-items-center.t-14.t-normal.t-black"
                )
                ?.querySelector<HTMLElement>("span")
                ?.innerText?.trim()
                .split(" ")[0]
            ) || null;
        }
      });

      skills.push({
        name: name,
        passed_linkedin_assessment: passed_linkedin_assessment,
        num_endorsements: num_endorsements,
      });
    });

  return {
    skills: skills,
    skill_more_button: skill_more_button,
  };
}

export async function crawlPeopleAlsoViewedSection(): Promise<string[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "People also viewed",
      true
    );

    const linksArr: string[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>(
            ".pvs-list__outer-container ul.pvs-list"
          )
        : null;

      if (nextElListContainer) {
        // const showMoreBtn = nextEl.querySelector<HTMLElement>(
        //   ".pvs-list__footer-wrapper button"
        // );

        // if (showMoreBtn) {
        //   showMoreBtn.click();
        //   await delay(250, null);
        //   nextElListContainer = nextEl.querySelector<HTMLElement>(
        //     ".pvs-list__outer-container ul.pvs-list"
        //   );
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

export async function crawlPeopleYouMayKnowSection(): Promise<string[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "People you may know",
      true
    );

    const linksArr: string[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>(
            ".pvs-list__outer-container ul.pvs-list"
          )
        : null;

      if (nextElListContainer) {
        // const showMoreBtn = nextEl.querySelector<HTMLElement>(
        //   ".pvs-list__footer-wrapper button"
        // );

        // if (showMoreBtn) {
        //   showMoreBtn.click();
        //   await delay(250, null);
        //   nextElListContainer = nextEl.querySelector<HTMLElement>(
        //     ".pvs-list__outer-container ul.pvs-list"
        //   );
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

export async function crawlRecommendationsSection(): Promise<
  PUBLIC_RECOMMENDATION_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Recommendations",
      true
    );

    let recArr: PUBLIC_RECOMMENDATION_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer) {
        if (nextElListContainer && nextElListContainer.children.length > 0) {
          const lookForAllEl = Array.from(nextElListContainer.children);

          for (const el of lookForAllEl) {
            const constructRec: PUBLIC_RECOMMENDATION_DATA_TYPE = {
              name: null,
              content: null,
            };

            const listWrapper = el.lastElementChild;
            const listContentWrapper = listWrapper
              ? listWrapper.lastElementChild
              : null;

            const linkContainer = listContentWrapper
              ? listContentWrapper.querySelector<HTMLElement>("a")
              : null;
            const linkContaienrFirstChild =
              linkContainer && linkContainer.children.length > 0
                ? linkContainer.children[0]
                : null;
            const nameContainer = linkContaienrFirstChild
              ? linkContaienrFirstChild.querySelector<HTMLElement>(
                  "span[aria-hidden=true]"
                )
              : null;

            if (nameContainer) {
              constructRec.name = nameContainer.textContent.trim();
            }

            const contentWrapper = linkContainer.parentElement
              ? linkContainer.parentElement.nextElementSibling
              : null;

            if (contentWrapper) {
              constructRec.content = contentWrapper.textContent.trim();
            }

            if (constructRec.name && constructRec.content) {
              recArr.push(constructRec);
            }
          }
        }
      }
    }

    return recArr;
  } catch (error) {
    return [];
  }
}

export async function crawlRecommendationsDetailsPage(): Promise<
  PUBLIC_RECOMMENDATION_DATA_TYPE[]
> {
  try {
    let recArr: PUBLIC_RECOMMENDATION_DATA_TYPE[] = [];

    const currentUrl = window.location.href;
    const queries = queryString.parseUrl(currentUrl);

    if (
      queries["query"] &&
      (!queries["query"]["detailScreenTabIndex"] ||
        queries["query"]["detailScreenTabIndex"] === "0")
    ) {
      const listContainer = await checkIfTitleExist("ul.pvs-list");

      const listChild = listContainer ? listContainer.children : null;

      if (listChild) {
        for (const liEl of Array.from(listChild)) {
          const constructRec: PUBLIC_RECOMMENDATION_DATA_TYPE = {
            name: null,
            content: null,
          };

          const compWrapper = liEl.querySelector<HTMLElement>(".pvs-entity");
          const compContainer = compWrapper
            ? compWrapper.lastElementChild
            : null;

          const compContainerChild = compContainer
            ? compContainer.children
            : null;

          if (compContainerChild && compContainerChild.length === 2) {
            const linkEl =
              compContainerChild[0].querySelector<HTMLElement>("a");
            const nameEl = linkEl
              ? linkEl.querySelector<HTMLElement>(`span[aria-hidden="true"]`)
              : null;

            constructRec.name = nameEl ? nameEl.textContent.trim() : null;

            const contentEl = compContainerChild[1].querySelector<HTMLElement>(
              `span[aria-hidden="true"]`
            );

            constructRec.content = contentEl
              ? contentEl.textContent.trim()
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

export async function crawlLanguageSection(): Promise<
  PUBLIC_LANGUAGE_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Languages",
      true,
      100
    );

    let langArr: PUBLIC_LANGUAGE_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructLang: PUBLIC_LANGUAGE_DATA_TYPE = {
            language: null,
            proficiency: null,
          };

          const listWrapper = el.lastElementChild;
          const listContentWrapper = listWrapper
            ? listWrapper.lastElementChild?.firstElementChild?.firstElementChild
            : null;

          const languageNameWrapper =
            listContentWrapper && listContentWrapper.firstElementChild
              ? listContentWrapper.firstElementChild
              : null;

          const languageNameContainer = languageNameWrapper
            ? languageNameWrapper.querySelector(`span[aria-hidden="true"]`)
            : null;

          const languageProficiencyWrapper =
            listContentWrapper && listContentWrapper.lastElementChild
              ? listContentWrapper.lastElementChild
              : null;

          const languageProficiencyContainer = languageProficiencyWrapper
            ? languageProficiencyWrapper.querySelector(
                `span[aria-hidden="true"]`
              )
            : null;

          constructLang.language = languageNameContainer
            ? languageNameContainer.textContent.trim()
            : null;
          constructLang.proficiency = languageProficiencyContainer
            ? languageProficiencyContainer.textContent.trim()
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

export async function crawlLanguageDetailsPage(): Promise<
  PUBLIC_LANGUAGE_DATA_TYPE[]
> {
  try {
    const listContainer = await checkIfTitleExist("ul.pvs-list");

    let langArr: PUBLIC_LANGUAGE_DATA_TYPE[] = [];

    const listChild = listContainer ? listContainer.children : null;

    if (listChild) {
      for (const liEl of Array.from(listChild)) {
        const constructLang: PUBLIC_LANGUAGE_DATA_TYPE = {
          language: null,
          proficiency: null,
        };

        const compWrapper = liEl.querySelector<HTMLElement>(".pvs-entity");
        const compContainer = compWrapper ? compWrapper.lastElementChild : null;
        const compContainerChild = compContainer
          ? compContainer.firstElementChild
          : null;

        if (compContainerChild) {
          const compContainerChildFirstChild =
            compContainerChild.firstElementChild;

          if (compContainerChild.firstElementChild) {
            const compContainerChildFirstChildChildrens =
              compContainerChildFirstChild.children;

            if (
              compContainerChildFirstChildChildrens &&
              compContainerChildFirstChildChildrens.length > 0
            ) {
              const langNameContainer = compContainerChildFirstChildChildrens[0]
                ? compContainerChildFirstChildChildrens[0].querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;
              const langProfContainer = compContainerChildFirstChildChildrens[1]
                ? compContainerChildFirstChildChildrens[1].querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;

              constructLang.language = langNameContainer
                ? langNameContainer.textContent.trim()
                : null;
              constructLang.proficiency = langProfContainer
                ? langProfContainer.textContent.trim()
                : null;
            }
          }
        }

        if (constructLang.language && constructLang.proficiency) {
          langArr.push(constructLang);
        }
      }
    }

    return langArr;
  } catch (error) {
    return [];
  }
}

export async function crawlProjectsSection(): Promise<
  PUBLIC_PROJECT_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Projects",
      true,
      100
    );

    let projectArr: PUBLIC_PROJECT_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const lookForAllEl = Array.from(nextElListContainer.children);

        for (const el of lookForAllEl) {
          const constructProj: PUBLIC_PROJECT_DATA_TYPE = {
            project_name: null,
            dates: null,
            description: null,
          };

          const listWrapper = el.lastElementChild
            ? el.lastElementChild.lastElementChild
            : null;

          if (listWrapper) {
            const listWrapperChildren = listWrapper.children;

            if (listWrapperChildren && listWrapperChildren.length > 0) {
              const firstContainer = listWrapperChildren[0].children[0]
                ? listWrapperChildren[0].children[0]
                : null;
              const secondContainer = listWrapperChildren[1]
                ? listWrapperChildren[1].firstElementChild
                : null;

              if (firstContainer && firstContainer.children.length === 2) {
                const projectNameContainer = firstContainer.children[0]
                  ? firstContainer.children[0].querySelector<HTMLElement>(
                      `span[aria-hidden="true"]`
                    )
                  : null;
                const datesContainer = firstContainer.children[1]
                  ? firstContainer.children[1].querySelector<HTMLElement>(
                      `span[aria-hidden="true"]`
                    )
                  : null;

                constructProj.project_name = projectNameContainer
                  ? projectNameContainer.textContent.trim()
                  : null;
                constructProj.dates = datesContainer
                  ? datesContainer.textContent.trim()
                  : null;
              }

              if (secondContainer) {
                const secondContainerChild = secondContainer.children;

                if (secondContainerChild.length > 0) {
                  const descSpan = secondContainer.lastElementChild
                    ? secondContainer.lastElementChild.querySelector<HTMLElement>(
                        `span[aria-hidden="true"]`
                      )
                    : null;

                  constructProj.description = descSpan
                    ? descSpan.textContent.trim()
                    : null;

                  if (
                    constructProj.description.toLowerCase() === "other creators"
                  ) {
                    const newDescSpan = secondContainer.children[
                      secondContainer.children.length - 2
                    ]
                      ? secondContainer.children[
                          secondContainer.children.length - 2
                        ].querySelector<HTMLElement>(`span[aria-hidden="true"]`)
                      : null;

                    constructProj.description = newDescSpan
                      ? newDescSpan.textContent.trim()
                      : "";
                  }
                }
              }
            }
          }

          if (
            constructProj.project_name &&
            constructProj.dates &&
            constructProj.description
          ) {
            projectArr.push(constructProj);
          }
        }
      }
    }

    return projectArr;
  } catch (error) {
    return [];
  }
}

export async function crawlProjectsDetailsPage(): Promise<
  PUBLIC_PROJECT_DATA_TYPE[]
> {
  try {
    const listContainer = await checkIfTitleExist("ul.pvs-list");

    let projectArr: PUBLIC_PROJECT_DATA_TYPE[] = [];

    const listChild = listContainer ? listContainer.children : null;

    if (listChild) {
      for (const liEl of Array.from(listChild)) {
        const constructProj: PUBLIC_PROJECT_DATA_TYPE = {
          project_name: null,
          dates: null,
          description: null,
        };

        const compWrapper = liEl.querySelector<HTMLElement>(".pvs-entity");
        const compContainer = compWrapper ? compWrapper.lastElementChild : null;

        if (compContainer && compContainer.children.length === 2) {
          const firstContainer =
            compContainer.children[0] &&
            compContainer.children[0].children.length > 0 &&
            compContainer.children[0].children[0]
              ? compContainer.children[0].children[0]
              : null;
          const secondContainer = compContainer.children[1]
            ? compContainer.children[1].firstElementChild
            : null;

          if (firstContainer && firstContainer.children.length === 2) {
            const projectNameContainer = firstContainer.children[0]
              ? firstContainer.children[0].querySelector<HTMLElement>(
                  `span[aria-hidden="true"]`
                )
              : null;
            const datesContainer = firstContainer.children[1]
              ? firstContainer.children[1].querySelector<HTMLElement>(
                  `span[aria-hidden="true"]`
                )
              : null;

            constructProj.project_name = projectNameContainer
              ? projectNameContainer.textContent.trim()
              : null;
            constructProj.dates = datesContainer
              ? datesContainer.textContent.trim()
              : null;
          }

          if (secondContainer) {
            const secondContainerChild = secondContainer.children;

            if (secondContainerChild.length > 0) {
              const descSpan = secondContainer.lastElementChild
                ? secondContainer.lastElementChild.querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;

              constructProj.description = descSpan
                ? descSpan.textContent.trim()
                : null;
            }
          }
        }

        if (
          constructProj.project_name &&
          constructProj.dates &&
          constructProj.description
        ) {
          projectArr.push(constructProj);
        }
      }
    }

    return projectArr;
  } catch (error) {
    return [];
  }
}

export function publicProfileCommonCrawlerAwards(
  listEl: Element[]
): PUBLIC_AWARD_DATA_TYPE[] {
  try {
    let awardsArr: PUBLIC_AWARD_DATA_TYPE[] = [];

    for (const el of listEl) {
      const constructAward: PUBLIC_AWARD_DATA_TYPE = {
        award_name: null,
        issuer: null,
        date: null,
        description: null,
      };

      const pvsEntity = el.querySelector<HTMLElement>(".pvs-entity");

      const contentContainer = pvsEntity ? pvsEntity.lastElementChild : null;

      if (contentContainer && contentContainer.children.length > 0) {
        const firstContainer = contentContainer.children[0];
        const secondContainer = contentContainer.lastElementChild;

        if (firstContainer) {
          const firstContainerChildren = firstContainer.children;

          if (firstContainerChildren.length > 0) {
            const awardNameContainer =
              firstContainerChildren[0] &&
              firstContainerChildren[0].children.length > 0 &&
              firstContainerChildren[0].children[0].querySelector<HTMLElement>(
                `span[aria-hidden="true"]`
              )
                ? firstContainerChildren[0].children[0].querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;

            const issuerDateContainer =
              firstContainerChildren[0] &&
              firstContainerChildren[0].children.length > 0 &&
              firstContainerChildren[0].children[1].querySelector<HTMLElement>(
                `span[aria-hidden="true"]`
              )
                ? firstContainerChildren[0].children[1].querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;

            if (issuerDateContainer) {
              const rawIssuerDateText = issuerDateContainer.textContent
                .trim()
                .split("·");

              if (rawIssuerDateText.length > 0) {
                constructAward.date = rawIssuerDateText[1]
                  ? rawIssuerDateText[1].trim()
                  : null;
                constructAward.issuer =
                  rawIssuerDateText[0] &&
                  rawIssuerDateText[0].includes("Issued by")
                    ? rawIssuerDateText[0].replace("Issued by", "").trim()
                    : null;

                if (!constructAward.date && !constructAward.issuer) {
                  const reassignedDateText =
                    issuerDateContainer.textContent.trim();

                  constructAward.date = moment(
                    reassignedDateText,
                    "MMM YYYY"
                  ).isValid()
                    ? reassignedDateText
                    : "";

                  constructAward.issuer = "";
                } else if (!constructAward.date) {
                  constructAward.date = "";
                } else if (!constructAward.issuer) {
                  constructAward.issuer = "";
                }
              }
            }

            constructAward.award_name = awardNameContainer
              ? awardNameContainer.textContent.trim()
              : null;
          }
        }

        if (secondContainer) {
          const secondContainerPvsListEl =
            secondContainer.querySelector<HTMLElement>("ul.pvs-list");

          const descContainer =
            secondContainerPvsListEl.querySelector<HTMLElement>(
              `span[aria-hidden="true"]`
            );

          constructAward.description = descContainer
            ? descContainer.textContent.trim()
            : null;

          // if (constructAward.description.includes("Associated with")) {
          //   constructAward.description = "";
          // }
        }
      }

      if (
        constructAward.award_name &&
        constructAward.issuer !== null &&
        constructAward.issuer !== undefined &&
        constructAward.date &&
        constructAward.description !== null &&
        constructAward.description !== undefined
      ) {
        awardsArr.push(constructAward);
      }
    }

    return awardsArr;
  } catch (err) {
    return [];
  }
}

export async function crawlAwardsSection(): Promise<PUBLIC_AWARD_DATA_TYPE[]> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Honors & awards",
      true,
      100
    );

    let awardsArr: PUBLIC_AWARD_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const listEl = Array.from(nextElListContainer.children);

        awardsArr = publicProfileCommonCrawlerAwards(listEl);
      }
    }

    return awardsArr;
  } catch (error) {
    return [];
  }
}

export async function crawlAwardsDetailsPage(): Promise<
  PUBLIC_AWARD_DATA_TYPE[]
> {
  try {
    const listContainer = await checkIfTitleExist("ul.pvs-list");

    let awardsArr: PUBLIC_AWARD_DATA_TYPE[] = [];

    const listChild = listContainer ? listContainer.children : null;

    if (listChild && listChild.length > 0) {
      awardsArr = publicProfileCommonCrawlerAwards(Array.from(listChild));
    }

    return awardsArr;
  } catch (error) {
    return [];
  }
}

export function publicProfileCommonCrawlerVolunteerWork(
  listEl: Element[]
): PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] {
  try {
    let volunteerArr: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] = [];

    for (const el of listEl) {
      const constructVolunteer: PUBLIC_VOLUNTEER_WORK_DATA_TYPE = {
        title: null,
        company: null,
        date: null,
        description: null,
      };

      const pvsEntity = el.querySelector<HTMLElement>(".pvs-entity");

      const contentContainer = pvsEntity ? pvsEntity.lastElementChild : null;

      if (contentContainer && contentContainer.children.length > 0) {
        const firstContainer = contentContainer.children[0];
        const secondContainer = contentContainer.lastElementChild;

        if (firstContainer) {
          const firstContainerFirstChild = firstContainer.firstElementChild;

          if (
            firstContainerFirstChild &&
            firstContainerFirstChild.children.length > 1
          ) {
            const volunteerTitleContainer =
              firstContainerFirstChild.firstElementChild
                ? firstContainerFirstChild.firstElementChild.querySelector<HTMLElement>(
                    `span[aria-hidden="true"]`
                  )
                : null;
            const volunteerCompanyContainer = firstContainerFirstChild
              .children[1]
              ? firstContainerFirstChild.children[1].querySelector<HTMLElement>(
                  `span[aria-hidden="true"]`
                )
              : null;
            const volunteerDateContainer = firstContainerFirstChild.children[2]
              ? firstContainerFirstChild.children[2].querySelector<HTMLElement>(
                  `span[aria-hidden="true"]`
                )
              : null;

            constructVolunteer.title = volunteerTitleContainer
              ? volunteerTitleContainer.textContent.trim()
              : null;
            constructVolunteer.company = volunteerCompanyContainer
              ? volunteerCompanyContainer.textContent.trim()
              : null;
            constructVolunteer.date = volunteerDateContainer
              ? volunteerDateContainer.textContent.trim()
              : null;
          }
        }

        if (secondContainer) {
          const secondContainerPvsListEl =
            secondContainer.querySelector<HTMLElement>("ul.pvs-list");

          if (secondContainerPvsListEl) {
            constructVolunteer.description =
              secondContainerPvsListEl.querySelector<HTMLElement>(
                `span[aria-hidden="true"]`
              )
                ? secondContainerPvsListEl
                    .querySelector<HTMLElement>(`span[aria-hidden="true"]`)
                    .textContent.trim()
                : null;
          }
        }
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

    return volunteerArr;
  } catch (err) {
    return [];
  }
}

export async function crawlVolunteerWorkSection(): Promise<
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Volunteering",
      true,
      100
    );

    let volunteerArr: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const listEl = Array.from(nextElListContainer.children);

        volunteerArr = publicProfileCommonCrawlerVolunteerWork(listEl);
      }
    }

    return volunteerArr;
  } catch (error) {
    return [];
  }
}

export async function crawlVolunteerWorkDetailsPage(): Promise<
  PUBLIC_VOLUNTEER_WORK_DATA_TYPE[]
> {
  try {
    const listContainer = await checkIfTitleExist("ul.pvs-list");

    let volunteerArr: PUBLIC_VOLUNTEER_WORK_DATA_TYPE[] = [];

    const listChild = listContainer ? listContainer.children : null;

    if (listChild && listChild.length > 0) {
      volunteerArr = publicProfileCommonCrawlerVolunteerWork(
        Array.from(listChild)
      );
    }

    return volunteerArr;
  } catch (error) {
    return [];
  }
}

export function publicProfileCommonCrawlerCourse(
  listEl: Element[]
): PUBLIC_COURSE_DATA_TYPE[] {
  try {
    let courseArr: PUBLIC_COURSE_DATA_TYPE[] = [];

    for (const el of listEl) {
      const constructCourse: PUBLIC_COURSE_DATA_TYPE = {
        name: null,
      };

      const courseNameContainer = el.querySelector<HTMLElement>(
        `span[aria-hidden="true"]`
      );

      if (courseNameContainer) {
        constructCourse.name = courseNameContainer.textContent.trim();
      }

      if (constructCourse.name) {
        courseArr.push(constructCourse);
      }
    }

    return courseArr;
  } catch (err) {
    return [];
  }
}

export async function crawlCoursesSection(): Promise<
  PUBLIC_COURSE_DATA_TYPE[]
> {
  try {
    const titleContainer = await checkIfTitleExist(
      ".pvs-header__container .pvs-header__title",
      "Courses",
      true,
      100
    );

    let courseArr: PUBLIC_COURSE_DATA_TYPE[] = [];

    if (titleContainer) {
      const titleWrapper = titleContainer.closest(".pvs-header__container");
      const nextEl = titleWrapper ? titleWrapper.nextElementSibling : null;
      let nextElListContainer = nextEl
        ? nextEl.querySelector<HTMLElement>("ul.pvs-list")
        : null;

      if (nextElListContainer && nextElListContainer.children.length > 0) {
        const listEl = Array.from(nextElListContainer.children);

        courseArr = publicProfileCommonCrawlerCourse(listEl);
      }
    }

    return courseArr;
  } catch (error) {
    return [];
  }
}

export async function crawlCoursesDetailsPage(): Promise<
  PUBLIC_COURSE_DATA_TYPE[]
> {
  try {
    const listContainer = await checkIfTitleExist("ul.pvs-list");

    let courseArr: PUBLIC_COURSE_DATA_TYPE[] = [];

    const listChild = listContainer ? listContainer.children : null;

    if (listChild && listChild.length > 0) {
      courseArr = publicProfileCommonCrawlerCourse(Array.from(listChild));
    }

    return courseArr;
  } catch (error) {
    return [];
  }
}

function processString(s: string) {
  return s
    .replace(/(\r\n|\r\n\t|\n|\r|\t)/gm, "")
    .replace(/\&nbsp;/g, "")
    .trim();
}
