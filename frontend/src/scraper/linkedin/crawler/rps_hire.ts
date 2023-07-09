import queryString from "query-string";

import { saveLinkedinRpsSearchResult } from "../../../api/scout/candidate/create";
import { SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE } from "../../../typescript/types/linkedin/searched_profile";
import { checkIfTitleExist } from "../utils";
import { constructTalentHireProfile } from "./modules/constructProfile";

export async function scrapHirePipelineLinkedinPage(
  pageVariant_?: pageVariantType
) {
  try {
    const pageVariant = pageVariant_ ?? "normal";
    const recruiterSearchPage = pageVariant === "recruiterSearchPage";
    const url = window.location.href;
    const urlClass = new URL(url);
    const parseQueryParams = queryString.parse(urlClass.search);
    const startFrom =
      "start" in parseQueryParams &&
      parseQueryParams["start"] &&
      !isNaN(parseInt(`${parseQueryParams["start"]}`))
        ? parseInt(`${parseQueryParams["start"]}`)
        : null;

    const { list } = await talentRecruiterSearchHitsApiCall(
      startFrom,
      recruiterSearchPage,
      pageVariant
    );

    const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

    if (storageResponse["scoutWebToken"] && list && list.length > 0) {
      await saveLinkedinRpsSearchResult({
        access_token: storageResponse["scoutWebToken"],
        elements: list,
      });
    }

    // let totalPage = Math.ceil(paging.total / count);

    // let candidateList: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE[] = [];

    // // Limit amount of list to fetch for now
    // if (totalPage > 2) {
    //   totalPage = 2;
    // }

    // if (totalPage > 1) {
    //   const fakeArr_ = Array.from(Array(totalPage).keys());

    //   const promises = await Promise.all(
    //     fakeArr_.map(async (item, index) => {
    //       if (index > 0) {
    //         const startFrom__ = count * index;

    //         // Introduce delay to prevent too many request
    //         await delay(2000 * (index + 1), null);

    //         const talentRecruiterSearchHitsApiCallResponse =
    //           await talentRecruiterSearchHitsApiCall(startFrom__);

    //         return talentRecruiterSearchHitsApiCallResponse.list;
    //       }

    //       return null;
    //     })
    //   );

    //   promises.forEach((list_) => {
    //     if (list_ !== null && typeof list_ === "object" && list_.length > 0) {
    //       candidateList = [...candidateList, ...list_];
    //     }
    //   });
    // }

    // if (storageResponse["scoutWebToken"] && candidateList.length > 0) {
    //   await saveLinkedinRpsSearchResult({
    //     access_token: storageResponse["scoutWebToken"],
    //     elements: candidateList,
    //   });
    // }
  } catch (error) {}
}

type pageVariantType = "normal" | "recruiterSearchPage";
const count = 25;

