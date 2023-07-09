import axios from "axios";
import _ from "lodash";

import { CANDIDATE_DETAILS_TYPE } from "../../../typescript/types/candidate";
import { publicProfileContactInfoCrawler } from "./modules/public_profile/contactInfo";
import { publicProfileSkillsCrawler } from "./modules/public_profile/skills";
import { publicProfileWorkExperienceCrawler } from "./modules/public_profile/workExperience";

export default async function linkedinUserProfileThruApi() {
  try {
    const currentUrl = window.location.href;

    let username = currentUrl.split("/in/")[1];

    if (username.includes("/")) {
      username = username.split("/")[0];
    }

    const sessionToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("JSESSIONID="))
      ?.split("=")[1];

    const headersObj = {
      accept: "application/vnd.linkedin.normalized+json+2.1",
      "accept-language": "en-US,en;q=0.9",
      "csrf-token": JSON.parse(sessionToken),
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      cookie: document.cookie,
      Referer: "https://www.linkedin.com/in/nibs/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    // get candidate urn
    const getCandidateUrnResponse = await fetch(
      `https://www.linkedin.com/voyager/api/voyagerIdentityDashProfiles?decorationId=com.linkedin.voyager.dash.deco.identity.profile.ProfileWithTopCardLiveVideo-11&memberIdentity=${username}&q=memberIdentity`,
      {
        method: "get",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: headersObj,
      }
    );
    const parseGetCandidateUrnResponse = await getCandidateUrnResponse.json();
    const candidatetUrn =
      parseGetCandidateUrnResponse["data"] &&
      parseGetCandidateUrnResponse["data"]["*elements"] &&
      parseGetCandidateUrnResponse["data"]["*elements"].length > 0 &&
      parseGetCandidateUrnResponse["data"]["*elements"][0]
        ? parseGetCandidateUrnResponse["data"]["*elements"][0].split(":")[3]
        : null;

    const payload: CANDIDATE_DETAILS_TYPE = {
      username: null,
      profile: {
        name: null,
        profile_url: `https://www.linkedin.com/in/${username}`,
        url: `https://www.linkedin.com/in/${username}`,
        website: null,
        phone: null,
        email: null,
        twitter: null,
        title: null,
        display_image: null,
        location: null,
        profile_username: username,
      },
      skills: [],
      skills_complete: false,
      experiences: [],
      experiences_complete: false,
      educations: [],
      educations_complete: false,
      certifications: [],
      certifications_complete: false,
      open_to_work: "maybe",
      industry: null,
      platform: "linkedin",
    };

    const promises = await Promise.all([
      axios.get(
        `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${username}&decorationId=com.linkedin.voyager.dash.deco.identity.profile.ProfileContactInfo-11`,
        {
          headers: {
            accept: "application/vnd.linkedin.normalized+json+2.1",
            "accept-language": "en-US,en;q=0.9",
            "csrf-token": JSON.parse(sessionToken),
          },
        }
      ),
      axios.get(
        `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(start:0,count:100,paginationToken:null,pagedListComponent:urn%3Ali%3Afsd_profilePagedListComponent%3A%28${candidatetUrn}%2CSKILLS_VIEW_DETAILS%2Curn%3Ali%3Afsd_profileTabSection%3AALL_SKILLS%2CNONE%2Cen_US%29)&&queryId=voyagerIdentityDashProfileComponents.23ee0f673b4a1da7d0c5f63f54f90475`,
        {
          headers: {
            accept: "application/vnd.linkedin.normalized+json+2.1",
            "accept-language": "en-US,en;q=0.9",
            "csrf-token": JSON.parse(sessionToken),
          },
        }
      ),
      axios.get(
        `https://www.linkedin.com/voyager/api/graphql?includeWebMetadata=true&variables=(start:0,count:100,paginationToken:null,pagedListComponent:urn%3Ali%3Afsd_profilePagedListComponent%3A%28${candidatetUrn}%2CEXPERIENCE_VIEW_DETAILS%2Curn%3Ali%3Afsd_profile%3A${candidatetUrn}%2CNONE%2Cen_US%29)&&queryId=voyagerIdentityDashProfileComponents.23ee0f673b4a1da7d0c5f63f54f90475`,
        {
          headers: {
            accept: "application/vnd.linkedin.normalized+json+2.1",
            "accept-language": "en-US,en;q=0.9",
            "csrf-token": JSON.parse(sessionToken),
          },
        }
      ),
    ]);

    const contactInfoPageResponse = promises[0].data;
    const skillsPageApiResponse = promises[1].data;
    const workExpApiResponse = promises[2].data;

    if (
      contactInfoPageResponse &&
      contactInfoPageResponse["included"] &&
      typeof contactInfoPageResponse["included"] === "object" &&
      contactInfoPageResponse["included"].length > 0
    ) {
      const contactInfoCrawlerResponse = publicProfileContactInfoCrawler(
        contactInfoPageResponse["included"]
      );

      payload.profile.name = contactInfoCrawlerResponse.name;
      payload.profile.email = contactInfoCrawlerResponse.email;
      payload.profile.website = contactInfoCrawlerResponse.website;
      payload.profile.twitter = contactInfoCrawlerResponse.twitter;
      payload.profile.display_image = contactInfoCrawlerResponse.display_image;
      payload.profile.phone = contactInfoCrawlerResponse.phone;
    }

    if (
      skillsPageApiResponse &&
      skillsPageApiResponse["data"] &&
      typeof skillsPageApiResponse["data"] === "object" &&
      skillsPageApiResponse["data"]["data"] &&
      skillsPageApiResponse["data"]["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ] &&
      typeof skillsPageApiResponse["data"]["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ] === "object" &&
      skillsPageApiResponse["data"]["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"] &&
      typeof skillsPageApiResponse["data"]["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"] === "object" &&
      skillsPageApiResponse["data"]["data"][
        "identityDashProfileComponentsByPagedListComponent"
      ]["elements"].length > 0
    ) {
      const skillsCrawlerResponse = publicProfileSkillsCrawler(
        skillsPageApiResponse["data"]["data"][
          "identityDashProfileComponentsByPagedListComponent"
        ]["elements"]
      );

      payload.skills = skillsCrawlerResponse.skills;
    }

    const workExpCrawlerResponse = await publicProfileWorkExperienceCrawler(
      workExpApiResponse
    );

    console.log({
      workExpCrawlerResponse,
    });

    console.log({
      payload,
      workExpApiResponse,
    });
  } catch (error) {}
}
