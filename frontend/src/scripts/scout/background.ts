import _ from "lodash";

import { fetchJobMatchingCount } from "../../api/scout/candidate/fetch";
import { logoPath } from "../../utils/chrome";
import {
  getScoutWebTokenStorage,
  getSessionTypeStorage,
  setSessionTypeStorage,
} from "../../utils/storage";
import { SCOUT_WEB_URL, SCOUT_WEB_URL_HOST } from "./settings";

// Fired when chrome extension is installed.
chrome.runtime.onInstalled.addListener(async () => {
  const shownInstalledScreenStorage = await chrome.storage.sync.get([
    "shownInstalledScreen",
  ]);

  if (!shownInstalledScreenStorage["shownInstalledScreen"]) {
    await chrome.storage.sync.set({ shownInstalledScreen: true });

    chrome.tabs.create({ url: `${SCOUT_WEB_URL}chrome/ext/install` });
  }

  const getSessionTypeStorageResponse = await getSessionTypeStorage();

  if (getSessionTypeStorageResponse === "scout_web_app") {
    await chrome.storage.sync.set({ scoutWebToken: null });

    const { access_token } = await getAuthToken();

    chrome.storage.sync.set({ scoutWebToken: access_token ?? null });
    chrome.action.setIcon({
      path: logoPath(access_token ? "active" : "inactive"),
    });
  } else {
    const getScoutWebTokenStorageResponse = await getScoutWebTokenStorage();

    chrome.storage.sync.set({
      scoutWebToken: getScoutWebTokenStorageResponse ?? null,
    });
    chrome.action.setIcon({
      path: logoPath(getScoutWebTokenStorageResponse ? "active" : "inactive"),
    });
  }
});

// Fired when a connection is made from either an extension process or a content script
// chrome.runtime.onConnect.addListener(async () => {
//   // const { access_token } = await getAuthToken();
//   // chrome.storage.sync.set({ scoutWebToken: access_token ?? null });
//   chrome.runtime.reload();
// });

// // Fired when a profile that has this extension installed first starts up.
// chrome.runtime.onStartup.addListener(function () {
//   chrome.runtime.reload();
// });

// Fired when an update is available
chrome.runtime.onUpdateAvailable.addListener(async () => {
  chrome.runtime.reload();
});

// On any scout web app cookie changed
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (changeInfo["cause"]) {
    const cause = changeInfo["cause"];
    const cookie = changeInfo["cookie"];
    const { domain, value, name } = cookie;
    if (domain && domain === SCOUT_WEB_URL_HOST && name === "scout-auth") {
      const getSessionTypeStorageResponse = await getSessionTypeStorage();

      const { access_token } = await getAuthToken();

      chrome.storage.sync.set({ scoutWebToken: access_token ?? null });

      if (
        access_token !== null &&
        access_token !== undefined &&
        getSessionTypeStorageResponse === "local"
      ) {
        setSessionTypeStorage("scout_web_app");
      }
    }
  }
});

// On chrome storage change event listener
chrome.storage.onChanged.addListener(
  (changes: chrome.storage.StorageChange, string: chrome.storage.AreaName) => {
    if (changes && changes["scoutWebToken"] !== undefined) {
      const newToken: string | null = changes["scoutWebToken"]["newValue"]
        ? changes["scoutWebToken"]["newValue"]
        : null;

      chrome.action.setIcon({
        path: logoPath(newToken ? "active" : "inactive"),
      });
    }
  }
);

