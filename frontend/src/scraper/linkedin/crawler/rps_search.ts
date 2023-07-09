import queryString from "query-string";
import * as Yup from "yup";
import _ from "lodash";

import { saveLinkedinScrapUserLinksSearchResult } from "../../../api/scout/candidate/create";
import {
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_EDU_INTERFACE,
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE,
  SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE,
} from "../../../typescript/types/linkedin/searched_profile";
import { checkIfTitleExist, delay, determinePath } from "../utils";
import { crawlRpsSimilarProfileSection } from "./modules/profile";

// export async function scrapSearchResultLinkedin() {
//   try {
//     await searchUserIdsFunc();
//     // const url = window.location.href;
//     // const urlClass = new URL(url);
//     // const parseQueryParams = queryString.parse(urlClass.search);
//     // const startFrom =
//     //   "start" in parseQueryParams &&
//     //   parseQueryParams["start"] &&
//     //   !isNaN(parseInt(`${parseQueryParams["start"]}`))
//     //     ? parseInt(`${parseQueryParams["start"]}`)
//     //     : null;
//     // const { list } = await talentRecruiterSearchHitsApiCall(startFrom);
//     // const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);
//     // if (storageResponse["scoutWebToken"]) {
//     // await saveLinkedinRpsSearchResult({
//     //     access_token: storageResponse["scoutWebToken"],
//     //     elements: list,
//     //   });
//     // }
//     // let totalPage = Math.ceil(51 / searchCount);
//     // let candidateList: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE[] = [];
//     // // Limit amount of list to fetch for now
//     // if (totalPage > 2) {
//     //   totalPage = 2;
//     // }
//     // if (totalPage > 1) {
//     //   const fakeArr_ = Array.from(Array(totalPage).keys());
//     //   const promises = await Promise.all(
//     //     fakeArr_.map(async (item, index) => {
//     //       if (index > 0) {
//     //         const startFrom__ = searchCount * index;
//     //         // Introduce delay to prevent too many request
//     //         await delay(2000 * (index + 1), null);
//     //         const talentRecruiterSearchHitsApiCallResponse =
//     //           await talentRecruiterSearchHitsApiCall(startFrom__);
//     //         return talentRecruiterSearchHitsApiCallResponse.list;
//     //       }
//     //       return null;
//     //     })
//     //   );
//     //   promises.forEach((list_) => {
//     //     if (list_ !== null && typeof list_ === "object" && list_.length > 0) {
//     //       candidateList = [...candidateList, ...list_];
//     //     }
//     //   });
//     // }
//     // console.log({
//     //   candidateList,
//     //   totalPage,
//     // });
//     // if (storageResponse["scoutWebToken"] && candidateList.length > 0) {
//     //   await saveLinkedinRpsSearchResult({
//     //     access_token: storageResponse["scoutWebToken"],
//     //     elements: candidateList,
//     //   });
//     // }
//   } catch (error) {
//     console.log(1);
//     console.log(error);
//     // console.error(error);
//   }
// }

// async function scrollToBottom() {
//   return new Promise<void>((resolve, reject) => {
//     var totalHeight = 0;
//     var distance = 100;
//     var timer = setInterval(() => {
//       var scrollHeight = document.body.scrollHeight;
//       window.scrollBy(0, distance);
//       totalHeight += distance;

//       if (totalHeight >= scrollHeight) {
//         clearInterval(timer);
//         resolve();
//       }
//     }, 10);
//   });
// }

const processedUrls = new Set();

