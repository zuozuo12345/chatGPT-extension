import moment from "moment";

import { PUBLIC_CERTIFICATION_DATA_TYPE } from "../../../../typescript/types/candidate";
import { checkIfTitleExist } from "../../utils";

export function rpsConstructCertObj(cert) {
  try {
    const constructCert: PUBLIC_CERTIFICATION_DATA_TYPE = {
      name: cert["name"] ?? null,
      dates: null,
    };

    if (cert) {
      const dates =
        cert["startDateOn"] &&
        cert["startDateOn"]["month"] &&
        cert["startDateOn"]["year"]
          ? `${moment().month(cert["startDateOn"]["month"]).format("MMM")} ${
              cert["startDateOn"]["year"]
            }${
              cert["endDateOn"] &&
              cert["endDateOn"]["month"] &&
              cert["endDateOn"]["year"]
                ? ` - ${moment()
                    .month(cert["endDateOn"]["month"])
                    .format("MMM")} ${cert["endDateOn"]["year"]}`
                : " - Present"
            }`
          : cert["startDateOn"] && cert["startDateOn"]["year"]
          ? `${cert["startDateOn"]["year"]} - Present`
          : null;

      constructCert["dates"] = dates;

      return constructCert;
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function rpsRetrieveCertifications(responseCerts) {
  try {
    let certifications: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    if (
      responseCerts &&
      typeof responseCerts === "object" &&
      responseCerts.length > 0
    ) {
      responseCerts.forEach((cert) => {
        const certObj = rpsConstructCertObj(cert);

        if (certObj) {
          certifications.push(certObj);
        }
      });
    } else {
      const rpsScrapeEducationResponse = await rpsScrapeCertifications();

      certifications = rpsScrapeEducationResponse.certifications;
    }

    return {
      certifications:
        certifications && certifications.length > 0
          ? certifications.filter(
              (item) =>
                item !== null && item !== undefined && item.name !== null
            )
          : [],
    };
  } catch (err) {
    return {
      certifications: [],
    };
  }
}

export async function rpsScrapeCertifications() {
  try {
    const titleContainer = await checkIfTitleExist(
      ".accomplishments-expandable-list__title",
      "certifications",
      false,
      50
    );

    if (!titleContainer) {
      throw "Can't be found";
    }

    const certifications: PUBLIC_CERTIFICATION_DATA_TYPE[] = [];

    const certificationsContainer =
      titleContainer.parentElement?.parentElement?.parentElement?.parentElement;

    if (
      certificationsContainer &&
      certificationsContainer.classList.contains(
        "accomplishments-expandable-list__list-container"
      )
    ) {
      const certUlElement = certificationsContainer.querySelector<HTMLElement>(
        "ul.accomplishments-expandable-list__list"
      );

      if (certUlElement && certUlElement.childElementCount > 0) {
        Array.from(certUlElement.children).forEach((el) => {
          const nameContainer = el.querySelector<HTMLElement>(
            ".accomplishments-base-entity__title"
          );
          const dateContainer = el.querySelector<HTMLElement>(
            ".accomplishments-base-entity__date"
          );

          const constructCert: PUBLIC_CERTIFICATION_DATA_TYPE =
            nameContainer && dateContainer
              ? {
                  name: nameContainer ? nameContainer.innerText.trim() : null,
                  dates: dateContainer ? dateContainer.innerText.trim() : null,
                }
              : null;

          if (constructCert) {
            certifications.push(constructCert);
          }
        });
      }
    }

    return {
      certifications: certifications,
    };
  } catch (err) {
    return {
      certifications: [],
    };
  }
}
