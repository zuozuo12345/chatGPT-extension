const monthsReference = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const getDurationFromMonthYear = (startMonth, startYear, endMonth, endYear) => {
  if (!endYear) {
    //Get current year
    endYear = new Date().getFullYear();
    endMonth = new Date().getMonth() + 1;
  }
  if (!endMonth) {
    endMonth = new Date().getMonth() + 1;
  }
  if (!startMonth) {
    startMonth = new Date().getMonth() + 1;
  }
  let numYears = 0;
  let numMonths = 0;
  if (startMonth > endMonth) {
    numMonths = endMonth + (12 - startMonth);
    numYears = endYear - startYear - 1;
  } else {
    numMonths = endMonth - startMonth;
    numYears = endYear - startYear;
  }
  if (numYears && numMonths) {
    return `${numYears} yrs ${numMonths} mos`;
  } else if (numYears) {
    return `${numYears} yrs`;
  }
  return `${numMonths} mos`;
};

export async function crawlRpsProfile() {
  // This code fetches the profile code from the page <code> tag. Only available on LinkedIn RPS Hiring Manager pages.
  const code_tags = document.querySelectorAll("code");
  let profileCodeJson = null;
  // get code_tag with "contactInfo" in it

  for (let i = 0; i < code_tags.length; i++) {
    let innerText = null;

    try {
      innerText = JSON.parse(code_tags[i].innerText);
    } catch (e) {}

    if (innerText?.contactInfo) {
      profileCodeJson = innerText;
      console.log("profileCodeJson", profileCodeJson);
    }
  }

  if (!profileCodeJson) {
    profileCodeJson = await getDataFromRPSFromLinkedinApi();
  }

  let username = null;

  if (profileCodeJson["publicProfileUrl"]) {
    const parts = profileCodeJson["publicProfileUrl"].split("/");
    const lastSegment = parts.pop() || parts.pop();

    username = lastSegment;
  }

  const result = {
    username: username,
    profile: getProfile(profileCodeJson),
    skills: getSkill(profileCodeJson),
    experiences: getExperience(profileCodeJson),
    educations: getEducation(profileCodeJson),
    certifications: getCertification(),
    open_to_work: getOpenToWork(),
    industry: getIndustry(),
    job: null,
  };

  // result.profile.current_role_title = result.experiences[0]?.job_title || '';
  // result.profile.current_company_name = result.experiences[0]?.company_name || '';
  return result;
}

