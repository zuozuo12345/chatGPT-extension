import { savePublicProfile } from "../../../api/scout/candidate/fetch";
import { ENV_MODE } from "../../../scripts/scout/settings";
import { CANDIDATE_DETAILS_TYPE } from "../../../typescript/types/candidate";
import { rpsRetrieveCertifications } from "./modules/certification";
import { rpsRetrieveEducations } from "./modules/education";
import {
  rpsRetrieveProfileImg,
  rpsRetrieveEmail,
  rpsRetrievePhoneNumber,
  rpsRetrieveName,
  rpsRetrieveWebsite,
  rpsRetrieveUsername,
  rpsRetrieveLocation,
  rpsRetrieveIndustry,
  rpsScrapProfileSummary,
  rpsScrapeProfileRecommendations,
  rpsScrapeProfileLanguages,
  rpsScrapeProfileProjects,
  rpsScrapeProfileAwards,
  rpsScrapeProfileVolunteer,
  rpsScrapeCoursesProfile,
  // crawlRpsPeopleAlsoViewedSection,
  crawlRpsSimilarProfileSection,
} from "./modules/profile";
import { rpsProfileBodyPayload } from "./modules/shared";
import { rpsRetrieveSkills } from "./modules/skills";
import { rpsRetrievetWorkExp } from "./modules/workExperience";
import { processSearchResults, saveResults } from "./rps_search";

