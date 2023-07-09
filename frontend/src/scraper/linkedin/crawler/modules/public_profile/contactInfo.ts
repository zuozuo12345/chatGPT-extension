import { CANDIDATE_DETAILS_TYPE } from "../../../../../typescript/types/candidate";
import { constructProfileImg } from "../../shared";

export function publicProfileContactInfoCrawler(included) {
  interface contactInfoCrawlerPayloadInterface {
    name: CANDIDATE_DETAILS_TYPE["profile"]["name"];
    email: CANDIDATE_DETAILS_TYPE["profile"]["email"];
    website: CANDIDATE_DETAILS_TYPE["profile"]["website"];
    twitter: CANDIDATE_DETAILS_TYPE["profile"]["twitter"];
    display_image: CANDIDATE_DETAILS_TYPE["profile"]["display_image"];
    phone: CANDIDATE_DETAILS_TYPE["profile"]["phone"];
  }

  try {
    const payload: contactInfoCrawlerPayloadInterface = {
      name: null,
      email: null,
      website: null,
      twitter: null,
      display_image: null,
      phone: null,
    };

    for (let item of included) {
      if (
        (item["emailAddress"] ||
          item["websites"] ||
          item["phoneNumbers"] ||
          item["twitterHandles"] ||
          item["profilePicture"]) &&
        item["*memberRelationship"]
      ) {
        if (item["firstName"] || item["lastName"]) {
          payload.name = `${item["firstName"] ? item["firstName"] : ""}${
            item["lastName"]
              ? `${item["firstName"] ? " " : ""}${item["lastName"]}`
              : ""
          }`;
        }

        if (item["emailAddress"] && typeof item["emailAddress"] === "object") {
          payload.email = item["emailAddress"]["emailAddress"]
            ? item["emailAddress"]["emailAddress"]
            : null;
        }

        if (
          item["websites"] &&
          typeof item["websites"] === "object" &&
          item["websites"].length > 0
        ) {
          const getFirstPersonalWebsite = item["websites"][0]
            ? item["websites"][0]
            : null;

          if (getFirstPersonalWebsite) {
            payload.website = getFirstPersonalWebsite["url"] ?? null;
          }
        }

        if (
          item["twitterHandles"] &&
          typeof item["twitterHandles"] === "object" &&
          item["twitterHandles"].length > 0 &&
          item["twitterHandles"][0]["name"]
        ) {
          payload.twitter = `https://twitter.com/${item["twitterHandles"][0]["name"]}`;
        }

        if (
          item["profilePicture"] &&
          typeof item["profilePicture"] === "object" &&
          item["profilePicture"]["displayImageReference"] &&
          typeof item["profilePicture"]["displayImageReference"] === "object" &&
          item["profilePicture"]["displayImageReference"]["vectorImage"] &&
          typeof item["profilePicture"]["displayImageReference"][
            "vectorImage"
          ] === "object" &&
          item["profilePicture"]["displayImageReference"]["vectorImage"][
            "rootUrl"
          ] &&
          item["profilePicture"]["displayImageReference"]["vectorImage"][
            "artifacts"
          ] &&
          typeof item["profilePicture"]["displayImageReference"]["vectorImage"][
            "artifacts"
          ] === "object" &&
          item["profilePicture"]["displayImageReference"]["vectorImage"][
            "artifacts"
          ].length > 0
        ) {
          payload.display_image = constructProfileImg(
            item["profilePicture"]["displayImageReference"]["vectorImage"]
          );
        }

        // Phone number, need example to complete this.
        // if (
        //   item["phoneNumbers"] &&
        //   typeof item["phoneNumbers"] === "string" &&
        //   item["phoneNumbers"].replace(/\s/g, "") !== ""
        // ) {
        //   payload.phone = null
        // }

        break;
      }
    }

    return payload;
  } catch (error) {
    return {
      name: null,
      email: null,
      website: null,
      twitter: null,
      display_image: null,
      phone: null,
    } as contactInfoCrawlerPayloadInterface;
  }
}
