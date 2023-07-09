import { useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import * as Yup from "yup";
import { useDispatch, batch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { HeroIconContainer, StyledContactBox } from "../../common";
import ActiveMailIconLogo from "../../../assets/icons/mail_icon.webp";
import InactiveMailIconLogo from "../../../assets/icons/mail_icon_inactive.webp";
import DisabledMailIconLogo from "../../../assets/icons/mail_icon_disabled.webp";
import ActiveWhatsappLogo from "../../../assets/icons/whatsapp_icon.webp";
import InactiveWhatsappLogo from "../../../assets/icons/whatsapp_icon_inactive.webp";
import DisabledWhatsappLogo from "../../../assets/icons/whatsapp_icon_disabled.webp";
import {
  SCOUT_API_URL,
  UPGRADE_TO_PREMIUM_TEXT,
} from "../../../scripts/scout/settings";
import { useUpgradeToPremiumDialog } from "../../../hooks/useUpgradeToPremiumDialog";
import { ShowMoreButton } from "../../common/customContainer";
import { useSessionUser } from "../../../hooks/useSessionUser";
import { fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApi } from "../../../api/scout/candidate/fetch";
import { setProfileDetails } from "../../../redux/profile/profileSlice";
import { RequestContactBtn } from "../../common/customButton";
import { fetchSessionUserData } from "../../../api/scout/user/fetch";
import { updateUserDetails } from "../../../redux/user/userSlice";

export default function ProfileContactDetails() {
  const dispatch = useDispatch();

  const { isUserSubscribed, accessToken, credits } = useSessionUser();
  const {
    profileData,
    emails,
    phones,
    detailsMasked,
    linkedinUsername,
    profileId,
  } = useProfileDetails();

  const { openUpgradeToPremiumDialog } = useUpgradeToPremiumDialog();

  const [showMoreEmails, setShowMoreEmails] = useState<boolean>(false);
  const [showMorePhoneNumbers, setShowMorePhoneNumbers] =
    useState<boolean>(false);
  const [generalFetching, setGeneralFetching] = useState<boolean>(false);
  const [retrievingPhone, setRetrievingPhone] = useState<boolean>(false);
  const [retrievingEmail, setRetrievingEmail] = useState<boolean>(false);

  const allowAccessToContactFeatures = isUserSubscribed && credits > 0;

  // Switch to enable request contact details functionality
  const allowRequestFeature = true;

  const showUpgradePreiumPopup = useCallback(async (featureName?: string) => {
    await openUpgradeToPremiumDialog({
      callbackFunc: {
        proceed: async () => {},
        cancel: () => {},
      },
    });
  }, []);

  const overallContactsOnClick = useCallback(
    (show: boolean) => {
      if (!detailsMasked) {
        setShowMoreEmails(show);
        setShowMorePhoneNumbers(show);
      }
    },
    [detailsMasked]
  );

  const filteredCandidateEmails = useMemo(() => {
    return emails
      .map((item) => {
        const invalidEmail =
          !item ||
          item.replace(/\s/g, "") === "" ||
          !Yup.string().email().isValidSync(item);

        return !invalidEmail ? item : null;
      })
      .filter((item) => item !== null);
  }, [emails]);

  const filteredPhoneNumbers = useMemo(() => {
    return phones
      .map((item) => {
        const number = item;

        if (number) {
          const isValidPhoneNumber =
            number !== "-" &&
            number.replace(/[^\w\s]/gi, "").replace(/\s/g, "") !== "";

          return isValidPhoneNumber ? number : null;
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
  }, [emails]);

  let displayedEmails = filteredCandidateEmails;
  let displayedPhoneNumbers = filteredPhoneNumbers;

  const emailMoreThanInitialEmailCount =
    displayedEmails.length > initialShownEmailCount;
  const phoneNumbersMoreThanInitialPhoneNumberCount =
    displayedPhoneNumbers.length > initialShownPhoneNumberCount;

  if (
    !showMoreEmails &&
    displayedEmails.length > 0 &&
    emailMoreThanInitialEmailCount
  ) {
    displayedEmails = displayedEmails.slice(0, initialShownEmailCount);
  }

  if (
    !showMorePhoneNumbers &&
    displayedPhoneNumbers.length > 0 &&
    phoneNumbersMoreThanInitialPhoneNumberCount
  ) {
    displayedPhoneNumbers = displayedPhoneNumbers.slice(
      0,
      initialShownPhoneNumberCount
    );
  }

  const retrieveProfileDataUsingApi = useCallback(
    async (args: { accessToken_: string; username: string }) => {
      const { accessToken_ = null, username = null } = args;

      try {
        const responseData =
          await fetchPublicProfileBasedOnLinkedinUsernameUsingfetchApi({
            access_token: accessToken_,
            linkedinUsername: username,
          });

        return responseData;
      } catch (error) {
        return null;
      }
    },
    []
  );

  const sseRetrieveContactDetails = useCallback(
    async (args: {
      accessToken_: string;
      username: string;
      profileId_?: string;
      fieldToRetrieve?: "email" | "phone" | "all";
    }) => {
      const {
        accessToken_ = null,
        username = null,
        profileId_ = null,
        fieldToRetrieve = "all",
      } = args;

      try {
        if (!accessToken_ || !username) {
          throw "No access token or username";
        }

        setLoadingStates(fieldToRetrieve ?? "all", true);

        await fetchEventSource(
          `${SCOUT_API_URL}api/scout/data/extension/contact_details/reveal/${profileId_}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken_}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              username: username,
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
            onmessage(event) {
              try {
                const eventType = event.event;
              } catch (error) {
                throw error;
              }
            },
            async onclose() {
              // "Connection closed by the server"
              const newProfileData = await retrieveProfileDataUsingApi({
                accessToken_: accessToken,
                username: linkedinUsername,
              });

              const retrieveScoutUserDetailsResponse =
                await fetchSessionUserData({
                  access_token: accessToken,
                });

              if (newProfileData) {
                batch(() => {
                  dispatch(
                    updateUserDetails(retrieveScoutUserDetailsResponse.userData)
                  );
                  dispatch(
                    setProfileDetails({
                      username: linkedinUsername,
                      details: newProfileData ?? null,
                    })
                  );
                });
              }

              setLoadingStates(fieldToRetrieve ?? "all", false);
            },
            onerror(err) {
              setLoadingStates(fieldToRetrieve ?? "all", false);
            },
          }
        );
      } catch (error) {
        setLoadingStates(fieldToRetrieve ?? "all", false);
      }
    },
    []
  );

  const setLoadingStates = (
    fieldToRetrieve: "email" | "phone" | "all",
    fetching?: boolean
  ) => {
    if (fieldToRetrieve === "email") {
      setRetrievingEmail(fetching ?? false);
    } else if (fieldToRetrieve === "phone") {
      setRetrievingPhone(fetching ?? false);
    } else {
      setGeneralFetching(fetching ?? false);
    }
  };

  const requestContactDetailsSignalHire = async (
    fieldToRetrieve?: "email" | "phone" | "all"
  ) => {
    try {
      if (!allowAccessToContactFeatures) {
        showUpgradePreiumPopup();
      } else {
        await sseRetrieveContactDetails({
          accessToken_: accessToken,
          username: linkedinUsername,
          profileId_: profileId ?? null,
          fieldToRetrieve: fieldToRetrieve ?? "all",
        });
      }
    } catch (err) {}
  };

  const RequestContactDetails = useMemo(() => {
    const requestContactBtnOnClick = async () => {
      try {
        if (!allowAccessToContactFeatures) {
          showUpgradePreiumPopup();
        } else {
          requestContactDetailsSignalHire();
        }
      } catch (err) {}
    };

    return allowRequestFeature ? (
      <Box>
        <RequestContactBtn
          mode="request"
          disabled={generalFetching || retrievingPhone || retrievingEmail}
          onClick={requestContactBtnOnClick}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {!generalFetching && !retrievingPhone && !retrievingEmail ? (
              <HeroIconContainer width={iconSize} color="inherit">
                {allowAccessToContactFeatures ? (
                  <ManageSearchIcon
                    sx={{
                      height: iconSize,
                    }}
                  />
                ) : (
                  <LockClosedIcon />
                )}
              </HeroIconContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <CircularProgress color="inherit" size={iconSize} />
              </Box>
            )}
            <Typography variant="inherit" textAlign="left">
              {`${
                retrievingEmail || generalFetching
                  ? "Check back in 60 seconds"
                  : "Request contact details"
              }`}
            </Typography>
          </Stack>
        </RequestContactBtn>
      </Box>
    ) : null;
  }, [
    displayedEmails,
    displayedPhoneNumbers,
    allowAccessToContactFeatures,
    generalFetching,
    retrievingPhone,
    retrievingEmail,
    allowRequestFeature,
    linkedinUsername,
    accessToken,
    profileId,
  ]);

  const EmailContactBox = useMemo(() => {
    const requestEmailOnClick = async () => {
      try {
        if (!allowAccessToContactFeatures) {
          showUpgradePreiumPopup();
        } else {
          requestContactDetailsSignalHire("email");
        }
      } catch (err) {}
    };

    return (
      <>
        {displayedEmails.length > 0 ? (
          displayedEmails.map((item, index) => {
            const invalidEmail =
              !item || item === "-" || item.replace(/\s/g, "") === "";

            const passed = !invalidEmail && item ? true : false;

            return (
              <Grid item key={index}>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <StyledContactBox
                    active={true}
                    href={
                      passed && allowAccessToContactFeatures
                        ? `mailto:${item}`
                        : null
                    }
                    target={passed ? "_blank" : "_self"}
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                    }}
                    onClick={requestEmailOnClick}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Box sx={{ display: "flex" }}>
                        <img
                          src={
                            !allowAccessToContactFeatures
                              ? DisabledMailIconLogo
                              : passed
                              ? ActiveMailIconLogo
                              : InactiveMailIconLogo
                          }
                          style={{
                            width: 16,
                            height: 16,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          maxWidth: 250,
                          lineHeight: 1,
                        }}
                      >
                        <Tooltip
                          title={
                            !allowAccessToContactFeatures
                              ? UPGRADE_TO_PREMIUM_TEXT
                              : item
                              ? item
                              : "Email not available"
                          }
                        >
                          <Typography
                            variant="caption"
                            noWrap
                            variantMapping={{
                              caption: "p",
                            }}
                            sx={{
                              lineHeight: 1,
                              color: (theme) =>
                                item
                                  ? theme.customPalette.grey.base
                                  : "inherit",
                            }}
                          >
                            {item
                              ? allowAccessToContactFeatures
                                ? item
                                : item.replace(/./g, "*")
                              : "-"}
                          </Typography>
                        </Tooltip>
                      </Box>
                      {!allowAccessToContactFeatures && (
                        <Box
                          sx={{
                            color: (theme) => theme.customPalette.grey.dim,
                            pb: "1px",
                          }}
                        >
                          <HeroIconContainer width={13} color={"inherit"}>
                            <LockClosedIcon />
                          </HeroIconContainer>
                        </Box>
                      )}
                    </Stack>
                  </StyledContactBox>
                  {emailMoreThanInitialEmailCount &&
                    index === 0 &&
                    !showMoreEmails && (
                      <Box>
                        <Tooltip
                          title={
                            !allowAccessToContactFeatures &&
                            emailMoreThanInitialEmailCount
                              ? "Reveal recommendation to view all contact information"
                              : null
                          }
                        >
                          <ShowMoreButton
                            size="small"
                            onClick={() => overallContactsOnClick(true)}
                            showMoreColor={
                              !allowAccessToContactFeatures &&
                              emailMoreThanInitialEmailCount
                            }
                          >
                            {!showMoreEmails && emailMoreThanInitialEmailCount
                              ? `+${
                                  filteredCandidateEmails.length -
                                  initialShownEmailCount
                                } more`
                              : "less"}
                          </ShowMoreButton>
                        </Tooltip>
                      </Box>
                    )}
                </Box>
              </Grid>
            );
          })
        ) : allowRequestFeature ? (
          <Grid item>
            <RequestContactBtn
              mode="request"
              disabled={generalFetching || retrievingEmail}
              onClick={requestEmailOnClick}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {!generalFetching && !retrievingEmail ? (
                  <HeroIconContainer width={iconSize} color="inherit">
                    {allowAccessToContactFeatures ? (
                      <ManageSearchIcon
                        sx={{
                          height: iconSize,
                        }}
                      />
                    ) : (
                      <LockClosedIcon />
                    )}
                  </HeroIconContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <CircularProgress color="inherit" size={iconSize} />
                  </Box>
                )}
                <Typography variant="inherit" textAlign="left">
                  {`${
                    retrievingEmail || generalFetching
                      ? "Check back in 60 seconds"
                      : "Request email"
                  }`}
                </Typography>
              </Stack>
            </RequestContactBtn>
          </Grid>
        ) : null}
      </>
    );
  }, [
    displayedEmails,
    showMoreEmails,
    filteredCandidateEmails,
    initialShownEmailCount,
    emailMoreThanInitialEmailCount,
    allowAccessToContactFeatures,
    detailsMasked,
    generalFetching,
    retrievingEmail,
    allowRequestFeature,
    linkedinUsername,
    accessToken,
    profileId,
  ]);

  const PhoneNumberContactBox = useMemo(() => {
    const requestPhoneNumbOnClick = async () => {
      try {
        if (!allowAccessToContactFeatures) {
          showUpgradePreiumPopup();
        } else {
          requestContactDetailsSignalHire("phone");
        }
      } catch (err) {}
    };

    return (
      <>
        {displayedPhoneNumbers.length > 0 ? (
          displayedPhoneNumbers.map((item, index) => {
            const invalidPhoneNumber =
              !item || item === "-" || item.replace(/\s/g, "") === "";

            const passed = !invalidPhoneNumber && item ? true : false;

            return (
              <Grid item key={index}>
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <StyledContactBox
                    active={true}
                    href={
                      passed && allowAccessToContactFeatures
                        ? `https://wa.me/${item.replace(/\s/g, "")}`
                        : null
                    }
                    target={invalidPhoneNumber ? "_self" : "_blank"}
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                    }}
                    onClick={requestPhoneNumbOnClick}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Box sx={{ display: "flex" }}>
                        <img
                          src={
                            !allowAccessToContactFeatures
                              ? DisabledWhatsappLogo
                              : passed
                              ? ActiveWhatsappLogo
                              : InactiveWhatsappLogo
                          }
                          style={{
                            width: 16,
                            height: 16,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          maxWidth: 250,
                          lineHeight: 1,
                        }}
                      >
                        <Tooltip
                          title={
                            !allowAccessToContactFeatures
                              ? UPGRADE_TO_PREMIUM_TEXT
                              : item
                              ? item
                              : "Phone number not available"
                          }
                        >
                          <Typography
                            variant="caption"
                            noWrap
                            variantMapping={{
                              caption: "p",
                            }}
                            sx={{
                              lineHeight: 1,
                              color: (theme) =>
                                item
                                  ? theme.customPalette.grey.base
                                  : "inherit",
                            }}
                          >
                            {item
                              ? allowAccessToContactFeatures
                                ? item
                                : item.replace(/./g, "*")
                              : "-"}
                          </Typography>
                        </Tooltip>
                      </Box>
                      {!allowAccessToContactFeatures && (
                        <Box
                          sx={{
                            color: (theme) => theme.customPalette.grey.dim,
                            pb: "1px",
                          }}
                        >
                          <HeroIconContainer width={13} color={"inherit"}>
                            <LockClosedIcon />
                          </HeroIconContainer>
                        </Box>
                      )}
                    </Stack>
                  </StyledContactBox>
                  {phoneNumbersMoreThanInitialPhoneNumberCount &&
                    index === 0 &&
                    !showMorePhoneNumbers && (
                      <Box>
                        <Tooltip
                          title={
                            !detailsMasked &&
                            phoneNumbersMoreThanInitialPhoneNumberCount
                              ? "Reveal recommendation to view all contact information"
                              : null
                          }
                        >
                          <ShowMoreButton
                            size="small"
                            onClick={() => overallContactsOnClick(true)}
                            showMoreColor={
                              !detailsMasked &&
                              phoneNumbersMoreThanInitialPhoneNumberCount
                            }
                          >
                            {!showMorePhoneNumbers &&
                            phoneNumbersMoreThanInitialPhoneNumberCount
                              ? `+${
                                  filteredPhoneNumbers.length -
                                  initialShownPhoneNumberCount
                                } more`
                              : "less"}
                          </ShowMoreButton>
                        </Tooltip>
                      </Box>
                    )}
                </Box>
              </Grid>
            );
          })
        ) : allowRequestFeature ? (
          <Grid item>
            <RequestContactBtn
              mode="request"
              disabled={generalFetching || retrievingPhone}
              onClick={requestPhoneNumbOnClick}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {!generalFetching && !retrievingPhone ? (
                  <HeroIconContainer width={iconSize} color="inherit">
                    {allowAccessToContactFeatures ? (
                      <ManageSearchIcon
                        sx={{
                          height: iconSize,
                        }}
                      />
                    ) : (
                      <LockClosedIcon />
                    )}
                  </HeroIconContainer>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <CircularProgress color="inherit" size={iconSize} />
                  </Box>
                )}
                <Typography variant="inherit" textAlign="left">
                  {`${
                    retrievingPhone || generalFetching
                      ? "Check back in 60 seconds"
                      : "Request phone number"
                  }`}
                </Typography>
              </Stack>
            </RequestContactBtn>
          </Grid>
        ) : null}
      </>
    );
  }, [
    displayedPhoneNumbers,
    showMorePhoneNumbers,
    filteredPhoneNumbers,
    initialShownPhoneNumberCount,
    phoneNumbersMoreThanInitialPhoneNumberCount,
    allowAccessToContactFeatures,
    detailsMasked,
    generalFetching,
    retrievingPhone,
    allowRequestFeature,
    linkedinUsername,
    accessToken,
    profileId,
  ]);

  const ShowMoreBox = useMemo(() => {
    return showMoreEmails || showMorePhoneNumbers ? (
      <Grid item>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: socialMediaLogoHeight,
          }}
        >
          <ShowMoreButton
            size="small"
            onClick={() => overallContactsOnClick(false)}
            showMoreColor={!(showMoreEmails || showMorePhoneNumbers)}
          >
            {"less"}
          </ShowMoreButton>
        </Box>
      </Grid>
    ) : null;
  }, [showMoreEmails, showMorePhoneNumbers]);

  return (
    <Box>
      <Grid container alignItems="center" spacing={1}>
        {displayedEmails.length === 0 && displayedPhoneNumbers.length === 0 ? (
          <Grid item>{RequestContactDetails}</Grid>
        ) : (
          <>
            {EmailContactBox}
            {PhoneNumberContactBox}
            {ShowMoreBox}
          </>
        )}
      </Grid>
    </Box>
  );
}

const iconSize = 16;
const initialShownEmailCount = 1;
const initialShownPhoneNumberCount = 1;
const socialMediaLogoHeight = 30;