export async function scrapRpsProfileinkedin(
  rps_search_profile?: boolean,
  rps_hire_profile?: boolean
) {
  try {
    const currentUrl = window.location.href;
    const splitUrl = currentUrl.split("/");

    const standard_rps_profile_view =
      currentUrl.includes("/talent/profile") && splitUrl[5] !== undefined;

    if (standard_rps_profile_view || rps_search_profile || rps_hire_profile) {
      const sessionToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("JSESSIONID="))
        ?.split("=")[1];

      if (!sessionToken) {
        throw "No JSESSIONID";
      }

      const profileUrn = !rps_search_profile
        ? rps_hire_profile
          ? splitUrl[splitUrl.length - 1].split("?")[0]
          : splitUrl[5] && splitUrl[5].split("?")[0]
          ? splitUrl[5].split("?")[0]
          : null
        : splitUrl[6] && splitUrl[6].split("?")[0]
        ? splitUrl[6].split("?")[0]
        : null;

      if (!profileUrn) {
        throw "No profile urn";
      }

      let parsedResponse = null;

      try {
        const response = await fetch(
          `https://www.linkedin.com/talent/api/talentLinkedInMemberProfiles/urn%3Ali%3Ats_linkedin_member_profile%3A(${profileUrn}%2C1%2Curn%3Ali%3Ats_hiring_project%3A0)`,
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
                "Hiring Platform - Profile=standalone-global-profile-view",
              "x-restli-protocol-version": "2.0.0",
              cookie: document.cookie,
              Referer: `https://www.linkedin.com/talent/profile/${profileUrn}`,
              "Referrer-Policy": "strict-origin-when-cross-origin",
              // To fix, where x-li-track is needed to return the profileSkills.
              // "x-li-track":
              //   '{"clientVersion":"1.3.6841","mpVersion":"1.3.6841","osName":"web","timezoneOffset":8,"timezone":"Asia/Kuala_Lumpur","mpName":"talent-solutions-web","displayDensity":1,"displayWidth":3440,"displayHeight":1440}',
            },
            body: rpsProfileBodyPayload,
            method: "POST",
          }
        );

        parsedResponse = await response.json();
      } catch (error) {}

      if (
        parsedResponse &&
        (!parsedResponse["publicProfileUrl"] ||
          (parsedResponse["networkDistance"] &&
            parsedResponse["networkDistance"] === "OUT_OF_NETWORK"))
      ) {
        parsedResponse = null;
      }

      // Get profile username
      const profileUsername = (
        await rpsRetrieveUsername(
          parsedResponse && parsedResponse["publicProfileUrl"]
            ? parsedResponse["publicProfileUrl"].split("/").pop()
            : null
        )
      ).username;
      if (!profileUsername) {
        throw "No profile username";
      }
      const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?username=${profileUsername}`;
      window.history.pushState({ path: newUrl }, "", newUrl);

      const skillsResponse =
        parsedResponse &&
        parsedResponse["profileSkills"] &&
        typeof parsedResponse["profileSkills"] === "object" &&
        parsedResponse["profileSkills"].length > 0
          ? parsedResponse["profileSkills"]
          : null;
      const workExpResponse =
        parsedResponse && parsedResponse["groupedWorkExperience"]
          ? parsedResponse["groupedWorkExperience"]
          : null;
      const eduResponse =
        parsedResponse && parsedResponse["educations"]
          ? parsedResponse["educations"]
          : null;
      const certResponse =
        parsedResponse &&
        parsedResponse["accomplishments"] &&
        parsedResponse["accomplishments"]["certifications"]
          ? parsedResponse["accomplishments"]["certifications"]
          : null;

      const promises = await Promise.all([
        rpsRetrieveEmail(
          parsedResponse &&
            parsedResponse["contactInfo"] &&
            parsedResponse["contactInfo"]["primaryEmail"]
            ? parsedResponse["contactInfo"]["primaryEmail"]
            : null
        ),
        rpsRetrievePhoneNumber(
          parsedResponse &&
            parsedResponse["contactInfo"] &&
            parsedResponse["contactInfo"]["primaryPhone"] &&
            parsedResponse["contactInfo"]["primaryPhone"]["number"]
            ? parsedResponse["contactInfo"]["primaryPhone"]["number"]
            : null
        ),
        rpsRetrieveProfileImg(
          parsedResponse && parsedResponse["vectorProfilePicture"]
            ? parsedResponse["vectorProfilePicture"]
            : null
        ),
        rpsRetrievetWorkExp(workExpResponse),
        rpsRetrieveEducations(eduResponse),
        rpsRetrieveCertifications(certResponse),
        rpsRetrieveSkills(skillsResponse, profileUrn ?? null),
        rpsRetrieveName(
          parsedResponse && parsedResponse["firstName"]
            ? parsedResponse["firstName"]
            : null,
          parsedResponse && parsedResponse["lastName"]
            ? parsedResponse["lastName"]
            : null
        ),
        rpsRetrieveWebsite(
          parsedResponse &&
            parsedResponse["websites"] &&
            typeof parsedResponse["websites"] === "object" &&
            parsedResponse["websites"].length > 0 &&
            parsedResponse["websites"][0]["url"]
            ? parsedResponse["websites"][0]["url"]
            : null
        ),
        rpsRetrieveLocation(
          parsedResponse &&
            parsedResponse["location"] &&
            parsedResponse["location"]["displayName"]
            ? parsedResponse["location"]["displayName"]
            : null
        ),
        rpsRetrieveIndustry(
          parsedResponse && parsedResponse["industryName"]
            ? parsedResponse["industryName"]
            : null
        ),
        rpsScrapProfileSummary(
          parsedResponse && parsedResponse["summary"]
            ? parsedResponse["summary"]
            : null
        ),
        rpsScrapeProfileRecommendations(
          parsedResponse && parsedResponse["recommendations"]
            ? parsedResponse["recommendations"]
            : null
        ),
        rpsScrapeProfileLanguages(
          parsedResponse &&
            parsedResponse["accomplishments"] &&
            parsedResponse["accomplishments"]["languages"]
            ? parsedResponse["accomplishments"]["languages"]
            : null
        ),
        rpsScrapeProfileProjects(
          parsedResponse &&
            parsedResponse["accomplishments"] &&
            parsedResponse["accomplishments"]["projects"]
            ? parsedResponse["accomplishments"]["projects"]
            : null
        ),
        rpsScrapeProfileAwards(
          parsedResponse &&
            parsedResponse["accomplishments"] &&
            parsedResponse["accomplishments"]["honors"]
            ? parsedResponse["accomplishments"]["honors"]
            : null
        ),
        rpsScrapeProfileVolunteer(
          parsedResponse && parsedResponse["volunteeringExperiences"]
            ? parsedResponse["volunteeringExperiences"]
            : null
        ),
        rpsScrapeCoursesProfile(
          parsedResponse &&
            parsedResponse["accomplishments"] &&
            parsedResponse["accomplishments"]["courses"]
            ? parsedResponse["accomplishments"]["courses"]
            : null
        ),
        // crawlRpsSimilarProfileSection()
        // crawlRpsPeopleAlsoViewedSection(),
      ]);

      const { urls: UrlLinks, source: Source } = await processSearchResults();

      const payload: CANDIDATE_DETAILS_TYPE = {
        username: profileUsername,
        profile: {
          name: promises[7].name,
          profile_url:
            parsedResponse && parsedResponse["publicProfileUrl"]
              ? parsedResponse["publicProfileUrl"]
              : `https://sg.linkedin.com/in/${profileUsername}`,
          url: window.location.href,
          website: promises[8].website,
          phone: promises[1].phone,
          email: promises[0].email,
          twitter: null,
          title: promises[11].summary,
          display_image: promises[2].profileImg,
          location: promises[9].location,
          profile_username: profileUsername,
        },
        skills: promises[6].skills,
        skills_complete: true,
        experiences: promises[3].workExp,
        experiences_complete: true,
        educations: promises[4].educations,
        educations_complete: true,
        certifications: promises[5].certifications,
        certifications_complete: true,
        open_to_work:
          parsedResponse &&
          parsedResponse["memberPreferences"] &&
          parsedResponse["memberPreferences"]["openToNewOpportunities"]
            ? parsedResponse["memberPreferences"]["openToNewOpportunities"]
              ? "maybe"
              : "no"
            : "no",
        industry: promises[10].industry,
        platform: "linkedin",
        recommendations: promises[12].recommendations,
        languages: promises[13].languages,
        projects: promises[14].projects,
        awards: promises[15].awards,
        volunteers: promises[16].volunteers,
        courses: promises[17].courses,
        // people_also_viewed_links: promises[18].people_also_viewed_links ?? [],
      };

      const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

      if (storageResponse["scoutWebToken"]) {
        await savePublicProfile({
          access_token: storageResponse["scoutWebToken"],
          candidateData: payload,
        });

        await saveResults(storageResponse["scoutWebToken"], UrlLinks, Source);
      }
    }
  } catch (e) {
    if (ENV_MODE === "staging") {
      console.log({
        e,
      });
    }
  }
}