export async function getDataFromRPSFromLinkedinApi() {
  // This code calls the LinkedsIn internal API to find the profile JSON code. Only works on LinkedIn RPS.

  let last_path_component = window.location.href.split("/").pop();
  // If url contains ?, split and use first part
  if (last_path_component.indexOf("?") > -1) {
    last_path_component = last_path_component.split("?")[0];
  }

  const url = `https://www.linkedin.com/talent/api/talentLinkedInMemberProfiles/urn%3Ali%3Ats_linkedin_member_profile%3A(${last_path_component}%2C1%2Curn%3Ali%3Ats_hiring_project%3A0)`;
  const requestType = "POST";
  const formData = {
    altkey: "urn",
    decoration: encodeURIComponent(
      `(entityUrn,referenceUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,memberPreferences(availableStartingAt,locations,geoLocations*~(standardGeoStyleName),openToNewOpportunities,titles,interestedCandidateIntroductionStatement,industries*~,companySizeRange,employmentTypes,proxyPhoneNumberAvailability,benefits,schedules,salaryLowerBounds,commute,jobSeekingUrgencyLevel,openToWorkRemotely,localizedWorkplaceTypes,remoteGeoLocationUrns*~(standardGeoStyleName)),firstName,lastName,headline,location,profilePicture,vectorProfilePicture,numConnections,summary,networkDistance,skills*(endorsementCount,skillAssessmentVerified,skillName),profileSkillUrns*~(entityUrn,resumeSkill,skillAssessmentBadge,profileResume,skillUrn~(entityUrn,skillName)),profileSkills*(name,skillAssessmentBadge,profileResume,endorsementCount,profileSkillAssociationsGroupUrn~(entityUrn,associations*(description,type,organizationUrn~(name,url,logo))),hasInsight),publicProfileUrl,contactInfo,websites*,canSendInMail,unlinked,unLinkedMigrated,highlights(connections(connections*~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile),totalCount),companies(companies*(company~(followerCount,name,url,vectorLogo),overlapInfo)),schools(schools*(school~(name,url,vectorLogo),schoolOrganizationUrn~(name,url,logo),overlapInfo))),followingEntities(companies*~(followerCount,name,url,vectorLogo),influencers*~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile),schools*~(name,url,vectorLogo),schoolOrganizationsUrns*~(name,url,logo)),educations*(school~(name,url,vectorLogo),organizationUrn~(name,url,logo),schoolName,grade,description,degreeName,fieldOfStudy,startDateOn,endDateOn),groupedWorkExperience*(companyUrn~(followerCount,name,url,vectorLogo),positions*(title,startDateOn,endDateOn,description,location,employmentStatus,organizationUrn,companyName,associatedProfileSkillNames,companyUrn~(url,vectorLogo)),startDateOn,endDateOn),volunteeringExperiences*(company~(followerCount,name,url,vectorLogo),companyName,role,startDateOn,endDateOn,description),recommendations*(recommender~(entityUrn,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile),recommendationText,relationship,created),accomplishments(projects*(title,description,url,startDateOn,endDateOn,singleDate,contributors*(name,linkedInMember~(entityUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),courses*,languages*,publications*(name,publisher,description,url,dateOn,authors*(name,linkedInMember~(entityUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),patents*(number,applicationNumber,title,issuer,pending,url,filingDateOn,issueDateOn,description,inventors*(name,linkedInMember~(entityUrn,anonymized,unobfuscatedFirstName,unobfuscatedLastName,firstName,lastName,headline,profilePicture,vectorProfilePicture,publicProfileUrl,followerCount,networkDistance,automatedActionProfile))),testScores*,honors*,certifications*(name,licenseNumber,authority,company~(followerCount,name,url,vectorLogo),url,startDateOn,endDateOn)),privacySettings(allowConnectionsBrowse,showPremiumSubscriberIcon),legacyCapAuthToken,fullProfileNotVisible,currentPositions*(company~(followerCount,name,url,vectorLogo),companyName,title,startDateOn,endDateOn,description,location),industryName)`
    ),
  };
  formData.decoration = formData.decoration
    .replaceAll("(", "%28")
    .replaceAll(")", "%29")
    .replace("~", "%7E");
  // CSRF Token read www.linkedin.com cookie JSESSIONID
  let csrf_token = document.cookie
    .split(";")
    .find((row) => row.trim().startsWith("JSESSIONID"))
    .split("=")[1];
  //Remove first and last char of csrf_token
  csrf_token = csrf_token.substring(1, csrf_token.length - 1);
  // Get page-instance from local storage
  let page_instance = localStorage.getItem("page-instance");
  let page_instance_key = null;

  // Page instance to JSON
  if (page_instance) {
    const parsed_page_instance = JSON.parse(page_instance);

    // Get first key of page_instance
    page_instance_key = Object.keys(parsed_page_instance)[0];
  }

  const headers = {
    accept: "application/json",
    "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/x-www-form-urlencoded",
    "csrf-token": csrf_token,
    "sec-ch-ua":
      '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-http-method-override": "GET",
    "x-li-lang": "en_US",
    "x-li-page-instance": `urn:li:page:d_talent_profile_profile_tab;${page_instance_key}`,
    "x-li-track":
      '{"clientVersion":"1.3.1006.2","mpVersion":"1.3.1006.2","osName":"web","timezoneOffset":8,"timezone":"Asia/Singapore","mpName":"talent-solutions-web","displayDensity":1,"displayWidth":1600,"displayHeight":900}',
    "x-restli-protocol-version": "2.0.0",
  };

  if (!page_instance_key) {
    delete headers["x-li-page-instance"];
  }

  // Fetch
  const response = await fetch(url, {
    method: requestType,
    body: `altkey=${formData.altkey}&decoration=${formData.decoration}`,
    headers: headers,
    referrer: window.location.href,
    referrerPolicy: "strict-origin-when-cross-origin",
    mode: "cors",
    credentials: "include",
  });

  const responsejson = await response.json();

  return responsejson;
}

export const getProfileFromHTML = () => {
  // Scrape profile from profile page
  let name =
    document
      .querySelector<HTMLElement>(
        ".topcard-condensed__content .artdeco-entity-lockup__title"
      )
      ?.textContent.trim() || null;
  if (!name) {
    name =
      document
        .querySelector<HTMLElement>(".artdeco-entity-lockup__title")
        ?.textContent.trim() || null;
  }

  let title =
    document
      .querySelector<HTMLElement>(
        ".topcard-condensed__content .artdeco-entity-lockup__subtitle"
      )
      ?.textContent.trim() || null;
  if (!title) {
    title =
      document
        .querySelector<HTMLElement>(".artdeco-entity-lockup__subtitle")
        ?.textContent.trim() || null;
  }

  let location: string | null =
    contentTrim(
      document
        .querySelector<HTMLElement>(
          ".topcard-condensed__content div[data-test-row-lockup-location]"
        )
        ?.textContent.trim()
    ) || null;
  if (!location) {
    location =
      contentTrim(
        document
          .querySelector<HTMLElement>("div[data-test-row-lockup-location]")
          ?.textContent.trim()
      ) || null;
  }

  const display_image =
    document
      .querySelector<HTMLElement>(
        ".artdeco-entity-lockup__image .lockup__image-container img"
      )
      ?.getAttribute("src") || null;
  const email =
    document
      .querySelector<HTMLElement>(".contact-info__email-address")
      ?.textContent.trim() || null;
  const phone =
    document
      .querySelector<HTMLElement>("span[data-test-contact-phone]")
      ?.textContent.trim() || null;
  const profile_url =
    document
      .querySelector<HTMLElement>(".personal-info__link")
      ?.getAttribute("href") || null;
  const website =
    document
      .querySelector<HTMLElement>(
        ".personal-info__link.personal-info__link--website"
      )
      ?.getAttribute("href") || null;

  const url = window.location.href;

  return {
    name,
    email,
    profile_url,
    url,
    phone,
    title,
    display_image,
    location,
    website,
  };
};

