// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
// import { Buffer } from "buffer";
// import { nanoid } from "nanoid";
// import queryString from "query-string";

// export async function getLinkedinCookie(tab: chrome.tabs.Tab) {
//   if (tab.status === "complete" && tab.active) {
//     if (
//       tab.url.includes("linkedin.com/in") ||
//       tab.url.includes("linkedin.com/talent")
//     ) {
//       const tabUrl = tab.url;

//       const urlClass = new URL(tabUrl);

//       if (
//         urlClass &&
//         urlClass.pathname &&
//         urlClass.pathname.split("/").length > 1
//       ) {
//         // const getAllLinkedinCookies = await chrome.cookies.getAll({
//         //   url: "https://www.linkedin.com/",
//         // });

//         try {
//           const promises = await Promise.all([
//             chrome.cookies.get({
//               name: "G_ENABLED_IDPS",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "li_at",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "liap",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "bcookie",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "bscookie",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "JSESSIONID",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "timezone",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "li_theme",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "li_theme_set",
//               url: "https://www.linkedin.com/",
//             }),
//             chrome.cookies.get({
//               name: "lidc",
//               url: "https://www.linkedin.com/",
//             }),
//           ]);

//           const sessionToken =
//             promises[5] &&
//             promises[5].value &&
//             promises[5].value.replace(/\s/g, "") !== ""
//               ? JSON.parse(promises[5].value)
//               : null;

//           let headerCookie = "";

//           promises.forEach((item) => {
//             if (item !== null) {
//               headerCookie += `${item.name}=${item.value};`;
//             }
//           });

//           const headersObj = {
//             Accept: "application/json",
//             "Content-Type": "application/json; charset=UTF-8",
//             "Set-Cookie": headerCookie,
//             "csrf-token": sessionToken,
//           };

//           // Get username
//           let username = null;
//           if (tabUrl.includes("linkedin.com/in")) {
//             const urlClass = new URL(tabUrl);
//             username = urlClass.pathname.split("/")[2];
//           }

//           setTimeout(async () => {
//             // Get recipient urn
//             const getRecipientUrnResponse = await fetch(
//               `https://www.linkedin.com/voyager/api/voyagerIdentityDashProfiles?decorationId=com.linkedin.voyager.dash.deco.identity.profile.ProfileWithTopCardLiveVideo-11&memberIdentity=${username}&q=memberIdentity`,
//               {
//                 method: "get",
//                 mode: "cors",
//                 cache: "no-cache",
//                 credentials: "same-origin",
//                 headers: headersObj,
//               }
//             );
//             const parseGetRecipientUrnResponse =
//               await getRecipientUrnResponse.json();
//             const recipientUrn =
//               parseGetRecipientUrnResponse &&
//               parseGetRecipientUrnResponse["elements"] &&
//               parseGetRecipientUrnResponse["elements"].length > 0 &&
//               parseGetRecipientUrnResponse["elements"][0]["entityUrn"]
//                 ? parseGetRecipientUrnResponse["elements"][0][
//                     "entityUrn"
//                   ].split(":")[3]
//                 : null;

//             // Retrieve scout user info
//             const getScoutUserInfoResponse = await fetch(
//               `https://www.linkedin.com/voyager/api/me`,
//               {
//                 method: "get",
//                 mode: "cors",
//                 cache: "no-cache",
//                 credentials: "same-origin",
//                 headers: headersObj,
//               }
//             );
//             const parsedGetScoutUserInfoResponse =
//               await getScoutUserInfoResponse.json();
//             const userProfileUrn =
//               parsedGetScoutUserInfoResponse &&
//               parsedGetScoutUserInfoResponse &&
//               parsedGetScoutUserInfoResponse["miniProfile"] &&
//               parsedGetScoutUserInfoResponse["miniProfile"]["dashEntityUrn"]
//                 ? parsedGetScoutUserInfoResponse["miniProfile"][
//                     "dashEntityUrn"
//                   ].split(":")[3]
//                 : null;

