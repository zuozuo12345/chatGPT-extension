import { PUBLIC_EDUCATIOM_DATA_TYPE } from "../../../../typescript/types/candidate";
import { checkIfTitleExist } from "../../utils";

export function rpsConstructEduObj(edu) {
  try {
    const degree_name = edu["degreeName"] ?? null;
    const institution = edu["schoolName"] ?? null;
    const field = edu["fieldOfStudy"] ?? null;
    const dates =
      edu["startDateOn"] && edu["startDateOn"]["year"]
        ? `${edu["startDateOn"]["year"]}${
            edu["endDateOn"] && edu["endDateOn"]["year"]
              ? ` - ${edu["endDateOn"]["year"]}`
              : " - Present"
          }`
        : null;

    const constructEdu: PUBLIC_EDUCATIOM_DATA_TYPE = {
      degree_name,
      institution,
      field,
      dates,
    };

    return constructEdu;
  } catch (err) {
    return null;
  }
}

export async function rpsRetrieveEducations(responseEducations) {
  try {
    let educations: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

    if (
      responseEducations &&
      typeof responseEducations === "object" &&
      responseEducations.length > 0
    ) {
      responseEducations.forEach((item) => {
        const eduObj = rpsConstructEduObj(item);

        if (eduObj) {
          educations.push(eduObj);
        }
      });
    } else {
      const rpsScrapeEducationResponse = await rpsScrapeEducation();

      educations = rpsScrapeEducationResponse.educations;
    }

    return {
      educations:
        educations && educations.length > 0
          ? educations.filter(
              (item) =>
                item !== null && item !== undefined && item.degree_name !== null
            )
          : [],
    };
  } catch (err) {
    return {
      educations: [],
    };
  }
}

export async function rpsScrapeEducation() {
  try {
    const titleContainer = await checkIfTitleExist(
      ".background-section__title",
      "education",
      false,
      50
    );

    if (!titleContainer) {
      throw "Can't be found";
    }

    const educations: PUBLIC_EDUCATIOM_DATA_TYPE[] = [];

    const eduUlElement = titleContainer.parentElement.nextElementSibling;

    if (
      eduUlElement.classList.contains("background-section__list") &&
      eduUlElement.childElementCount > 0
    ) {
      const eduUlElementChild = eduUlElement.children;

      for (let j = 0; j < eduUlElement.childElementCount; j++) {
        const eduLiElement = eduUlElementChild[j];

        const institutionContainer =
          eduLiElement.querySelector<HTMLElement>("dd");
        const degreeNameContainer = eduLiElement.querySelector<HTMLElement>(
          ".degree-summary__description"
        );
        const fieldNameContainer = eduLiElement.querySelector<HTMLElement>(
          `[data-test-education-entity-field-of-study=""]`
        );
        const datesContainer = eduLiElement.querySelector<HTMLElement>(
          ".background-entity__summary-definition--date-duration"
        );

        const constructEdu: PUBLIC_EDUCATIOM_DATA_TYPE =
          degreeNameContainer && institutionContainer && fieldNameContainer
            ? {
                degree_name: degreeNameContainer
                  ? degreeNameContainer.textContent
                      .trim()
                      .replace(/\s/g, "")
                      .replace(/[^\w\s]/gi, "")
                  : null,
                institution: institutionContainer
                  ? institutionContainer.innerText.trim()
                  : null,
                field: fieldNameContainer
                  ? fieldNameContainer.innerText.trim()
                  : null,
                dates: datesContainer ? datesContainer.innerText.trim() : null,
              }
            : null;

        if (constructEdu) {
          educations.push(constructEdu);
        }
      }
    }

    return {
      educations: educations,
    };
  } catch (err) {
    return {
      educations: [],
    };
  }
}
