import { PATH_TYPE, SUB_PATH_TYPE } from "../typescript/types/url";

export function determinePathType(url: string): PATH_TYPE {
  let type: PATH_TYPE = null;

  if (url.includes("linkedin.com/in")) {
    type = "public_profile";
  } else if (url.includes("linkedin.com") && url.indexOf("/profile") > -1) {
    type = "rps";
  } else {
    type = "unrelated";
  }

  return type;
}

export function determineSubPathType(
  pathType: PATH_TYPE,
  url: string
): SUB_PATH_TYPE {
  let type: SUB_PATH_TYPE = null;

  if (pathType === "public_profile") {
    if (url.includes("/overlay/contact-info")) {
      type = "contact_info";
    } else if (url.includes("details/experience")) {
      type = "details_experience";
    } else if (url.includes("details/skills")) {
      type = "details_skills";
    } else if (url.includes("details/education")) {
      type = "details_education";
    } else if (url.includes("details/certifications")) {
      type = "details_certifications";
    } else if (url.includes("/recent-activity")) {
      type = "recent_activity";
    } else {
      type = "root";
    }
  } else if (pathType === "rps") {
    type = "root_rps";
  } else {
    type = "unrelated";
  }

  return type;
}

export function determinePath(url: string) {
  const mainPathType = determinePathType(url);
  const subPathType = determineSubPathType(mainPathType, url);

  return {
    mainPathType,
    subPathType,
  };
}

export async function getBase64ImageFromUrl(imageUrl) {
  var res = await fetch(imageUrl);
  var blob = await res.blob();

  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        resolve(reader.result);
      },
      false
    );

    reader.onerror = () => {
      return reject(this);
    };
    reader.readAsDataURL(blob);
  });
}

export function checkContainsUrl(substrings: string[], str: string) {
  try {
    if (substrings.some((v) => str.includes(v))) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}
