import moment from "moment";

import { checkIfTitleExist } from "../../utils";
import { PUBLIC_EXPERIENCE_DATA_TYPE } from "../../../../typescript/types/candidate";
import { getDurationFromMonthYear } from "../../utils";

export function rpsConstructWorkExpObj(pos) {
  try {
    const dates =
      pos["startDateOn"] &&
      (pos["startDateOn"]["month"] || pos["startDateOn"]["year"])
        ? `${
            pos["startDateOn"]["month"]
              ? moment().month(pos["startDateOn"]["month"]).format("MMM")
              : ""
          } ${pos["startDateOn"]["year"]}${
            pos["endDateOn"] &&
            (pos["endDateOn"]["month"] || pos["endDateOn"]["year"])
              ? ` -${
                  pos["endDateOn"]["month"]
                    ? ` ${moment()
                        .month(pos["endDateOn"]["month"])
                        .format("MMM")}`
                    : ""
                } ${pos["endDateOn"]["year"]}`
              : " - Present"
          }`
        : null;

    const duration =
      pos["startDateOn"] &&
      (pos["startDateOn"]["month"] || pos["startDateOn"]["year"])
        ? getDurationFromMonthYear(
            pos["startDateOn"] && pos["startDateOn"]["month"]
              ? pos["startDateOn"]["month"]
              : null,
            pos["startDateOn"] && pos["startDateOn"]["year"]
              ? pos["startDateOn"]["year"]
              : null,
            pos["endDateOn"] && pos["endDateOn"]["month"]
              ? pos["endDateOn"]["month"]
              : null,
            pos["endDateOn"] && pos["endDateOn"]["year"]
              ? pos["endDateOn"]["year"]
              : null
          )
        : null;

    const constructWorkExp: PUBLIC_EXPERIENCE_DATA_TYPE = {
      job_title: pos["title"] ?? null,
      company_name: pos["companyName"] ?? "",
      job_subtitles: null,
      dates: dates,
      duration: duration ? duration : null,
      location:
        pos["location"] && pos["location"]["displayName"]
          ? pos["location"]["displayName"]
          : null,
      description: pos["description"] ? pos["description"] : null,
    };

    return constructWorkExp;
  } catch (err) {
    return null;
  }
}

export async function rpsRetrievetWorkExp(responseGroupedWorkExperience) {
  try {
    let workExperience: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

    if (
      responseGroupedWorkExperience &&
      typeof responseGroupedWorkExperience === "object" &&
      responseGroupedWorkExperience.length > 0
    ) {
      responseGroupedWorkExperience.forEach((item) => {
        const positions = item["positions"] ?? null;

        if (
          positions &&
          typeof positions === "object" &&
          positions.length > 0
        ) {
          positions.forEach((pos) => {
            const rpsConstructWorkExpObjResponse = rpsConstructWorkExpObj(pos);

            if (rpsConstructWorkExpObjResponse) {
              workExperience.push(rpsConstructWorkExpObjResponse);
            }
          });
        }
      });
    } else {
      const rpsScrapeWorkExpResponse = await rpsScrapeWorkExp();

      workExperience = rpsScrapeWorkExpResponse.workExp;
    }

    return {
      workExp:
        workExperience && workExperience.length > 0
          ? workExperience.filter(
              (item) =>
                item !== null && item !== undefined && item.job_title !== null
            )
          : [],
    };
  } catch (err) {
    return {
      workExp: [],
    };
  }
}