async function talentRecruiterSearchHitsApiCall(
  startFrom_?: number,
  getRequest_?: boolean,
  pageVariant_?: pageVariantType
) {
  try {
    const pageVariant = pageVariant_ ?? "normal";
    const startFrom = startFrom_ ?? 0;
    const getRequest = getRequest_ ?? false;

    const sessionToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("JSESSIONID="))
      ?.split("=")[1];

    const payloadBody = await rps_search_body_full(startFrom, pageVariant);

    if (!sessionToken || !payloadBody) {
      throw "No JSESSIONID or invalid body";
    }

    let parsedResponse = null;

    if (!getRequest) {
      const response = await fetch(
        "https://www.linkedin.com/talent/search/api/talentRecruiterSearchHits",
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
            "x-li-pem-metadata":
              "Hiring Platform - Pipeline=pipeline-profile-list",
            "x-restli-protocol-version": "2.0.0",
            cookie: document.cookie,
          },
          body: payloadBody,
          method: "POST",
        }
      );
      parsedResponse = await response.json();
    } else {
      const response = await fetch(
        `https://www.linkedin.com/talent/search/api/talentRecruiterSearchHits?${payloadBody}`,
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
            "x-li-pem-metadata":
              "Hiring Platform - Pipeline=pipeline-profile-list",
            "x-restli-protocol-version": "2.0.0",
            cookie: document.cookie,
          },
          body: null,
          method: "GET",
        }
      );
      parsedResponse = await response.json();
    }

    if (
      "elements" in parsedResponse &&
      typeof parsedResponse["elements"] === "object" &&
      parsedResponse["elements"].length > 0
    ) {
      const savedProfilePayload: SAVED_LINKEDIN_SEARCH_ELEMENT_CANDIDATE_INTERFACE[] =
        parsedResponse["elements"]
          .map((el, index) => {
            return constructTalentHireProfile({ el });
          })
          .filter(
            (item) =>
              item !== null &&
              (item["linkedInMemberProfileUrnResolutionResult"]["firstName"] !==
                null ||
                item["linkedInMemberProfileUrnResolutionResult"]["lastName"] !==
                  null)
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

const rps_search_body_full = async (
  startFrom: number,
  pageVariant_?: pageVariantType
) => {
  try {
    const pageVariant = pageVariant_ ?? "normal";
    const url = window.location.href;
    const urlClass = new URL(url);
    const parseQueryParams = queryString.parse(urlClass.search);
    const splitUrl = url.split("/");
    const lastPathInSplit = splitUrl[splitUrl.length - 1].split("?")[0];

    const projectId = splitUrl.length > 0 && splitUrl[5] ? splitUrl[5] : null;
    const titleEl = await checkIfTitleExist(
      ".project-lockup-title__item[data-test-project-lockup-title='']"
    );

    if (!projectId || !titleEl) {
      return null;
    }

    const getAllCodeTag = document.querySelectorAll<HTMLElement>("code");

    let contractVal = null;
    let sourcingChannels: string[] = [];

    for (let codeEl of Array.from(getAllCodeTag)) {
      const txtContent = codeEl.textContent.trim();

      try {
        const parseTxtContent = JSON.parse(txtContent);

        if (parseTxtContent) {
          if (parseTxtContent["contract"]) {
            contractVal = parseTxtContent["contract"].split(":").pop();
          }

          if (
            parseTxtContent["sourcingChannels"] &&
            typeof parseTxtContent["sourcingChannels"] === "object" &&
            parseTxtContent["sourcingChannels"].length > 0 &&
            typeof parseTxtContent["sourcingChannels"][0] === "string"
          ) {
            sourcingChannels = [...parseTxtContent["sourcingChannels"]];
          }

          if (contractVal && sourcingChannels.length > 0) {
            break;
          }
        }
      } catch (err) {}
    }

    let additionalQuery = null;

    if (
      lastPathInSplit &&
      lastPathInSplit !== "all" &&
      contractVal &&
      !isNaN(parseInt(lastPathInSplit))
    ) {
      additionalQuery = `(type:CANDIDATE_HIRING_STATE,valuesWithSelections:List((value:urn%3Ali%3Ats_hiring_state%3A%28urn%3Ali%3Ats_contract%3A${contractVal}%2C${lastPathInSplit}%29,selected:true,negated:false,required:false)))),`;
    }

    const title = titleEl.textContent.trim();

    let requestParams = `(hiringProject:urn%3Ali%3Ats_hiring_project%3A%28urn%3Ali%3Ats_contract%3A`;

    if (
      parseQueryParams &&
      "searchContextId" in parseQueryParams &&
      "searchHistoryId" in parseQueryParams &&
      "searchRequestId" in parseQueryParams &&
      sourcingChannels.length > 0
    ) {
      const selectedSourcingChannel = sourcingChannels[0];
      let sourchingChannelId: number = null;
      const splitSelectedSourcingChannel = selectedSourcingChannel.split("(");

      if (
        splitSelectedSourcingChannel.length > 0 &&
        splitSelectedSourcingChannel[1]
      ) {
        const processSc = splitSelectedSourcingChannel[1].split(",");

        if (processSc.length > 0 && processSc[1]) {
          let cleanupSc_ = processSc[1].replace(")", "");

          if (
            cleanupSc_.replace(/\s/g, "") !== "" &&
            !isNaN(parseInt(cleanupSc_))
          ) {
            sourchingChannelId = parseInt(cleanupSc_);
          }
        }
      }

      if (sourchingChannelId) {
        requestParams = `(searchContextId:${parseQueryParams["searchContextId"]},searchRequestId:${parseQueryParams["searchRequestId"]},searchHistoryId:${parseQueryParams["searchHistoryId"]},doFacetCounting:true,doFacetDecoration:true,hiringProjectId:${projectId},reset:List(),resetProfileCustomFields:List(),sourcingChannel:urn%3Ali%3Ats_sourcing_channel%3A%28urn%3Ali%3Ats_contract%3A${contractVal}%2C${sourchingChannelId}%29,hiringProject:urn%3Ali%3Ats_hiring_project%3A%28urn%3Ali%3Ats_contract%3A`;
      }
    }

    let queryBody = `(facetSelections:List((type:SOURCING_CHANNEL,valuesWithSelections:List())${
      additionalQuery ? "" : ")"
    },${
      additionalQuery ? additionalQuery : ""
    }capSearchSortBy:HIRING_CANDIDATE_LAST_UPDATED_DATE,hiringProjects:List((text:${encodeURIComponent(
      title
    )},entity:urn%3Ali%3Ats_hiring_project%3A%28urn%3Ali%3Ats_contract%3A${
      contractVal ? contractVal : "216666981"
    }%2C${projectId}%29)))`;

    if (pageVariant === "recruiterSearchPage") {
      queryBody = `(capSearchSortBy:RELEVANCE,project:urn%3Ali%3Ats_hiring_project%3A%28urn%3Ali%3Ats_contract%3A${
        contractVal ? contractVal : "216666981"
      }%2C${projectId}%29,facets:List(TALENT_POOL))`;
    }

    const q_ =
      pageVariant === "recruiterSearchPage"
        ? "recruiterSearch"
        : "pipelineSearch";

    return `decoration=%28entityUrn%2ClinkedInMemberProfileUrn~%28entityUrn%2Canonymized%2CreferenceUrn%2CmemberPreferences%28companySizeRange%28minSize%2CmaxSize%29%2CemploymentTypes%2CinterestedCandidateIntroductionStatement%2Clocations%2CjobSeekingUrgencyLevel%2CgeoLocations*~%28standardGeoStyleName%29%2CopenToNewOpportunities%2Ctitles%2CproxyPhoneNumberAvailability%29%2CfirstName%2ClastName%2Cheadline%2Clocation%28displayName%29%2CprofilePicture%2CvectorProfilePicture%2CnumConnections%2Chighlights%2CnetworkDistance%2Cskills*%28skillAssessmentVerified%2CskillAssessmentVerifiedAt%2CskillName%2Cskill%29%2CcanSendInMail%2Cunlinked%2Ceducations*%28school~%28entityUrn%2Cname%29%2CorganizationUrn~%28entityUrn%2Cname%29%2CschoolName%2CdegreeName%2CstartDateOn%2CendDateOn%29%2CworkExperience*%28company~%28entityUrn%2Cname%29%2CcompanyName%2Ctitle%2CstartDateOn%2CendDateOn%29%2CprivacySettings%28allowConnectionsBrowse%2CshowPremiumSubscriberIcon%29%2CviewerCompanyFollowing%28followingViewerCompany%2CstartedAt%29%2CcontactInfo%2CindustryName%2CpublicProfileUrl%29%2ChiringProjectRecruitingProfile~%28entityUrn%2Ctags*%2ChiringContext%2Ccandidate%2ChiddenCandidate%2CcurrentHiringProjectCandidate%28entityUrn%2Ccreated%28time%29%2CaddedToPipeline%28time%2Cactor~%28profile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%2ClastModified%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28hiringPipelineEnabled%2Cstate%29%29%2CcandidateHiringState%2CsourcingChannel~%28entityUrn%2CchannelType%29%2CsourcingChannelType%29%2CstartFollowingCompanyAt%2ClastActivity~%28activityType%2Cperformed%28time%2Cactor~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2CperformedByViewer%2ChiringActivityData%29%2CcandidateMessageThreads*%28candidate%2CentityUrn%2ClastInboxSentTime%2CinboxType%2CmessageState%2Ccreated%28time%2Cactor~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%29%29%2CreviewNotes*%2CopenReviewRequests*%28entityUrn%2Cowner%2Cjob%2CcapProject%2ChiringProject%2Ccandidates%2Creviewers*~%28entityUrn%2Cstate%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2CseatEntitlements%2CseatRoles%2Ccontract%2Cdescription%2CpenaltyBoxInfo%2CentitlementsWithMetadata*%2CproductRestrictions*%29%2ChiringContext%2Cid%2Ccreated%2ClastModified%2Cdeleted%29%2CsourcingChannelCandidates*%28applyStarterInfo%2Ccandidate%2Ccreated%2CentityUrn%2ChiringContext%2ClastModified%2CsourcingChannel%2CjobApplicationInfo%28contactEmail%2CcontactPhoneNumber%2Cfeatured%2CjobApplication~%2Csource%29%2CjobPostingRelevanceReasons*%29%2CsourcingChannel%2Cnotes*%28candidate%2CchildNotes*%28candidate%2CchildNotes*%2Ccontent%2Ccreated%2CentityUrn%2ChiringContext%2ClastModified%2Cowner~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2Cproject%2CmessageModified%2Cmessage%2CparentNote%2Cvisibility%2CsourceType%29%2Ccontent%2Ccreated%2CentityUrn%2ChiringContext%2ClastModified%2Cowner~%28entityUrn%2Cprofile~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%29%2Cproject%2CmessageModified%2Cmessage%2CparentNote%2Cvisibility%2CsourceType%29%2CresumeHiringDocumentsV2s*%2CcompanyRelevanceReasons*%2CcontactInfo%2CmessageUrl%2CcandidateFeedbacks*%28entityUrn%2Ccontract%2Ccompany%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28name%29%29%2CjobTitle%2CjobPosting~%28title%29%2Crequester%2CrequesterRole%2Crequestee~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2Ccandidate%2Cfeedback%28relationship%2Cnote%2CreasonsToNotRecommendCandidate%2CskillFit%29%2Cmessage%2Cstatus%2CwouldRecommend%2Cactive%2ClastModified%2ClastRequestedTimeAt%29%2CcandidateFeedbacksV2*%28active%2CcandidateUrn%2CentityUrn%2Cfeedback%28relationship%2Cnote%2CreasonsToNotRecommendCandidate%2CskillFit%2CreviewNoteSelectedValue%2CwouldRecommend%29%2ChiringProject~%28entityUrn%2ChiringProjectMetadata%28name%29%29%2ChiringProjectUrn%2ClastModified%2Cmessage%2Crequester%2Crequestee~%28entityUrn%2CfirstName%2ClastName%2Cheadline%2CprofilePicture%2CvectorProfilePicture%2CpublicProfileUrl%2CfollowerCount%2CnetworkDistance%2CautomatedActionProfile%29%2CrequesterRole%2Cstatus%29%2CreferralUrns*~%28created%28time%29%2Cfeedback%2CjobPostingUrn~%28hiringProjectUrn~%28entityUrn%29%29%2CprimaryReferral%2CreferrerUrn~%28firstName%2Cheadline%2ClastName%2CvectorProfilePicture%2CpublicProfileUrl%2CprofileUrn~%28firstName%2Cheadline%2ClastName%2CvectorProfilePicture%29%29%29%2CscreenerQuestionAnswers*%2CprofileUrl%2CjobApplications%2CassessedCandidate%28candidateRejectionRecord%2CfeaturedSkills*%2Crejectable%2Cexportable%2CvideoResponses*%29%2CprofileViews*%28entityUrn%2Cseat%29%2CatsDataProviders*~%2CinMailCost%2CcontractsWithActivities%2CassessmentCandidateQualificationResponses*%28assessmentQualificationUrn~%28entityUrn%2CroleUrn~%28localizedTitle%29%29%2CrecruiterReplyDueAt%2CresponseSubmittedAt%2ClocalizedQualificationTitle%2CstepResponses*%2CsurveyResponses*%29%2CcandidateInsights%28candidateRecommendedMatchesInsightsUrn~%28positionsInsight%2CentityUrn%29%29%2C~hiringProjectCandidatesCount%28paging%29%2C~jobApplicationsCount%28paging%29%2C~hireThirdPartyAssessmentCount%28paging%29%29%29&count=${count}&q=${q_}&query=${queryBody}&requestParams=${requestParams}${
      contractVal ? contractVal : "216666981"
    }%2C${projectId}%29,doFacetCounting:true,doFacetDecoration:true)&start=${startFrom}`;
  } catch (error) {
    return null;
  }
};