export async function scrapSearchResultLinkedin() {
  try {
    const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

    if (!storageResponse["scoutWebToken"]) {
      throw new Error("No access token in storage");
    }

    const token = storageResponse["scoutWebToken"];
    let currentUrl = window.location.href;

    let processingComplete = false;

    // Listen to scroll
    const onScroll = async () => {
      if (!processingComplete) return;
      window.removeEventListener("scroll", onScroll); // remove the listener to avoid multiple triggers

      const { urls: UrlLinks, source: Source } = await processSearchResults();

      let uniqueUrls = UrlLinks.filter((url) => !processedUrls.has(url));

      if (uniqueUrls.length > 0) {
        let sendUrls = uniqueUrls;
        uniqueUrls.forEach((url) => processedUrls.add(url)); // store sent urls
        uniqueUrls = null;
        await saveResults(token, sendUrls, Source);
      }

      window.addEventListener("scroll", onScroll); // reattach the listener
    };

    // Run once without listening to scroll
    let { urls: UrlLinks, source: Source } = await processSearchResults();

    let uniqueUrls = UrlLinks.filter((url) => !processedUrls.has(url));

    if (uniqueUrls.length > 0) {
      let sendUrls = uniqueUrls;
      uniqueUrls.forEach((url) => processedUrls.add(url)); // store sent urls
      uniqueUrls = null;
      await saveResults(token, sendUrls, Source);
    }
    processingComplete = true;

    setTimeout(() => {
      window.addEventListener("scroll", onScroll);
    }, 2000);

    if (processingComplete) {
      window.addEventListener("scroll", onScroll);
    }

    // Listen to URL changes to clear data
    const observer = new MutationObserver(() => {
      if (
        window.location.href.startsWith(
          "https://www.linkedin.com/talent/search?"
        ) &&
        window.location.href !== currentUrl
      ) {
        processedUrls.clear();
        UrlLinks = null;
        currentUrl = window.location.href;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error(error);
  }
}

export async function saveResults(
  token: string,
  UrlList: string[],
  source: string
) {
  if (UrlList.length > 0) {
    await saveLinkedinScrapUserLinksSearchResult({
      access_token: token,
      urls: UrlList,
      source: source,
    });
  }
}

export async function processSearchResults() {
  const { mainPathType, subPathType } = determinePath(window.location.href);

  const userIdsLinks = await searchUserIdsFunc();
  const similar_profile_links = await crawlRpsSimilarProfileSection();
  const currentUrl = window.location.href;
  const splitUrl = currentUrl.split("/");

  let source =
    mainPathType === "rps" &&
    subPathType === "rps_search_profile" &&
    splitUrl[5] == "profile"
      ? "https://www.linkedin.com/in/" + splitUrl[6].split("?")[0]
      : mainPathType === "rps" && subPathType === "rps_profile"
      ? "https://www.linkedin.com/in/" + splitUrl[splitUrl.length - 1]
      : "";

  if (source.replace(/\s/g, "") !== "") {
    const parseUrl = queryString.parseUrl(currentUrl);

    if (parseUrl.query["username"]) {
      source = `https://www.linkedin.com/in/${parseUrl.query["username"]}`;
    }
  }

  return similar_profile_links.similar_profile_links.length > 0
    ? {
        urls: similar_profile_links.similar_profile_links as string[],
        source: source,
      }
    : { urls: userIdsLinks.userIdsLinks, source: source };
}

async function searchUserIdsFunc(): Promise<{
  userIdsLinks: string[];
}> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const usersContainer = await checkIfTitleExist(
      ".ember-view.profile-list",
      null,
      true,
      50
    );
    if (!usersContainer) {
      return { userIdsLinks: [] };
    }
    let userIdsLinks = Array.from(
      usersContainer.querySelectorAll("a[data-test-link-to-profile-link]")
    )
      .map(
        (el) =>
          el &&
          el.getAttribute("href") &&
          "https://www.linkedin.com/in/" +
            el.getAttribute("href").split("/")[5].split("?")[0]
      )
      .filter((item) => item !== undefined && item !== null);

    return { userIdsLinks: userIdsLinks };
  } catch (err) {
    console.error(err);
    return {
      userIdsLinks: [],
    };
  }
}

async function talentRecruiterSearchHitsApiCall(startFrom_?: number) {
  try {
    const startFrom = startFrom_ ?? 0;

    const url = window.location.href;

    if (url.includes("linkedin.com/talent/search")) {
      const urlClass = new URL(url);

      const parseQueryParams = queryString.parse(urlClass.search);
      const searchContextId =
        "searchContextId" in parseQueryParams
          ? `${parseQueryParams["searchContextId"]}`
          : null;
      const searchRequestId =
        "searchRequestId" in parseQueryParams
          ? `${parseQueryParams["searchRequestId"]}`
          : null;
      const searchHistoryId =
        "searchHistoryId" in parseQueryParams
          ? `${parseQueryParams["searchHistoryId"]}`
          : null;
      const uiOrigin =
        "uiOrigin" in parseQueryParams ? parseQueryParams["uiOrigin"] : null;

      if (
        urlClass &&
        urlClass.pathname &&
        urlClass.pathname.split("/").length > 1 &&
        searchContextId &&
        searchRequestId &&
        searchHistoryId &&
        uiOrigin
      ) {
        try {
          const sessionToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("JSESSIONID="))
            ?.split("=")[1];

          if (!sessionToken) {
            throw "No JSESSIONID";
          }

          const response = await fetch(
            `https://www.linkedin.com/talent/search/api/talentRecruiterSearchHits?decoration=${encodeURIComponent(
              linkedinSearchDecorationValueWithSkills
            )
              .replace(/,/g, "%2C")
              .replace(/\(/g, "%28")
              .replace(
                /\)/g,
                "%29"
              )}&count=${searchCount}&q=recruiterSearch&query=(capSearchSortBy:RELEVANCE,facets:List(TALENT_POOL))&requestParams=(searchContextId:${searchContextId},searchRequestId:${searchRequestId},searchHistoryId:${searchHistoryId},doFacetCounting:true,doFacetDecoration:true,uiOrigin:${uiOrigin},reset:List(),resetProfileCustomFields:List())&start=${startFrom}`,
            {
              headers: {
                accept: "application/json",
                "accept-language": "en-US,en;q=0.9",
                "csrf-token": JSON.parse(sessionToken),
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-li-lang": "en_US",
                "x-restli-protocol-version": "2.0.0",
              },
              referrer: `https://www.linkedin.com/talent/search?searchContextId=${searchContextId}&searchHistoryId=${searchHistoryId}&searchRequestId=${searchRequestId}&start=0&uiOrigin=${uiOrigin}`,
              referrerPolicy: "strict-origin-when-cross-origin",
              body: null,
              method: "GET",
              mode: "cors",
              credentials: "include",
            }
          );

          const parsedResponse = await response.json();

          if (
            "elements" in parsedResponse &&
            typeof parsedResponse["elements"] === "object" &&
            parsedResponse["elements"].length > 0
          ) {
            const { recruitingProfiles } =
              await talentRecruitingProfilesApiCall({
                searchContextId,
                searchRequestId,
                searchHistoryId,
                elementResponse: parsedResponse["elements"],
              });

            const savedProfilePayload: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE[] =
              parsedResponse["elements"]
                .map((el, index) => {
                  const item = el["linkedInMemberProfileUrnResolutionResult"]
                    ? el["linkedInMemberProfileUrnResolutionResult"]
                    : null;

                  if (!item) {
                    return null;
                  }

                  let emails: string[] = [];
                  let phoneNumbers: string[] = [];

                  if (
                    typeof recruitingProfiles === "object" &&
                    Object.keys(recruitingProfiles).length > 0 &&
                    el["recruitingProfile"]
                  ) {
                    const selectedRecruitingProfile =
                      recruitingProfiles[el["recruitingProfile"]];

                    const selectedRecruitingProfileContactInfo =
                      selectedRecruitingProfile &&
                      selectedRecruitingProfile["contactInfo"]
                        ? selectedRecruitingProfile["contactInfo"]
                        : null;

                    if (
                      selectedRecruitingProfile &&
                      selectedRecruitingProfileContactInfo
                    ) {
                      const emailsField = selectedRecruitingProfileContactInfo[
                        "emails"
                      ]
                        ? selectedRecruitingProfileContactInfo["emails"]
                        : null;
                      const phoneNumbersField =
                        selectedRecruitingProfileContactInfo["phones"]
                          ? selectedRecruitingProfileContactInfo["phones"]
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
                          if (
                            numbObj["number"] &&
                            typeof numbObj["number"] === "string"
                          ) {
                            phoneNumbers.push(numbObj["number"]);
                          }
                        });
                      }
                    }
                  }

                  if (
                    item["contactInfo"] &&
                    item["contactInfo"]["primaryEmail"] &&
                    typeof item["contactInfo"]["primaryEmail"] === "string" &&
                    Yup.string()
                      .email()
                      .isValidSync(item["contactInfo"]["primaryEmail"])
                  ) {
                    emails = _.uniq([
                      ...emails,
                      item["contactInfo"]["primaryEmail"],
                    ]);
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
                                we["companyResolutionResult"]["industries"]
                                  .length > 0
                                  ? we["companyResolutionResult"][
                                      "industries"
                                    ][0]
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
                        item["currentPositions"] &&
                        item["currentPositions"].length > 0
                          ? item["currentPositions"]
                          : [],
                      memberPreferences: {
                        openToNewOpportunities:
                          item["memberPreferences"] &&
                          item["memberPreferences"]["openToNewOpportunities"]
                            ? item["memberPreferences"][
                                "openToNewOpportunities"
                              ]
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
                                      typeof skill[
                                        "skillAssessmentVerified"
                                      ] === "boolean"
                                        ? skill["skillAssessmentVerified"]
                                        : false,
                                  }
                                : (null as SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_SKILLS_INTERFACE);
                            })
                            .filter(
                              (item) => item.skillName !== null && item !== null
                            )
                        : [],
                      educations: item["educations"]
                        ? item["educations"]
                            .map((edu) => {
                              return {
                                degreeName: edu["degreeName"] ?? null,
                                schoolName: edu["schoolName"] ?? null,
                                startDateOn: {
                                  month:
                                    edu["startDateOn"] &&
                                    edu["startDateOn"]["month"]
                                      ? edu["startDateOn"]["month"]
                                      : null,
                                  year:
                                    edu["startDateOn"] &&
                                    edu["startDateOn"]["year"]
                                      ? edu["startDateOn"]["year"]
                                      : null,
                                },
                                endDateOn: {
                                  month:
                                    edu["endDateOn"] &&
                                    edu["endDateOn"]["month"]
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
                  } as SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE;
                })
                .filter(
                  (item) =>
                    item !== null &&
                    (item["linkedInMemberProfileUrnResolutionResult"][
                      "firstName"
                    ] !== null ||
                      item["linkedInMemberProfileUrnResolutionResult"][
                        "lastName"
                      ] !== null)
                );

            return {
              list: savedProfilePayload,
              paging: {
                count:
                  parsedResponse["paging"] && parsedResponse["paging"]["count"]
                    ? (parsedResponse["paging"]["count"] as number)
                    : 0,
                total:
                  parsedResponse["paging"] && parsedResponse["paging"]["total"]
                    ? (parsedResponse["paging"]["total"] as number)
                    : 0,
              },
            };
          }

          return {
            list: [],
            paging: {
              count:
                parsedResponse["paging"] && parsedResponse["paging"]["count"]
                  ? (parsedResponse["paging"]["count"] as number)
                  : 0,
              total:
                parsedResponse["paging"] && parsedResponse["paging"]["total"]
                  ? (parsedResponse["paging"]["total"] as number)
                  : 0,
            },
          };
        } catch (error) {
          return {
            list: [],
            paging: {
              count: 0,
              total: 0,
            },
          };
        }
      }
    }
  } catch (error) {
    return {
      list: [],
      paging: {
        count: 0,
        total: 0,
      },
    };
  }
}

