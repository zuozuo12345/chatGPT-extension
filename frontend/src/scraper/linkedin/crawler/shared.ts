export function constructProfileImg(profileImg) {
  try {
    let fullProfileImgUrl = null;

    const rootUrl = profileImg["rootUrl"] ? profileImg["rootUrl"] : null;

    const artifacts =
      profileImg["artifacts"] &&
      typeof profileImg["artifacts"] === "object" &&
      profileImg["artifacts"].length > 0
        ? profileImg["artifacts"]
        : null;

    if (rootUrl && artifacts) {
      artifacts.forEach((item) => {
        if (item["fileIdentifyingUrlPathSegment"]) {
          fullProfileImgUrl = `${rootUrl}${item["fileIdentifyingUrlPathSegment"]}`;
        }
      });
    }

    return fullProfileImgUrl;
  } catch (err) {
    return null;
  }
}