export async function rpsScrapeWorkExp() {
  try {
    const titleContainer = await checkIfTitleExist(
      ".expandable-list-profile-core__title",
      "Experience",
      false,
      50
    );

    if (!titleContainer) {
      throw "Can't be found";
    }

    const workExperience: PUBLIC_EXPERIENCE_DATA_TYPE[] = [];

    const els = document.querySelectorAll<HTMLElement>(
      ".expandable-list-profile-core__title"
    );

    if (els && els.length > 0) {
      const findExpTitle = Array.from(els).find(
        (el) => el.textContent.trim().toLowerCase() === "experience"
      );

      if (findExpTitle) {
        const expUlElement = findExpTitle.nextElementSibling;

        if (expUlElement) {
          const expUlElementChild = expUlElement.children;

          for (let j = 0; j < expUlElement.childElementCount; j++) {
            const expLiElement = expUlElementChild[j];
            const workExpSummaryContainer =
              expLiElement.querySelector<HTMLElement>(
                ".background-entity__summary"
              );

            if (workExpSummaryContainer) {
              const jobTitleContainer =
                workExpSummaryContainer.querySelector<HTMLElement>("dd");
              const companyNameContainer =
                workExpSummaryContainer.querySelector<HTMLElement>(
                  ".background-entity__summary-definition--subtitle"
                );
              const dateDurationContainer =
                workExpSummaryContainer.querySelector<HTMLElement>(
                  ".background-entity__summary-definition--date-duration"
                );
              const dateContainer = dateDurationContainer
                ? dateDurationContainer.querySelector<HTMLElement>(
                    ".background-entity__date-range"
                  )
                : null;
              const durationContainer = dateDurationContainer
                ? dateDurationContainer.querySelector<HTMLElement>(
                    ".background-entity__duration"
                  )
                : null;
              const locationContainer =
                workExpSummaryContainer.querySelector<HTMLElement>(
                  ".background-entity__summary-definition--location"
                );
              const descriptionContainer =
                expLiElement.querySelector<HTMLElement>(
                  `.background-entity__summary-definition--description`
                );

              const workExpObj: PUBLIC_EXPERIENCE_DATA_TYPE = jobTitleContainer
                ? {
                    job_title: jobTitleContainer
                      ? jobTitleContainer.innerText.trim()
                      : null,
                    company_name: companyNameContainer
                      ? companyNameContainer.innerText.trim()
                      : null,
                    job_subtitles: null,
                    dates: dateContainer
                      ? dateContainer.innerText.trim()
                      : null,
                    duration: durationContainer
                      ? durationContainer.innerText.trim()
                      : null,
                    location: locationContainer
                      ? locationContainer.innerText.trim()
                      : null,
                    description: descriptionContainer
                      ? descriptionContainer.innerText.trim()
                      : null,
                  }
                : null;

              if (workExpObj) {
                workExperience.push(workExpObj);
              }
            } else {
              const companyNameContainer =
                expLiElement.querySelector<HTMLElement>(
                  "a strong.grouped-position-entity__company-name"
                );
              const companyWorkExpList =
                expLiElement.querySelector<HTMLElement>("dl");
              const companyWorkExpListChild = companyWorkExpList
                ? companyWorkExpList.children
                : null;

              if (
                companyWorkExpListChild &&
                companyWorkExpListChild.length > 0
              ) {
                Array.from(companyWorkExpListChild).forEach((el) => {
                  const jobTitleContainer = el.querySelector<HTMLElement>(
                    `a[data-test-grouped-position-title-link=""]`
                  );
                  const dateContainer = el.querySelector<HTMLElement>(
                    `span[data-test-grouped-position-entity-date-range=""]`
                  );
                  const durationContainer = el.querySelector<HTMLElement>(
                    `span[data-test-grouped-position-entity-duration=""]`
                  );
                  const descriptionContainer = el.querySelector<HTMLElement>(
                    ".grouped-position-entity__description"
                  );
                  const locationContainer = el.querySelector<HTMLElement>(
                    `[data-test-grouped-position-entity-location=""]`
                  );

                  const workExpObj: PUBLIC_EXPERIENCE_DATA_TYPE =
                    companyNameContainer && jobTitleContainer
                      ? {
                          job_title: jobTitleContainer
                            ? jobTitleContainer.innerText.trim()
                            : null,
                          company_name: companyNameContainer
                            ? companyNameContainer.innerText.trim()
                            : null,
                          job_subtitles: null,
                          dates: dateContainer
                            ? dateContainer.innerText.trim()
                            : null,
                          duration: durationContainer
                            ? durationContainer.innerText.trim()
                            : null,
                          location: locationContainer
                            ? locationContainer.innerText.trim()
                            : null,
                          description: descriptionContainer
                            ? descriptionContainer.innerText.trim()
                            : null,
                        }
                      : null;

                  if (workExpObj) {
                    workExperience.push(workExpObj);
                  }
                });
              }
            }
          }
        }
      }
    }

    return {
      workExp: workExperience ?? [],
    };
  } catch (err) {
    return {
      workExp: [],
    };
  }
}