interface talentRecruitingProfilesApiCallArgs {
  searchContextId: string;
  searchRequestId: string;
  searchHistoryId: string;
  elementResponse: any[];
}

async function talentRecruitingProfilesApiCall(
  args: talentRecruitingProfilesApiCallArgs
) {
  const {
    searchContextId = null,
    searchRequestId = null,
    searchHistoryId = null,
    elementResponse = [],
  } = args;

  if (
    !searchContextId ||
    !searchRequestId ||
    !searchHistoryId ||
    elementResponse.length === 0
  ) {
    throw "Not enough information";
  }

  const sessionToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("JSESSIONID="))
    ?.split("=")[1];

  if (!sessionToken) {
    throw "No JSESSIONID";
  }

  let idListQuery = "";

  elementResponse.forEach((item, index) => {
    if (item && item["recruitingProfile"]) {
      const structureIdQuery = encodeURIComponent(item["recruitingProfile"])
        .replace("(", "%28")
        .replace(")", "%29");

      idListQuery += `${structureIdQuery}${
        index === elementResponse.length - 1 ? "" : ","
      }`;
    }
  });

  try {
    const response = await fetch(
      "https://www.linkedin.com/talent/api/talentRecruitingProfiles/",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded",
          "csrf-token": JSON.parse(sessionToken),
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-http-method-override": "GET",
          "x-li-lang": "en_US",
          "x-li-pem-metadata": "Recruiter - Search=hp-recruiter-search-global",
          "x-li-search-context-id": searchContextId,
          "x-li-search-history-id": searchHistoryId,
          "x-li-search-request-id": searchRequestId,
          "x-restli-protocol-version": "2.0.0",
          cookie: document.cookie,
        },
        body: `ids=List(${idListQuery})&altkey=urn&decoration=%28atsDataProviders*~%2CcandidateFeedbacks*%28entityUrn%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28name%29%29%2Crequestee~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2Cfeedback%2Cstatus%2CwouldRecommend%2ClastModified%29%2CcandidateFeedbacksV2*%28active%2CcandidateUrn%2CentityUrn%2Cfeedback%28relationship%2Cnote%2CreasonsToNotRecommendCandidate%2CskillFit%2CreviewNoteSelectedValue%2CwouldRecommend%29%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28name%29%29%2ChiringProjectUrn%2ClastModified%2Cmessage%2Crequester%2Crequestee~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2CrequesterRole%2Cstatus%29%2CcandidateMessageThreads*%28candidate%2CentityUrn%2ClastInboxSentTime%2CinboxType%2CmessageState%2Ccreated%28time%2Cactor~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%29%2CcontactInfo%28emails%2Cphones*%2CprimaryPhone%2CprimaryEmail%2CproxyPhone~%28phoneNumber%2CexpiresAt%29%29%2CcontractsWithActivities%2ChiringContext%2Cinterviews%2CjobApplications%2CmemberInATSInfo%28dataProvider~%2CatsApplications*%28dataProvider~%2CcandidateEmail%2CatsJobPostingId%2CatsJobPostingName%2Csource%2CdispositionReason%2CatsCreatedAt%2Cnotes*%2Cstages*%2CinterviewFeedback*%29%2CatsCandidates*%28addresses*%2CatsCandidateId%2CcurrentCompanyName%2CcurrentJobTitle%2CdataProvider~%2CemailAddresses%2CexternalProfileUrl%2CfirstName%2ClastName%2CmiddleInitial%2CphoneNumbers*%2Cprefix%2Csuffix%29%2CatsCandidateNotes*%28dataProvider~%2Cnote%2Cauthor%2CatsCreatedAt%29%29%2Cnotes*%28candidate%2CchildNotes*%28candidate%2CchildNotes*%2Ccontent%2Ccreated%2CentityUrn%2ChiringContext%2ClastModified%2Cowner~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2Cproject%2CmessageModified%2Cmessage%2CparentNote%2Cvisibility%2CsourceType%29%2Ccontent%2Ccreated%2CentityUrn%2ChiringContext%2ClastModified%2Cowner~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2Cproject%2CmessageModified%2Cmessage%2CparentNote%2Cvisibility%2CsourceType%29%2CopenReviewRequests*%28entityUrn%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28name%29%29%2Creviewers*~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2ClastModified%29%2CprofileViews*%28entityUrn%2CperformedAt%2Cseat~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%2CreviewNotes*%28note%2Creviewer~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2CselectedValue%2ClastModified%29%2CscreenerQuestionAnswers*%2CassessmentCandidateQualificationResponses*%28assessmentQualificationUrn%2CrecruiterReplyDueAt%2CresponseSubmittedAt%2ClocalizedQualificationTitle%2CstepResponses*%2CsurveyResponses*%29%2CentityUrn~%28~hiringProjectCandidatesCount%28paging%29%2C~jobApplicationsCount%28paging%29%2CentityUrn%29%29`,
        method: "POST",
      }
    );

    const parsedResponse = await response.json();

    if (
      parsedResponse["results"] &&
      typeof parsedResponse["results"] === "object" &&
      Object.keys(parsedResponse["results"]).length > 0
    ) {
      return {
        recruitingProfiles: {
          ...parsedResponse["results"],
        },
      };
    }

    return {
      recruitingProfiles: {},
    };
  } catch (error) {
    return {
      recruitingProfiles: {},
    };
  }
}

