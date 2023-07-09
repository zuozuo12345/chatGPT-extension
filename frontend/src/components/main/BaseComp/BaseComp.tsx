import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import {
  useSelector,
  useDispatch,
  shallowEqual,
  batch,
  useStore,
} from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import _ from "lodash";

import { REDUX_ROOT_STATE } from "../../../redux/store";
import {
  setAppSessionOrigin,
  setInitialiseState,
  setServiceUnavailable,
} from "../../../redux/app/appSlice";
import {
  setSelectedJobMatchingId,
  setUserAccessToken,
  setUserBasicData,
  setUserJobList,
} from "../../../redux/user/userSlice";
import {
  fetchJobList,
  fetchSessionUserData,
} from "../../../api/scout/user/fetch";
import InitialisingComp from "../../support/InitialisingComp/InitialisingComp";
import {
  setProfileDetails,
  setProfileLinkedinUsername,
} from "../../../redux/profile/profileSlice";
import { SCOUT_API_URL, SCOUT_WEB_URL } from "../../../scripts/scout/settings";
import { fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApi } from "../../../api/scout/candidate/fetch";
import { ErrorRetry, GeneralLoadingComp } from "../../support";
import AppBar from "../../sub/AppBar/AppBar";
import { STORED_CANDIDATE_DATA_TYPE } from "../../../typescript/types/candidate";
import { ProfileBasicDetails } from "../../sub";
import ErrorBg from "../../../assets/error_page.svg";
import { useSessionUser } from "../../../hooks/useSessionUser";
import LoginComp from "../LoginComp/LoginComp";
import { determinePath } from "../../../scraper/linkedin/utils";