//             // Retrieve conversation urn
//             const getConversationUrnResponse = await fetch(
//               `https://www.linkedin.com/voyager/api/voyagerMessagingGraphQL/graphql?queryId=messengerConversations.3427a145711e971cd516321643246655&variables=(mailboxUrn:urn${encodeURIComponent(
//                 `:li:fsd_profile:${userProfileUrn}`
//               )},recipients:List(${encodeURIComponent(
//                 `urn:li:fsd_profile:${recipientUrn}`
//               )}))`,
//               {
//                 method: "get",
//                 mode: "cors",
//                 cache: "no-cache",
//                 credentials: "same-origin",
//                 headers: headersObj,
//               }
//             );
//             const parsedGetConversationUrnResponse =
//               await getConversationUrnResponse.json();
//             const conversationUrn =
//               parsedGetConversationUrnResponse &&
//               parsedGetConversationUrnResponse["data"] &&
//               parsedGetConversationUrnResponse["data"][
//                 "messengerConversationsByRecipients"
//               ] &&
//               parsedGetConversationUrnResponse["data"][
//                 "messengerConversationsByRecipients"
//               ]["elements"] &&
//               parsedGetConversationUrnResponse["data"][
//                 "messengerConversationsByRecipients"
//               ]["elements"].length > 0 &&
//               parsedGetConversationUrnResponse["data"][
//                 "messengerConversationsByRecipients"
//               ]["elements"][0] &&
//               parsedGetConversationUrnResponse["data"][
//                 "messengerConversationsByRecipients"
//               ]["elements"][0]["entityUrn"]
//                 ? parsedGetConversationUrnResponse["data"][
//                     "messengerConversationsByRecipients"
//                   ]["elements"][0]["entityUrn"]
//                 : null;

//             let payload = null;
//             // Message payload v2

//             if (conversationUrn) {
//               // If it has existing conversation
//               payload = {
//                 message: {
//                   body: {
//                     text: "helloo test test",
//                     attributes: [],
//                   },
//                   renderContentUnions: [],
//                   conversationUrn: conversationUrn,
//                   originToken: uuidv4(),
//                 },
//                 mailboxUrn: `urn:li:fsd_profile:${userProfileUrn}`,
//                 trackingId: generate_trackingId_as_charString(),
//                 dedupeByClientGeneratedToken: false,
//               };
//             } else {
//               // New conversation
//               payload = {
//                 message: {
//                   body: {
//                     text: "Hi, test",
//                     attributes: [],
//                   },
//                   originToken: uuidv4(),
//                   renderContentUnions: [],
//                 },
//                 mailboxUrn: `urn:li:fsd_profile:${userProfileUrn}`,
//                 trackingId: generate_trackingId_as_charString(),
//                 dedupeByClientGeneratedToken: false,
//                 hostRecipientUrns: [`urn:li:fsd_profile:${recipientUrn}`],
//               };
//             }

//             ("https://www.linkedin.com/voyager/api/voyagerMessagingDashMessengerMessages?action=createMessage");

//             // Post message v2
//             try {
//               await fetch(
//                 "https://www.linkedin.com/voyager/api/voyagerMessagingDashMessengerMessages?action=createMessage",
//                 {
//                   method: "post",
//                   mode: "cors",
//                   cache: "no-cache",
//                   credentials: "same-origin",
//                   headers: headersObj,
//                   body: JSON.stringify(payload),
//                   redirect: "follow",
//                   referrerPolicy: "no-referrer",
//                 }
//               );
//             } catch (error) {
//               // InMail
//               // payload = {
//               //   message: {
//               //     body: {
//               //       text: "test body",
//               //       attributes: [],
//               //     },
//               //     subject: "test header",
//               //     originToken: uuidv4(),
//               //     renderContentUnions: [],
//               //   },
//               //   mailboxUrn: `urn:li:fsd_profile:${userProfileUrn}`,
//               //   trackingId: generate_trackingId_as_charString(),
//               //   dedupeByClientGeneratedToken: false,
//               //   hostRecipientUrns: [`urn:li:fsd_profile:${recipientUrn}`],
//               //   hostMessageCreateContent: {
//               //     "com.linkedin.voyager.dash.messaging.MessageCreateContent": {
//               //       messageCreateContentUnion: {
//               //         premiumInMail: {},
//               //       },
//               //     },
//               //   },
//               // };
//             }
//           }, 1500);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     }
//   }
// }

// // fetch
// export async function scrapSearchResultLinkedin(tab: chrome.tabs.Tab) {
//   try {
//     if (tab.status === "complete" && tab.active) {
//       if (tab.url.includes("linkedin.com/talent/search")) {
//         const tabUrl = tab.url;

//         const urlClass = new URL(tabUrl);

//         // https://www.linkedin.com/talent/search?searchContextId=30b3def9-af25-4744-9737-d96ff59d999b&searchHistoryId=5353475866&searchKeyword=cynthia%20kee&searchRequestId=476349df-d422-47fb-a9bd-37d5a5b876a5&start=0&uiOrigin=GLOBAL_SEARCH_HEADER