const searchCount = 25;

const linkedinSearchDecorationValue =
  "(entityUrn,linkedInMemberProfileUrn~(entityUrn,referenceUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,memberPreferences(openToNewOpportunities,proxyPhoneNumberAvailability),canSendInMail,contactInfo(primaryEmail),currentPositions*(company~,companyName,title,startDateOn,endDateOn,description,location),educations*(school~(entityUrn,name),organizationUrn~,schoolName,degreeName,startDateOn,endDateOn),firstName,fullProfileNotVisible,fullProfileNotVisibleReason,headline,industryName,lastName,location(displayName),networkDistance,profileSkills*(name,skillAssessmentBadge,profileResume,endorsementCount,hasInsight),numConnections,privacySettings(allowConnectionsBrowse,showPremiumSubscriberIcon),profilePicture,publicProfileUrl,unlinked,vectorProfilePicture,workExperience*(company~(entityUrn,industries,name),companyName,title,startDateOn,endDateOn)),recruitingProfile~(entityUrn,candidate,currentHiringProjectCandidate(created,lastModified,entityUrn,hiringProject~(entityUrn),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,notes*(candidate,childNotes*(candidate,childNotes*,content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),profileUrl,prospect,tags*),hiringProjectRecruitingProfile~:hiringProjectRecruitingProfile(entityUrn,assessedCandidate(rejectable),candidate,currentHiringProjectCandidate(entityUrn,created,lastModified,addedToPipeline(time,actor~(profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),hiringProject~(entityUrn,hiringProjectMetadata(hiringPipelineEnabled,state)),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,lastActivity~(activityType,performed(time,actor~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),performedByViewer,hiringActivityData),sourcingChannel,sourcingChannelCandidates*,assessmentCandidateQualificationResponses*(assessmentQualificationUrn,recruiterReplyDueAt,responseSubmittedAt),candidateInsights(candidateHiringProjectInsightsUrn~(candidateSimilarity,entityUrn)),~hiringProjectCandidatesCount(paging)),candidateInsights(candidateSearchInsightsUrn~(positionsInsight,yearsOfExperience,entityUrn)))";