// Fired on chrome tab updating (navigating on the tab and etc.) and update the badge count
chrome.tabs.onUpdated.addListener(
  async (
    tabId: number,
    tabInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    try {
      if (
        tab.status === "complete" &&
        tabInfo.status === "complete" &&
        tab.url != undefined &&
        tab.active &&
        (tab.url.includes("linkedin.com/in") ||
          tab.url.includes("linkedin.com/talent"))
      ) {
        await extensionBadgeProcess({ tab, activity: "tabOnUpdate" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

// Fired on tab focused and update the badge count
chrome.tabs.onActivated.addListener(
  async (activeInfo: chrome.tabs.TabActiveInfo) => {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);

      if (tab && tab.active) {
        extensionBadgeProcess({ tab, activity: "tabOnActivated" });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

interface extensionBadgeProcessArgsInterface {
  tab: chrome.tabs.Tab;
  activity?: "tabOnUpdate" | "tabOnActivated";
}

// Function to update extension's badge count
async function extensionBadgeProcess(args: extensionBadgeProcessArgsInterface) {
  const { tab, activity = "tabOnUpdate" } = args;

  if (tab.status === "complete" && tab.active) {
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

          if (username) {
            const storageResponse = await chrome.storage.sync.get([
              "scoutWebToken",
            ]);

            if (storageResponse["scoutWebToken"]) {
              await getPublicProfileData(username);
            } else {
              chrome.action.setBadgeText({
                text: "0",
              });
            }
          } else {
            chrome.action.setBadgeText({
              text: "0",
            });
          }
        } else {
          if (tab.url.includes("linkedin.com/talent")) {
            const tabUrl = tab.url;

            const urlClass = new URL(tabUrl);

            if (urlClass.search && urlClass.search.replace(/\s/g, "") !== "") {
              const urlParams = new URLSearchParams(urlClass.search);

              const username = urlParams.get("username");

              if (username) {
                const storageResponse = await chrome.storage.sync.get([
                  "scoutWebToken",
                ]);

                if (storageResponse["scoutWebToken"]) {
                  await getPublicProfileData(username);
                }
              }
            } else {
              chrome.action.setBadgeText({
                text: "0",
              });
            }
          } else {
            chrome.action.setBadgeText({
              text: "0",
            });
          }
        }
      } else {
        chrome.action.setBadgeText({
          text: "0",
        });
      }
    } else {
      chrome.action.setBadgeText({
        text: "0",
      });
    }
  }
}

// Function to fetch candidate profile based on username
async function getPublicProfileData(username: string) {
  try {
    const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

    const response = await fetchJobMatchingCount({
      access_token: storageResponse["scoutWebToken"],
      linkedinUsername: username,
    });

    chrome.action.setBadgeText({
      text: `${response}`,
    });

    return response;
  } catch (error) {
    chrome.action.setBadgeText({
      text: "0",
    });

    return null;
  }
}

(async () => {
  // Set badge background color to hackertrail's blaze orange.
  chrome.action.setBadgeBackgroundColor({
    color: `#ea6915`,
  });
})();

// Function to unseal encrypted cookie value.
async function unsealCookie({
  cookieValue = null,
  scoutWebsiteUrl = SCOUT_WEB_URL,
}) {
  try {
    if (!cookieValue || !scoutWebsiteUrl)
      throw "No cookie value or website url provided";

    const response = await fetch(
      `${scoutWebsiteUrl}api/me-scout?cookieValue=${cookieValue}`,
      {
        method: "GET",
        redirect: "follow",
      }
    );

    const data = await response.json();

    return {
      access_token: data.access_token,
    };
  } catch (error) {
    return {
      access_token: null,
    };
  }
}

// Function to get the scout web app's session cookie value.
async function getAuthToken() {
  let authCookie = null;
  let access_token = null;

  const cookies = await chrome.cookies.getAll({
    url: SCOUT_WEB_URL,
  });

  if (cookies.length > 0) {
    for (const cookie of cookies) {
      if (cookie.name === "scout-auth") {
        authCookie = cookie.value;
        break;
      }
    }
  }

  if (authCookie) {
    const unsealCookieResponse = await unsealCookie({
      cookieValue: authCookie,
      scoutWebsiteUrl: SCOUT_WEB_URL,
    });

    access_token = unsealCookieResponse.access_token;
  }

  return {
    auth_cookie: authCookie,
    access_token,
  };
}

export {};