//         const parseQueryParams = queryString.parse(urlClass.search);
//         const searchContextId =
//           "searchContextId" in parseQueryParams
//             ? parseQueryParams["searchContextId"]
//             : null;
//         const searchRequestId =
//           "searchRequestId" in parseQueryParams
//             ? parseQueryParams["searchRequestId"]
//             : null;
//         const searchHistoryId =
//           "searchHistoryId" in parseQueryParams
//             ? parseQueryParams["searchHistoryId"]
//             : null;
//         const uiOrigin =
//           "uiOrigin" in parseQueryParams ? parseQueryParams["uiOrigin"] : null;

//         if (
//           urlClass &&
//           urlClass.pathname &&
//           urlClass.pathname.split("/").length > 1 &&
//           searchContextId &&
//           searchRequestId &&
//           searchHistoryId &&
//           uiOrigin
//         ) {
//           try {
//             const { headerCookies } = await retrieveLinkedinCookieValues();

//             const searchCount = 35;

//             const response = await fetch(
//               `https://www.linkedin.com/talent/search/api/talentRecruiterSearchHits?decoration=${encodeURIComponent(
//                 linkedinSearchDecorationValue
//               )
//                 .replace(/,/g, "%2C")
//                 .replace(/\(/g, "%28")
//                 .replace(
//                   /\)/g,
//                   "%29"
//                 )}&count=${searchCount}&q=recruiterSearch&query=(capSearchSortBy:RELEVANCE,facets:List(TALENT_POOL))&requestParams=(searchContextId:${searchContextId},searchRequestId:${searchRequestId},searchHistoryId:${searchHistoryId},doFacetCounting:true,doFacetDecoration:true,uiOrigin:${uiOrigin},reset:List(),resetProfileCustomFields:List())&start=0`,
//               {
//                 headers: {
//                   accept: "application/json",
//                   "accept-language": "en-US,en;q=0.9",
//                   "csrf-token": headerCookies.JSESSIONID,
//                   "sec-ch-ua":
//                     '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
//                   "sec-ch-ua-mobile": "?0",
//                   "sec-ch-ua-platform": '"Windows"',
//                   "sec-fetch-dest": "empty",
//                   "sec-fetch-mode": "cors",
//                   "sec-fetch-site": "same-origin",
//                   "x-li-lang": "en_US",
//                   "x-restli-protocol-version": "2.0.0",
//                 },
//                 referrer: `https://www.linkedin.com/talent/search?searchContextId=${searchContextId}&searchHistoryId=${searchHistoryId}&searchRequestId=${searchRequestId}&start=0&uiOrigin=${uiOrigin}`,
//                 referrerPolicy: "strict-origin-when-cross-origin",
//                 body: null,
//                 method: "GET",
//                 mode: "cors",
//                 credentials: "include",
//               }
//             );

//             const parsedResponse = await response.json();

//             if (
//               "elements" in parsedResponse &&
//               typeof parsedResponse["elements"] === "object" &&
//               parsedResponse["elements"].length > 0
//             ) {
//               console.log({
//                 elements: parsedResponse["elements"],
//                 parsedResponse,
//               });
//             }
//           } catch (error) {
//             console.log(error);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.log({ error });
//   }
// }

// async function retrieveLinkedinCookieValues() {
//   try {
//     const promises = await Promise.all([
//       chrome.cookies.get({
//         name: "G_ENABLED_IDPS",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "li_at",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "liap",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "bcookie",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "bscookie",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "JSESSIONID",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "timezone",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "li_theme",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "li_theme_set",
//         url: "https://www.linkedin.com/",
//       }),
//       chrome.cookies.get({
//         name: "lidc",
//         url: "https://www.linkedin.com/",
//       }),
//     ]);

//     let headerCookie = "";

//     promises.forEach((item) => {
//       if (item !== null) {
//         headerCookie += `${item.name}=${item.value};`;
//       }
//     });

