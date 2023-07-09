import { useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  LockClosedIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import _ from "lodash";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { REDUX_ROOT_STATE } from "../../../redux/store";
import { useEngageCandidateDialog } from "../../../hooks/useEngageCandidateDialog";
import { useUpgradeToPremiumDialog } from "../../../hooks/useUpgradeToPremiumDialog";
import { outlookInitialConversationWithCandidate } from "../../../api/scout/candidate/create";
import { fetchPublicProfileBasedOnLinkedinUsername } from "../../../api/scout/candidate/fetch";
import { CustomSnackbar, HeroIconContainer } from "../../common";
import { setProfileDetails } from "../../../redux/profile/profileSlice";
import { useSessionUser } from "../../../hooks/useSessionUser";

export default function ProfileEngageButton() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { profileData } = useProfileDetails();
  const { isUserSubscribed } = useSessionUser();
  const { openEngageCandidateDialog } = useEngageCandidateDialog();
  const { openUpgradeToPremiumDialog } = useUpgradeToPremiumDialog();

  const scoutAccessToken = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["accessToken"]
  >((state) => state.user.accessToken, shallowEqual);
  const selectedJobMatching = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["interface"]["selectedJobMatchingId"]
  >((state) => state.user.interface.selectedJobMatchingId, shallowEqual);
  const linkedinUsername = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["username"]["linkedin"]
  >((state) => state.profile.username.linkedin, shallowEqual);

  const showUpgradePreiumPopup = useCallback(async (featureName?: string) => {
    await openUpgradeToPremiumDialog({
      callbackFunc: {
        proceed: async () => {},
        cancel: () => {},
      },
    });
  }, []);

  if (
    !profileData ||
    !selectedJobMatching ||
    (profileData && !profileData.profile.email)
  ) {
    return null;
  }

  const findInCandidateJob =
    profileData &&
    profileData.jobs &&
    profileData.jobs.length > 0 &&
    selectedJobMatching !== undefined &&
    selectedJobMatching !== null
      ? _.find(profileData.jobs, (o) => o.job.id === selectedJobMatching)
      : null;

  const nurturingInProgress =
    findInCandidateJob &&
    "nurturing_campaign" in findInCandidateJob &&
    findInCandidateJob.nurturing_campaign &&
    Object.keys(findInCandidateJob.nurturing_campaign).length > 0;

  const currentEmailStep = nurturingInProgress
    ? findInCandidateJob.nurturing_campaign.email_step_3 &&
      findInCandidateJob.nurturing_campaign.email_step_3.sent &&
      findInCandidateJob.nurturing_campaign.email_step_3.to_send_at
      ? 3
      : findInCandidateJob.nurturing_campaign.email_step_2 &&
        findInCandidateJob.nurturing_campaign.email_step_2.sent &&
        findInCandidateJob.nurturing_campaign.email_step_2.to_send_at
      ? 2
      : findInCandidateJob.nurturing_campaign.email_step_1 &&
        findInCandidateJob.nurturing_campaign.email_step_1.sent &&
        findInCandidateJob.nurturing_campaign.email_step_1.to_send_at
      ? 1
      : 1
    : 0;

  const currentStepEmailInQueue =
    nurturingInProgress && currentEmailStep > 0
      ? !findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
          .is_stale &&
        !findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
          .sent
      : false;

  const currentStepStaled = currentStepEmailInQueue
    ? false
    : currentEmailStep &&
      findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
    ? findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
        .is_stale
    : false;

  const currentEmailStepToSentAtMoment =
    nurturingInProgress &&
    findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`] &&
    findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
      .to_send_at
      ? moment
          .utc(
            findInCandidateJob.nurturing_campaign[
              `email_step_${currentEmailStep}`
            ].to_send_at
          )
          .local()
      : null;

  const engageCandidateEmailMessage = currentStepEmailInQueue
    ? `Email is in queue (3:30pm - 4:25pm)`
    : currentEmailStep &&
      findInCandidateJob.nurturing_campaign[`email_step_${currentEmailStep}`]
    ? currentStepStaled
      ? `Engagement staled`
      : `${
          currentEmailStepToSentAtMoment ? "Engagement Sent on " : ""
        }${currentEmailStepToSentAtMoment.format(
          "DD MMM YY"
        )} (${currentEmailStep} of 3)`
    : null;

  const engageCandidateOnClick = async () => {
    if (isUserSubscribed) {
      if (findInCandidateJob && scoutAccessToken) {
        await openEngageCandidateDialog({
          callbackFunc: {
            proceed: async () => {
              try {
                await outlookInitialConversationWithCandidate({
                  access_token: scoutAccessToken,
                  recommendation_id: findInCandidateJob.recommendation_id,
                });

                const response =
                  await fetchPublicProfileBasedOnLinkedinUsername({
                    access_token: scoutAccessToken,
                    linkedinUsername: linkedinUsername,
                  });

                dispatch(
                  setProfileDetails({
                    details: response,
                  })
                );

                enqueueSnackbar("Engagement email sent.", {
                  variant: "success",
                  content: (key, message) => (
                    <CustomSnackbar
                      id={key}
                      message={message}
                      variant={"success"}
                    />
                  ),
                });
              } catch (error) {
                enqueueSnackbar(`Failed to send engagement email.`, {
                  variant: "error",
                  content: (key, message) => (
                    <CustomSnackbar
                      id={key}
                      message={message}
                      variant={"error"}
                    />
                  ),
                });
              }
            },
            cancel: async () => {},
          },
          recommendationId: findInCandidateJob.recommendation_id,
          sessionData: null,
          // sessionData: {
          //   details: sessionDetails,
          //   scoutAccessToken: scoutAccessToken,
          //   refresh_token: null,
          //   updated_at: null,
          //   created_at: null,
          // },
        });
      }
    } else {
      showUpgradePreiumPopup();
    }
  };

  return engageCandidateEmailMessage ? (
    <Box
      sx={{
        flexBasis: "50%",
        maxWidth: "50%",
        color: (theme) =>
          currentStepStaled
            ? theme.palette.error.main
            : theme.palette.success.main,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box>
          <HeroIconContainer width={20} color="inherit">
            {currentStepStaled ? <XCircleIcon /> : <CheckBadgeIcon />}
          </HeroIconContainer>
        </Box>
        <Box>
          <Typography
            variant="caption"
            color="inherit"
            sx={{
              lineHeight: 1,
            }}
          >
            {engageCandidateEmailMessage}
          </Typography>
        </Box>
      </Stack>
    </Box>
  ) : (
    <Box
      sx={{
        flexBasis: "50%",
        maxWidth: "50%",
      }}
    >
      <Button
        color="success"
        variant="contained"
        disableFocusRipple
        sx={{
          color: (theme) =>
            isUserSubscribed ? "white" : theme.customPalette.grey.dim,
          textTransform: "none",
          bgcolor: (theme) =>
            isUserSubscribed
              ? theme.palette.success.main
              : theme.customPalette.grey.light_grey,
          fontWeight: isUserSubscribed ? "normal" : "bold",
          "&:hover": {
            bgcolor: (theme) =>
              isUserSubscribed
                ? theme.palette.success.main
                : theme.customPalette.grey.light_grey,
          },
        }}
        size="small"
        fullWidth
        disableElevation
        onClick={engageCandidateOnClick}
        endIcon={
          !isUserSubscribed ? (
            <HeroIconContainer width={13} color={"inherit"}>
              <LockClosedIcon />
            </HeroIconContainer>
          ) : null
        }
      >
        Engage Candidate
      </Button>
    </Box>
  );
}