export default function BaseComp() {
  const dispatch = useDispatch();
  const store = useStore<REDUX_ROOT_STATE>();

  const abortControllerRef = useRef<{
    [key: string]: AbortController;
  }>({});

  const { authenticated, consented, accessToken, sessionUserDetails } =
    useSessionUser();

  const scoutAccessToken = accessToken;
  const scoutUserDetails = sessionUserDetails;

  const appInitialised = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["app"]["init"]
  >((state) => state.app.init, shallowEqual);
  const linkedinUsername = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["username"]["linkedin"]
  >((state) => state.profile.username.linkedin, shallowEqual);
  const profileData = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["details"]["profileDetails"]
  >((state) => state.profile.details.profileDetails, shallowEqual);

  const [updatingUserDetails, setUpdatingUserDetails] =
    useState<boolean>(false);
  const [retrievingProfileData, setRetrievingProfileData] =
    useState<boolean>(false);
  const [errorRetry, setErrorRetry] = useState<boolean>(false);
  const [retryAttempt, setRetryAttempt] = useState<{
    active: boolean;
    remainingAttempts: number;
  }>({
    active: false,
    remainingAttempts: 0,
  });
  const [unrelatedPage, setUnrelatedPage] = useState<boolean>(false);

  const retrieveSessionTypeFromStorage = useCallback(async (): Promise<
    REDUX_ROOT_STATE["app"]["sessionOrigin"]
  > => {
    try {
      const sessionTypeResponse = await chrome.storage.sync.get([
        "sessionType",
      ]);

      return Object.keys(sessionTypeResponse).length > 0 &&
        "sessionType" in sessionTypeResponse &&
        sessionTypeResponse["sessionType"] === "local"
        ? "local"
        : "scout_web_app";
    } catch (err) {
      return "scout_web_app";
    }
  }, []);

  const retrieveScoutWebCookie = useCallback(async (): Promise<string> => {
    try {
      const storageResponse = await chrome.storage.sync.get(["scoutWebToken"]);

      return typeof storageResponse["scoutWebToken"] === "string"
        ? storageResponse["scoutWebToken"]
        : null;
    } catch (err) {
      return null;
    }
  }, []);

  const retrieveScoutUserDetails = useCallback(
    async (
      access_token: string
    ): Promise<{
      userDetails: REDUX_ROOT_STATE["user"]["details"];
      userConsent: boolean;
      jobs: REDUX_ROOT_STATE["user"]["job"]["list"];
    }> => {
      try {
        const promises = await Promise.all([
          fetchSessionUserData({
            access_token: access_token,
          }),
          fetchJobList({
            access_token: access_token,
          }),
        ]);

        return {
          userDetails: promises[0].userData,
          userConsent: promises[0].userConsent,
          jobs: promises[1].jobList,
        };
      } catch (err) {
        return {
          userDetails: null,
          userConsent: false,
          jobs: {},
        };
      }
    },
    []
  );

  const retrieveUserBasicDetails = useCallback(
    async (args?: { forwardAccessToken?: string }) => {
      const forwardAccessToken = args && args["forwardAccessToken"];

      const toStore: {
        accessToken: string;
        sessionType: REDUX_ROOT_STATE["app"]["sessionOrigin"];
        userDetails: REDUX_ROOT_STATE["user"]["details"];
        userConsent: boolean;
        jobs: REDUX_ROOT_STATE["user"]["job"]["list"];
      } = {
        accessToken: null,
        sessionType: "scout_web_app",
        userDetails: null,
        userConsent: false,
        jobs: null,
      };

      try {
        toStore.accessToken =
          args === undefined || forwardAccessToken === undefined
            ? await retrieveScoutWebCookie()
            : forwardAccessToken;
        toStore.sessionType = await retrieveSessionTypeFromStorage();

        if (toStore.accessToken) {
          const retrieveScoutUserDetailsResponse =
            await retrieveScoutUserDetails(toStore.accessToken);

          toStore.userDetails = retrieveScoutUserDetailsResponse.userDetails;
          toStore.userConsent = retrieveScoutUserDetailsResponse.userConsent;
          toStore.jobs = retrieveScoutUserDetailsResponse.jobs;
        }

        return toStore;
      } catch (err) {
        return toStore;
      }
    },
    []
  );

  const retrieveLinkedinUsername = useCallback((tabUrl: string): string => {
    try {
      const urlClass = typeof tabUrl === "string" ? new URL(tabUrl) : null;

      if (
        tabUrl &&
        (tabUrl.includes("linkedin.com/in") ||
          tabUrl.includes("linkedin.com/talent")) &&
        urlClass &&
        urlClass.pathname &&
        urlClass.pathname.split("/").length > 1
      ) {
        const urlParams = new URLSearchParams(urlClass.search);

        const username =
          (tabUrl.includes("linkedin.com/in")
            ? urlClass.pathname.split("/")[2]
            : urlParams.get("username")) ?? null;

        return username;
      } else {
        throw "Not a valid LinkedIn URL";
      }
    } catch (error) {
      return null;
    }
  }, []);

  const retrieveProfileDataUsingApi = useCallback(
    async (args: {
      access_token: string;
      username: string;
      currentAbortController?: AbortController;
    }) => {
      const {
        access_token = null,
        username = null,
        currentAbortController = null,
      } = args;

      try {
        const responseData =
          await fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApi({
            access_token,
            linkedinUsername: username,
          });

        return responseData;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const retrieveProfileData = useCallback(
    async (args: {
      access_token: string;
      username: string;
      platform?: "linkedin" | "naukri";
    }) => {
      const {
        access_token = null,
        username = null,
        platform = "linkedin",
      } = args;

      abortControllerRef.current = {
        ...abortControllerRef.current,
        [username]: new AbortController(),
      };

      try {
        if (!access_token || !username) {
          throw "No access token or username";
        }

        await fetchEventSource(
          `${SCOUT_API_URL}api/scout/data/extension/candidate/stream`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              username: username,
              platform: platform,
            }),
            openWhenHidden: true,
            async onopen(res) {
              if (res.ok && res.status === 200) {
                // "Connection made"
              } else if (
                res.status >= 400 &&
                res.status < 500 &&
                res.status !== 429
              ) {
                // "Client side error"
              }
            },
            signal: abortControllerRef.current[username].signal,
            onmessage(event) {
              try {
                const eventType = event.event;

                if (!abortControllerRef.current[username].signal.aborted) {
                  const storeLinkedinUsername =
                    store.getState().profile.username.linkedin;

                  if (
                    storeLinkedinUsername &&
                    storeLinkedinUsername !== username
                  ) {
                    throw "Different linkedin profile";
                  }

                  const parsedData =
                    eventType !== "ping" &&
                    eventType === "extension-get-candidate"
                      ? JSON.parse(
                          String.raw({
                            raw: `${event.data}`,
                          })
                        )
                      : null;

                  if (parsedData) {
                    dispatch(
                      setProfileDetails({
                        username: linkedinUsername,
                        details: parsedData ?? null,
                      })
                    );
                    setRetrievingProfileData(false);
                  }
                }
              } catch (error) {
                abortControllerRef.current[username].abort();
              }
            },
            onclose() {
              // "Connection closed by the server"
              const storeLinkedinUsername =
                store.getState().profile.username.linkedin;
              const storeDetails =
                store.getState().profile.details.profileDetails;

              if (storeLinkedinUsername === username && !storeDetails) {
                showErrorRetryScreen();
              }
            },
            onerror(err) {
              throw err;
            },
          }
        );
      } catch (error) {
        setRetrievingProfileData(false);
        showErrorRetryScreen();
      }
    },
    []
  );

  const triggrRetryAttempt = useCallback(() => {
    setRetryAttempt({
      active: true,
      remainingAttempts: 5,
    });
  }, []);

  const resetRetryAttempt = useCallback(() => {
    setRetryAttempt({
      active: false,
      remainingAttempts: 0,
    });
  }, []);

  const showErrorRetryScreen = useCallback(async () => {
    setRetrievingProfileData(false);
    setErrorRetry(true);
  }, []);

  const retryButtonOnClick = useCallback(async () => {
    setErrorRetry(false);
    setRetrievingProfileData(true);
  }, []);

  // Init side effect
  useEffect(() => {
    const init = async () => {
      try {
        const toStore = await retrieveUserBasicDetails();

        const activeTab = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        const newUsername = retrieveLinkedinUsername(
          activeTab[0] && activeTab[0].url ? activeTab[0].url : null
        );

        if (toStore.accessToken && toStore.userDetails) {
          if (!newUsername) {
            setUnrelatedPage(true);
          }

          batch(() => {
            dispatch(
              setAppSessionOrigin(toStore.sessionType ?? "scout_web_app")
            );
            dispatch(
              setUserBasicData({
                accessToken: toStore.accessToken ?? null,
                consented: toStore.userConsent ?? false,
                details: toStore.userDetails,
              })
            );
            dispatch(setUserJobList(toStore.jobs));
            dispatch(setProfileLinkedinUsername(newUsername));
            dispatch(setInitialiseState(true));
          });
        } else {
          batch(() => {
            if (toStore.accessToken) {
              dispatch(setUserAccessToken(toStore.accessToken));
            }
            dispatch(setInitialiseState(true));
          });
        }
      } catch (error) {
        dispatch(setServiceUnavailable(true));
      }
    };

    if (!appInitialised) {
      init();
    }
  }, [appInitialised]);

  // Listens to changes to chrome storage and updates the access token
  useEffect(() => {
    const callback = async (
      changes: chrome.storage.StorageChange,
      string: chrome.storage.AreaName
    ) => {
      if (appInitialised && changes["scoutWebToken"] !== undefined) {
        const newToken: string | null = changes["scoutWebToken"]["newValue"]
          ? changes["scoutWebToken"]["newValue"]
          : null;

        if (newToken) {
          setUpdatingUserDetails(true);

          const toStore = await retrieveUserBasicDetails({
            forwardAccessToken: newToken,
          });

          if (toStore.accessToken && toStore.userDetails) {
            const activeTab = await chrome.tabs.query({
              active: true,
              currentWindow: true,
            });
            const newUsername = retrieveLinkedinUsername(
              activeTab[0] && activeTab[0].url ? activeTab[0].url : null
            );

            batch(() => {
              dispatch(
                setAppSessionOrigin(toStore.sessionType ?? "scout_web_app")
              );
              dispatch(
                setUserBasicData({
                  accessToken: newToken ?? null,
                  consented: toStore.userConsent ?? false,
                  details: toStore.userDetails,
                })
              );
              dispatch(setUserJobList(toStore.jobs));

              if (newUsername) {
                dispatch(
                  setProfileDetails({
                    username: null,
                    details: null,
                  })
                );
                dispatch(setProfileLinkedinUsername(newUsername));
              } else {
                setUnrelatedPage(true);
              }
            });
          }
        } else {
          dispatch(setUserAccessToken(null));
        }

        setUpdatingUserDetails(false);
      }
    };

    chrome.storage.onChanged.addListener(callback);

    return () => chrome.storage.onChanged.removeListener(callback);
  }, [appInitialised, scoutAccessToken]);

  // Poll to refresh scout user details
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (
        authenticated &&
        appInitialised &&
        scoutAccessToken &&
        scoutUserDetails &&
        !updatingUserDetails
      ) {
        const toStore = await retrieveUserBasicDetails();

        batch(() => {
          dispatch(setAppSessionOrigin(toStore.sessionType ?? "scout_web_app"));
          dispatch(
            setUserBasicData({
              accessToken: toStore.accessToken ?? null,
              consented: toStore.userConsent ?? false,
              details: toStore.userDetails,
            })
          );
          dispatch(setUserJobList(toStore.jobs));
          dispatch(setInitialiseState(true));
        });
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    authenticated,
    appInitialised,
    scoutAccessToken,
    scoutUserDetails,
    updatingUserDetails,
  ]);

  // On chrome tab update (Navigating to another page, refreshing the page and etc.), update linkedin username state.
  useEffect(() => {
    const onTabUpdateCallback = async (
      tabId: number,
      tabInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      try {
        if (authenticated) {
          if (
            appInitialised &&
            tab.status === "complete" &&
            tabInfo.status === "complete" &&
            tab.url != undefined &&
            tab.active &&
            scoutAccessToken &&
            (tab.url.includes("linkedin.com/in") ||
              tab.url.includes("linkedin.com/talent"))
          ) {
            const { mainPathType, subPathType } = determinePath(tab.url);

            if (
              mainPathType === "public_profile" ||
              (mainPathType === "rps" &&
                (subPathType === "rps_hire_automatedSourcing_profile" ||
                  subPathType === "rps_hire_recruiterSearch_profile" ||
                  subPathType === "rps_search_profile" ||
                  subPathType === "rps_hire_profile" ||
                  subPathType === "rps_profile"))
            ) {
              setUnrelatedPage(false);
              setErrorRetry(false);

              const newUsername = retrieveLinkedinUsername(tab.url);

              batch(() => {
                if (linkedinUsername !== newUsername) {
                  dispatch(
                    setProfileDetails({
                      username: null,
                      details: null,
                    })
                  );
                }
                dispatch(setProfileLinkedinUsername(newUsername));
              });
            } else {
              setUnrelatedPage(true);
              setErrorRetry(false);
              setRetrievingProfileData(false);
            }
          } else if (
            appInitialised &&
            tab.status === "complete" &&
            scoutAccessToken &&
            tabInfo.status === "complete" &&
            !(
              tab.url.includes("linkedin.com/in") ||
              tab.url.includes("linkedin.com/talent")
            )
          ) {
            setUnrelatedPage(true);
            setErrorRetry(false);
            setRetrievingProfileData(false);
          }
        }
      } catch (err) {}
    };

    chrome.tabs.onUpdated.addListener(onTabUpdateCallback);

    return () => chrome.tabs.onUpdated.removeListener(onTabUpdateCallback);
  }, [
    authenticated,
    appInitialised,
    scoutAccessToken,
    linkedinUsername,
    retrievingProfileData,
    unrelatedPage,
  ]);

  // If username is updated, set retrieve profile data set to true to trigger retrieving profile data function
  useEffect(() => {
    if (authenticated && linkedinUsername && !retrievingProfileData) {
      setRetrievingProfileData(true);
      dispatch(setSelectedJobMatchingId(null));
    }
  }, [linkedinUsername]);

  useEffect(() => {
    const callbackUsingApi = async () => {
      try {
        await delay(1000, null);

        const newProfileData = await retrieveProfileDataUsingApi({
          access_token: scoutAccessToken,
          username: linkedinUsername,
        });

        if (newProfileData) {
          dispatch(
            setProfileDetails({
              username: linkedinUsername,
              details: newProfileData ?? null,
            })
          );
          setRetrievingProfileData(false);
        } else {
          triggrRetryAttempt();
        }
      } catch (error) {
        await showErrorRetryScreen();
      }
    };

    const callbackUsingSSE = async () => {
      try {
        await retrieveProfileData({
          access_token: scoutAccessToken,
          username: linkedinUsername,
        });
      } catch (error) {
        await showErrorRetryScreen();
      }
    };

    if (authenticated && linkedinUsername && retrievingProfileData) {
      callbackUsingSSE();
    }
  }, [retrievingProfileData]);

  useEffect(() => {
    const callback = async () => {
      let newProfileData: STORED_CANDIDATE_DATA_TYPE = null;

      for (const index_ of Array.from(
        Array(retryAttempt.remainingAttempts).keys()
      )) {
        await delay(5000, null);

        newProfileData = await retrieveProfileDataUsingApi({
          access_token: scoutAccessToken,
          username: linkedinUsername,
        });

        if (newProfileData) break;
      }

      resetRetryAttempt();

      if (!newProfileData) {
        await showErrorRetryScreen();
      } else {
        dispatch(
          setProfileDetails({
            username: linkedinUsername,
            details: newProfileData ?? null,
          })
        );
        setRetrievingProfileData(false);
      }
    };

    if (
      authenticated &&
      retryAttempt.active &&
      retryAttempt.remainingAttempts > 0
    ) {
      callback();
    }
  }, [retryAttempt.active, retryAttempt.remainingAttempts]);

  const InitLoaderComp = useMemo(() => {
    return (
      <Fade in={!appInitialised} unmountOnExit>
        <Box>
          <InitialisingComp />
        </Box>
      </Fade>
    );
  }, [appInitialised]);

  const AppBarComp = useMemo(() => {
    return <AppBar loadingMode={retrievingProfileData} />;
  }, [retrievingProfileData]);

  const LoadingComp = useMemo(() => {
    return (
      <Fade
        in={
          appInitialised &&
          authenticated &&
          retrievingProfileData &&
          !errorRetry
        }
        unmountOnExit
      >
        <Box
          sx={{
            position: "absolute",
            px: 2,
            py: 2.5,
            zIndex: 3,
            height: "450px",
          }}
        >
          <GeneralLoadingComp />
        </Box>
      </Fade>
    );
  }, [appInitialised, authenticated, retrievingProfileData, errorRetry]);

  const ErrorRetryComp = useMemo(() => {
    return (
      <Fade in={appInitialised && authenticated && errorRetry} unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            height: 550,
            px: 2,
            py: 2.5,
            zIndex: 3,
          }}
        >
          <ErrorRetry show={errorRetry} retryCallback={retryButtonOnClick} />
        </Box>
      </Fade>
    );
  }, [appInitialised, authenticated, errorRetry, linkedinUsername]);

  const UnrelatedScreenComp = useMemo(() => {
    return (
      <Fade
        in={appInitialised && authenticated && appInitialised && unrelatedPage}
        unmountOnExit
      >
        <Box
          sx={{
            position: "absolute",
            px: 2,
            py: 2.5,
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              sx={{
                width: 280,
                mb: 2,
              }}
            >
              <img style={{ width: "100%" }} src={ErrorBg} />
            </Box>
            <Typography variant="body2" textAlign="center">
              {'You have successfully logged in to Scout. Use this plug-in to identify and reach out to suitable candidates as you browse through your network. To maximise your benefit, don\'t forget to load all your jobs into Scout.'}
              {/* {`You have successfully logged in to Scout. View a profile on `}
              <Typography
                component="span"
                color="primary"
                onClick={() => window.open(`https://www.linkedin.com/`)}
                sx={{
                  cursor: "grab",
                }}
              >
                {"LinkedIn"}
              </Typography>
              {` to get started.`} */}
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }, [appInitialised, authenticated, appInitialised, unrelatedPage]);

  const LoginScreenComp = useMemo(() => {
    return (
      <Fade
        in={appInitialised && !authenticated}
        unmountOnExit
        style={{ transitionDelay: !authenticated ? "250ms" : "0ms" }}
      >
        <Box
          sx={{
            position: "relative",
            px: 2,
            py: 2.5,
            zIndex: 2,
            mt: 3,
          }}
        >
          <LoginComp />
        </Box>
      </Fade>
    );
  }, [appInitialised, authenticated]);

  const NoConsentScreenComp = useMemo(() => {
    return (
      <Fade
        in={
          appInitialised && !authenticated && !consented && scoutAccessToken
            ? true
            : false
        }
        unmountOnExit
      >
        <Box
          sx={{
            position: "absolute",
            px: 2,
            py: 2.5,
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Box
              sx={{
                width: 280,
                mb: 2,
              }}
            >
              <img style={{ width: "100%" }} src={ErrorBg} />
            </Box>
            <Typography variant="body2" textAlign="center">
              {`Please accept our `}
              <Typography
                component="span"
                color="primary"
                onClick={() => window.open(`${SCOUT_WEB_URL}`)}
                sx={{
                  cursor: "grab",
                }}
                variant="body2"
              >
                {"terms & conditions"}
              </Typography>
              {" before using our chrome extension"}
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }, [appInitialised, authenticated, consented, scoutAccessToken]);

  const ProfileBasicDetailsComp = useMemo(() => {
    return (
      <Fade
        in={
          appInitialised &&
          consented &&
          authenticated &&
          profileData &&
          !unrelatedPage
            ? true
            : false
        }
        unmountOnExit
      >
        <Box
          sx={{
            position: "relative",
            px: 2,
            py: 2.5,
            zIndex: 2,
          }}
        >
          <ProfileBasicDetails />
        </Box>
      </Fade>
    );
  }, [appInitialised, consented, authenticated, profileData, unrelatedPage]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "450px",
      }}
    >
      {InitLoaderComp}
      <Fade in={appInitialised} unmountOnExit>
        <Box
          sx={{
            posiiton: "relative",
            height: "100%",
          }}
        >
          {AppBarComp}
          {LoadingComp}
          {ErrorRetryComp}
          {UnrelatedScreenComp}
          {LoginScreenComp}
          {NoConsentScreenComp}
          {ProfileBasicDetailsComp}
        </Box>
      </Fade>
    </Box>
  );
}

function delay(t, v) {
  return new Promise((resolve) => setTimeout(resolve, t, v));
}