//     return {
//       headerCookies: {
//         G_ENABLED_IDPS:
//           promises[0] &&
//           promises[0].value &&
//           promises[0].value.replace(/\s/g, "") !== ""
//             ? (promises[0].value as string)
//             : null,
//         li_at:
//           promises[1] &&
//           promises[1].value &&
//           promises[1].value.replace(/\s/g, "") !== ""
//             ? (promises[1].value as string)
//             : null,
//         liap:
//           promises[2] &&
//           promises[2].value &&
//           promises[2].value.replace(/\s/g, "") !== ""
//             ? (promises[2].value as string)
//             : null,
//         bcookie:
//           promises[3] &&
//           promises[3].value &&
//           promises[3].value.replace(/\s/g, "") !== ""
//             ? (JSON.parse(promises[3].value) as string)
//             : null,
//         bscookie:
//           promises[4] &&
//           promises[4].value &&
//           promises[4].value.replace(/\s/g, "") !== ""
//             ? (JSON.parse(promises[4].value) as string)
//             : null,
//         JSESSIONID:
//           promises[5] &&
//           promises[5].value &&
//           promises[5].value.replace(/\s/g, "") !== ""
//             ? (JSON.parse(promises[5].value) as string)
//             : null,
//         timezone:
//           promises[6] &&
//           promises[6].value &&
//           promises[6].value.replace(/\s/g, "") !== ""
//             ? (promises[6].value as string)
//             : null,
//         li_theme:
//           promises[7] &&
//           promises[7].value &&
//           promises[7].value.replace(/\s/g, "") !== ""
//             ? (promises[7].value as string)
//             : null,
//         li_theme_set:
//           promises[8] &&
//           promises[8].value &&
//           promises[8].value.replace(/\s/g, "") !== ""
//             ? (promises[8].value as string)
//             : null,
//         lidc:
//           promises[9] &&
//           promises[9].value &&
//           promises[9].value.replace(/\s/g, "") !== ""
//             ? (JSON.parse(promises[9].value) as string)
//             : null,
//       },
//       headerCookiesStringify: headerCookie,
//     };
//   } catch (error) {
//     return {
//       headerCookies: {
//         G_ENABLED_IDPS: null,
//         li_at: null,
//         liap: null,
//         bcookie: null,
//         bscookie: null,
//         JSESSIONID: null,
//         timezone: null,
//         li_theme: null,
//         li_theme_set: null,
//         lidc: null,
//       },
//       headerCookiesStringify: null,
//     };
//   }
// }

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// function generate_trackingId_as_charString() {
//   const random_int_array = [...Array(16)].map((item) => {
//     return getRandomInt(256);
//   });

//   const rand_byte_array = Buffer.from(random_int_array);

//   return rand_byte_array.toString("base64").slice(0, 16);
// }

// const linkedinSearchDecorationValue =
//   "(entityUrn,linkedInMemberProfileUrn~(entityUrn,referenceUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,memberPreferences(openToNewOpportunities,proxyPhoneNumberAvailability),canSendInMail,contactInfo(primaryEmail),currentPositions*(company~,companyName,title,startDateOn,endDateOn,description,location),educations*(school~(entityUrn,name),organizationUrn~,schoolName,degreeName,startDateOn,endDateOn),firstName,fullProfileNotVisible,fullProfileNotVisibleReason,headline,industryName,lastName,location(displayName),networkDistance,profileSkills*(name,skillAssessmentBadge,profileResume,endorsementCount,hasInsight),numConnections,privacySettings(allowConnectionsBrowse,showPremiumSubscriberIcon),profilePicture,publicProfileUrl,unlinked,vectorProfilePicture,workExperience*(company~(entityUrn,industries,name),companyName,title,startDateOn,endDateOn)),recruitingProfile~(entityUrn,candidate,currentHiringProjectCandidate(created,lastModified,entityUrn,hiringProject~(entityUrn),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,notes*(candidate,childNotes*(candidate,childNotes*,content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),content,created,entityUrn,hiringContext,lastModified,owner~(entityUrn,profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),project,messageModified,message,parentNote,visibility,sourceType),profileUrl,prospect,tags*),hiringProjectRecruitingProfile~:hiringProjectRecruitingProfile(entityUrn,assessedCandidate(rejectable),candidate,currentHiringProjectCandidate(entityUrn,created,lastModified,addedToPipeline(time,actor~(profile~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),hiringProject~(entityUrn,hiringProjectMetadata(hiringPipelineEnabled,state)),candidateHiringState~,sourcingChannel~(entityUrn,channelType)),hiddenCandidate,hiringContext,lastActivity~(activityType,performed(time,actor~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile)),performedByViewer,hiringActivityData),sourcingChannel,sourcingChannelCandidates*,assessmentCandidateQualificationResponses*(assessmentQualificationUrn,recruiterReplyDueAt,responseSubmittedAt),candidateInsights(candidateHiringProjectInsightsUrn~(candidateSimilarity,entityUrn)),~hiringProjectCandidatesCount(paging)),candidateInsights(candidateSearchInsightsUrn~(positionsInsight,yearsOfExperience,entityUrn)))";

export {};