export const getProfile = (profileCode: any) => {
  if (!profileCode) {
    let htmlProfile = getProfileFromHTML();

    return htmlProfile;
  }

  let name = profileCode.firstName || null;
  if (profileCode.lastName) {
    name += " " + profileCode.lastName;
  }
  if (!name) {
    let elementToGet =
      ".artdeco-entity-lockup--size-7 .artdeco-entity-lockup__content .artdeco-entity-lockup__title";
    if (document.querySelector(elementToGet)) {
      name = document.querySelector(elementToGet).textContent.trim();
    }
  }

  const title = profileCode.summary || null;
  const location = profileCode.location?.displayName || null;
  const display_image =
    document
      .querySelector(
        ".artdeco-entity-lockup__image .lockup__image-container img"
      )
      ?.getAttribute("src") || null;
  let email = profileCode.contactInfo?.primaryEmail || null;
  if (!email) {
    email =
      document
        .querySelector(".contact-info__email-address")
        ?.textContent.trim() || null;
  }
  let phone = profileCode.contactInfo?.primaryPhone?.number || null;
  if (!phone) {
    if (
      document.querySelector(
        ".profile__main-container span[data-test-contact-phone]"
      )
    ) {
      phone = document
        .querySelector(".profile__main-container span[data-test-contact-phone]")
        ?.textContent.trim();
    } else if (document.querySelector(".contact-info__list-item")) {
      // Get all contact-info__list-item
      const contactInfoList = document.querySelectorAll(
        ".contact-info__list-item"
      );
      for (let i = 0; i < contactInfoList.length; i++) {
        let contactInfoUnit = contactInfoList[i];
        // Check that contactInfo.textContent does not contain '@'
        if (!contactInfoUnit.textContent.includes("@")) {
          // Get span inside contactInfoUnit
          const phoneSpan = contactInfoUnit.querySelector("span");
          if (phoneSpan) {
            phone = phoneSpan.textContent.trim();
            break;
          }
        }
      }
      // phone = document.querySelector('.contact-info__list-item')?.textContent.trim();
    }
  }

  let profile_url = profileCode.publicProfileUrl || null;
  if (profile_url) {
    let elementToGet = ".personal-info__content a.personal-info__link";
    if (document.querySelector(elementToGet)) {
      profile_url = document.querySelector(elementToGet).getAttribute("href");
    }
  }
  const url = window.location.href;
  const website =
    document
      .querySelector(".personal-info__link.personal-info__link--website")
      ?.getAttribute("href") || null;

  return {
    name,
    email,
    profile_url,
    url,
    phone,
    title,
    display_image,
    location,
    website,
  };
};

export const contentTrim = (content) => {
  if (!content) return null;

  return content.replace(/•/g, " ").replace(/·/g, " ").trim();
};

const getSkillFromHTML = () => {
  // Set document body overflow-anchor to none
  document.body.style.overflowAnchor = "none";

  const skills_el = document.querySelectorAll(".skill") || [];

  let skills = [];

  skills_el.forEach((skill_el) => {
    const name =
      skill_el.querySelector(".skill__skill-name")?.textContent.trim() || null;
    const num_endorsements =
      Number(
        skill_el
          .querySelector(
            ".skill__endorser-count span[data-test-skill-entity-endorser-count]"
          )
          ?.textContent.trim()
      ) || null;
    const passed_linkedin_assessment = skill_el.querySelector(
      ".skill__verified-icon-container"
    )
      ? true
      : false;

    skills.push({
      name,
      num_endorsements,
      passed_linkedin_assessment,
    });
  });

  return skills;
};

export const getSkill = (profileCode) => {
  if (!profileCode) {
    return getSkillFromHTML();
  }

  let skills = [];
  let profileSkills = profileCode.profileSkills || [];
  for (let i = 0; i < profileSkills.length; i++) {
    let profileSkill = profileSkills[i];
    let name = profileSkill.name || "";
    let num_endorsements = profileSkill.endorsementCount || 0;
    let passed_linkedin_assessment = profileSkill.hasInsight || 0;
    skills.push({
      name,
      num_endorsements,
      passed_linkedin_assessment,
    });
  }
  return skills;
};

