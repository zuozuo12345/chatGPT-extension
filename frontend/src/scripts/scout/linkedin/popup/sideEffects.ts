import { STORED_CANDIDATE_DATA_TYPE } from "../../../../typescript/types/candidate";

interface candidateDataStateType {
  details: STORED_CANDIDATE_DATA_TYPE;
  linkedinUsername: string | null;
}

interface onTabUpdateLinkedinArgs {
  tab: chrome.tabs.Tab;
  candidateData: candidateDataStateType;
}

export function onTabUpdateLinkedin({
  tab,
  candidateData,
}: onTabUpdateLinkedinArgs) {
  if (
    tab.url.includes("linkedin.com/in") ||
    tab.url.includes("linkedin.com/talent")
  ) {
    const tabUrl = tab.url;

    const urlClass = new URL(tabUrl);

    if (
      urlClass &&
      urlClass.pathname &&
      urlClass.pathname.split("/").length > 1
    ) {
      if (tab.url.includes("linkedin.com/in")) {
        const username = urlClass.pathname.split("/")[2];

        if (candidateData.linkedinUsername !== null) {
          let details: STORED_CANDIDATE_DATA_TYPE = null;

          if (
            candidateData.details &&
            candidateData.details.profile &&
            candidateData.details.profile.profile_url
          ) {
            const profileUrl = new URL(
              candidateData.details.profile.profile_url
            );

            if (
              profileUrl &&
              profileUrl.pathname &&
              profileUrl.pathname.split("/").length > 1
            ) {
              const profileUrlUsername = urlClass.pathname.split("/")[2];

              if (profileUrlUsername === username) {
                details = {
                  ...candidateData.details,
                };
              }
            }
          }

          if (candidateData.linkedinUsername !== username) {
            return {
              ...candidateData,
              details: details,
              linkedinUsername: username,
            };
          } else {
            return {
              ...candidateData,
            };
          }
        } else {
          return {
            details: null,
            linkedinUsername: username,
          };
        }
      } else {
        if (tab.url.includes("linkedin.com/talent")) {
          const tabUrl = tab.url;

          const urlClass = new URL(tabUrl);

          if (urlClass.search && urlClass.search.replace(/\s/g, "") !== "") {
            const urlParams = new URLSearchParams(urlClass.search);

            const username = urlParams.get("username");

            if (candidateData.linkedinUsername !== username) {
              return {
                ...candidateData,
                details: null,
                linkedinUsername: username,
              };
            }
          }
        } else {
          return {
            details: null,
            linkedinUsername: null,
          };
        }
      }
    }
  }

  return null;
}

interface onTabQueryLinkedinArgs {
  tabs: chrome.tabs.Tab[];
  candidateData: candidateDataStateType;
}

export function onTabQueryLinkedin({
  tabs,
  candidateData,
}: onTabQueryLinkedinArgs) {
  const activeTab = tabs[0];

  if (activeTab) {
    const tabUrl = activeTab.url;

    if (tabUrl.includes("linkedin.com/in")) {
      const urlClass = new URL(tabUrl);

      if (
        urlClass &&
        urlClass.pathname &&
        urlClass.pathname.split("/").length > 1
      ) {
        const username = urlClass.pathname.split("/")[2];

        return {
          ...candidateData,
          linkedinUsername: username,
        };
      }
    } else {
      if (tabUrl.includes("linkedin.com/talent")) {
        const urlClass = new URL(tabUrl);

        if (urlClass.search && urlClass.search.replace(/\s/g, "") !== "") {
          const urlParams = new URLSearchParams(urlClass.search);

          const username = urlParams.get("username");

          if (username) {
            return {
              ...candidateData,
              linkedinUsername: username,
            };
          }
        }
      }
    }
  }

  return null;
}
