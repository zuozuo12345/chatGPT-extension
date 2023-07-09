import * as Yup from "yup";

import {
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_EDU_INTERFACE,
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE,
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE,
} from "../../../../typescript/types/linkedin/searched_profile";

interface constructProfileArgs {
  el: any;
  resultFieldName?:
    | "linkedInMemberProfileResolutionResult"
    | "linkedInMemberProfileUrnResolutionResult";
}

export function constructTalentHireProfile({
  el,
  resultFieldName = "linkedInMemberProfileUrnResolutionResult",
}: constructProfileArgs): SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE {
  try {
    if (!el) {
      throw "No data";
    }

    const item = el[resultFieldName] ? el[resultFieldName] : null;

    if (!item) {
      return null;
    }

    let emails: string[] = [];
    let phoneNumbers: string[] = [];

    const hiringProjectRecruitingProfileResolutionResult = el[
      "hiringProjectRecruitingProfileResolutionResult"
    ]
      ? el["hiringProjectRecruitingProfileResolutionResult"]
      : null;

    if (
      hiringProjectRecruitingProfileResolutionResult &&
      hiringProjectRecruitingProfileResolutionResult["contactInfo"]
    ) {
      const emailsField = hiringProjectRecruitingProfileResolutionResult[
        "contactInfo"
      ]["emails"]
        ? hiringProjectRecruitingProfileResolutionResult["contactInfo"][
            "emails"
          ]
        : null;
      const phoneNumbersField = hiringProjectRecruitingProfileResolutionResult[
        "contactInfo"
      ]["phones"]
        ? hiringProjectRecruitingProfileResolutionResult["contactInfo"][
            "phones"
          ]
        : null;

      if (
        emailsField &&
        typeof emailsField === "object" &&
        emailsField.length > 0 &&
        typeof emailsField[0] === "string"
      ) {
        emails = emailsField
          .map((email: string) => {
            try {
              const validateEmail =
                typeof email === "string" &&
                Yup.string().email().isValidSync(email);

              return validateEmail ? email : null;
            } catch (error) {
              return null;
            }
          })
          .filter((item) => item !== null);
      }

      if (
        phoneNumbersField &&
        typeof phoneNumbersField === "object" &&
        phoneNumbersField.length > 0 &&
        phoneNumbersField[0] &&
        phoneNumbersField[0]["number"] &&
        typeof phoneNumbersField[0]["number"] === "string"
      ) {
        phoneNumbersField.forEach((numbObj) => {
          if (numbObj["number"] && typeof numbObj["number"] === "string") {
            phoneNumbers.push(numbObj["number"]);
          }
        });
      }
    }

    return {
      linkedInMemberProfileUrnResolutionResult: {
        fullProfileNotVisible: item["fullProfileNotVisible"]
          ? item["fullProfileNotVisible"]
          : false,
        firstName: item["firstName"] ?? null,
        lastName: item["lastName"] ?? null,
        entityUrn: item["entityUrn"] ?? null,
        publicProfileUrl: item["publicProfileUrl"] ?? null,
        industryName: item["industryName"] ?? null,
        headline: item["headline"] ?? null,
        workExperience: item["workExperience"]
          ? item["workExperience"].map((we) => {
              return {
                companyName: we["companyName"] ?? null,
                description:
                  we["companyResolutionResult"] &&
                  we["companyResolutionResult"]["industries"] &&
                  we["companyResolutionResult"]["industries"].length > 0
                    ? we["companyResolutionResult"]["industries"][0]
                    : null,
                title: we["title"] ?? null,
                startDateOn: we["startDateOn"] ?? {
                  month: 0,
                  year: 0,
                },
                endDateOn: we["endDateOn"] ?? {
                  month: 0,
                  year: 0,
                },
              };
            })
          : [],
        currentPositions:
          item["currentPositions"] && item["currentPositions"].length > 0
            ? item["currentPositions"]
            : [],
        memberPreferences: {
          openToNewOpportunities:
            item["memberPreferences"] &&
            item["memberPreferences"]["openToNewOpportunities"]
              ? item["memberPreferences"]["openToNewOpportunities"]
              : false,
        },
        skills: item["skills"]
          ? item["skills"]
              .map((skill) => {
                return skill["skillName"]
                  ? {
                      skillName: skill["skillName"] ?? null,
                      skillAssessmentVerified:
                        skill["skillAssessmentVerified"] &&
                        typeof skill["skillAssessmentVerified"] === "boolean"
                          ? skill["skillAssessmentVerified"]
                          : false,
                    }
                  : (null as SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE);
              })
              .filter((item) => item.skillName !== null && item !== null)
          : [],
        educations: item["educations"]
          ? item["educations"]
              .map((edu) => {
                return {
                  degreeName: edu["degreeName"] ?? null,
                  schoolName: edu["schoolName"] ?? null,
                  startDateOn: {
                    month:
                      edu["startDateOn"] && edu["startDateOn"]["month"]
                        ? edu["startDateOn"]["month"]
                        : null,
                    year:
                      edu["startDateOn"] && edu["startDateOn"]["year"]
                        ? edu["startDateOn"]["year"]
                        : null,
                  },
                  endDateOn: {
                    month:
                      edu["endDateOn"] && edu["endDateOn"]["month"]
                        ? edu["endDateOn"]["month"]
                        : null,
                    year:
                      edu["endDateOn"] && edu["endDateOn"]["year"]
                        ? edu["endDateOn"]["year"]
                        : null,
                  },
                } as SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_EDU_INTERFACE;
              })
              .filter(
                (item) =>
                  item.degreeName !== null &&
                  item.schoolName !== null &&
                  item !== null
              )
          : [],
        emails,
        phoneNumbers,
      },
    };
  } catch {
    return null;
  }
}