export const getExperience = (profileCode) => {
  if (!profileCode) {
    return [];
  }

  let experiences = [];

  const experienceGroups = profileCode.groupedWorkExperience || [];
  for (let i = 0; i < experienceGroups.length; i++) {
    const experienceGroup = experienceGroups[i];
    const positions = experienceGroup.positions || [];

    for (let j = 0; j < positions.length; j++) {
      const experience = positions[j];
      const company_name = experience.companyName || null;
      const job_title = experience.title || null;
      const location = experience.location?.displayName || null;
      const description = experience.description || null;
      let startDate =
        experience.startDateOn || experienceGroup.startDateOn || null;
      let endDate = experience.endDateOn || experienceGroup.endDateOn || null;
      let duration = "";
      let dates = "";

      let startDateText = "";
      if (startDate) {
        let startMonth = startDate.month || null;
        let startMonthName = "";
        if (startMonth && monthsReference[startMonth]) {
          startMonthName = monthsReference[startMonth];
        }
        let startYear = startDate.year || "";
        startDateText = startMonthName + " " + startYear;
      }

      let endDateText = "Present";
      if (endDate) {
        let endMonth = endDate.month || "";
        let endMonthName = "";
        if (endMonth && monthsReference[endMonth]) {
          endMonthName = monthsReference[endMonth];
        }
        let endYear = endDate.year || "";

        endDateText = endMonthName + " " + endYear;
      }

      duration =
        startDate && endDate
          ? getDurationFromMonthYear(
              startDate && startDate.month ? startDate.month : null,
              startDate && startDate.year ? startDate.year : null,
              endDate && endDate.month ? endDate.month : null,
              endDate && endDate.year ? endDate.year : null
            )
          : null;
      dates =
        startDate || endDate
          ? `${startDate ? `${startDateText}${endDate ? " - " : ""}` : ""}${
              endDate ? endDateText : ""
            }`
          : null;

      experiences.push({
        company_name: company_name ?? "",
        job_title,
        location,
        dates,
        duration,
        description,
      });
    }
  }

  return experiences;
};

export const getEducation = (profileCode) => {
  if (!profileCode) {
    return [];
  }

  let educations = [];

  let educationSections = profileCode.educations || [];
  for (let i = 0; i < educationSections.length; i++) {
    const educationSection = educationSections[i];
    const degree_name = educationSection.degreeName || null;
    const institution = educationSection.schoolName || null;
    const field = educationSection.fieldOfStudy || null;
    let startDate = educationSection.startDateOn || null;
    let endDate = educationSection.endDateOn || null;
    let startDateText = "";

    if (startDate) {
      let startMonth = startDate.month || null;
      let startMonthName = "";
      if (startMonth && monthsReference[startMonth]) {
        startMonthName = monthsReference[startMonth];
      }
      let startYear = startDate.year || "";
      startDateText = startMonthName + " " + startYear;
    }

    let endDateText = "Present";
    if (endDate) {
      let endMonth = endDate.month || "";
      let endMonthName = "";
      if (endMonth && monthsReference[endMonth]) {
        endMonthName = monthsReference[endMonth];
      }
      let endYear = endDate.year || "";
      endDateText = endMonthName + " " + endYear;
    }

    const dates = startDateText + " - " + endDateText;
    educations.push({
      degree_name,
      institution,
      field,
      dates,
    });
  }
  return educations;
};

export const getCertification = () => {
  const certifications_el =
    document.querySelectorAll<HTMLElement>(".certification-entity") || [];

  let certifications = [];

  certifications_el.forEach((certification_el) => {
    const name =
      certification_el
        .querySelector(".accomplishments-base-entity__title")
        ?.textContent.trim() || null;
    const dates =
      certification_el
        .querySelector(".accomplishments-base-entity__date")
        ?.textContent.trim() || null;

    certifications.push({
      name,
      dates,
    });
  });

  return certifications;
};

export const getOpenToWork = () => {
  if (
    contentTrim(
      document.querySelector(".summary-card__header")?.textContent.trim()
    )
  ) {
    return "yes";
  } else if (
    contentTrim(
      document
        .querySelector(".open-to-work-insights__header")
        ?.textContent.trim()
    )
  ) {
    return "maybe";
  }
  return "no";
};

export const getIndustry = () => {
  let industry =
    contentTrim(
      document
        .querySelector(
          ".topcard-condensed__content span[data-test-current-employer-industry]"
        )
        ?.textContent.trim()
    ) || null;
  if (!industry) {
    industry =
      contentTrim(
        document
          .querySelector("span[data-test-current-employer-industry]")
          ?.textContent.trim()
      ) || null;
  }
  return industry;
};