const linkedinSearchDecorationValueWithSkills =
  "(entityUrn,linkedInMemberProfileUrn~(entityUrn,referenceUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,memberPreferences(openToNewOpportunities,proxyPhoneNumberAvailability),skills*(skillAssessmentVerified,skillAssessmentVerifiedAt,skillName,skill),canSendInMail,contactInfo(primaryEmail),currentPositions*(company~,companyName,title,startDateOn,endDateOn,description,location),educations*(school~(entityUrn,name),organizationUrn~,schoolName,degreeName,startDateOn,endDateOn),firstName,fullProfileNotVisible,fullProfileNotVisibleReason,headline,industryName,lastName,location(displayName),networkDistance,profileSkills*(name,skillAssessmentBadge,profileResume,endorsementCount,hasInsight),numConnections,privacySettings(allowConnectionsBrowse,showPremiumSubscriberIcon),profilePicture,publicProfileUrl,unlinked,vectorProfilePicture,workExperience*(company~(entityUrn,industries,name),companyName,title,startDateOn,endDateOn)),recruitingProfile~(entityUrn,candidate,currentHiringProjectCandidate(created,lastModified,entityUrn,hiringProject~(entityUrn),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,notes*(candidate,childNotes*(candidate,childNotes*,content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),profileUrl,prospect,tags*),hiringProjectRecruitingProfile~:hiringProjectRecruitingProfile(entityUrn,assessedCandidate(rejectable),candidate,currentHiringProjectCandidate(entityUrn,created,lastModified,addedToPipeline(time,actor~(profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),hiringProject~(entityUrn,hiringProjectMetadata(hiringPipelineEnabled,state)),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,lastActivity~(activityType,performed(time,actor~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),performedByViewer,hiringActivityData),sourcingChannel,sourcingChannelCandidates*,assessmentCandidateQualificationResponses*(assessmentQualificationUrn,recruiterReplyDueAt,responseSubmittedAt),candidateInsights(candidateHiringProjectInsightsUrn~(candidateSimilarity,entityUrn)),~hiringProjectCandidatesCount(paging)),candidateInsights(candidateSearchInsightsUrn~(positionsInsight,yearsOfExperience,entityUrn)))";
