import { useState, useEffect, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";

import { useShortlistDialog } from "../../../hooks/useShortlistDialog";
import { CustomSnackbar, MainButton, MaterialDropdown } from "../../common";
import { fetchJobList } from "../../../api/scout/user/fetch";
import { NORMALISED_JOB_LISTING_DATA_TYPE } from "../../../typescript/types/job";
import { shortlistCandidate } from "../../../api/scout/candidate/update";
import { Typography } from "@mui/material";
import { fetchProfileShortlistedJobIds } from "../../../api/scout/candidate/fetch";
import { useSessionUser } from "../../../hooks/useSessionUser";
import { useProfileDetails } from "../../../hooks/useProfileDetails";

/**
 * @desc The confirmation dialog component for any alert or confirmation pop up.
 * - [Material UI Dialog documentation](https://mui.com/material-ui/react-dialog/#main-content)
 * - [Material UI Dialog API documentation](https://mui.com/material-ui/api/dialog/)
 */
export default function ShortlistDialog() {
  const { enqueueSnackbar } = useSnackbar();

  const { show, mode, callbackFunctions, closeShortlistDialog } =
    useShortlistDialog();
  const { profileData } = useProfileDetails();
  const { accessToken } = useSessionUser();

  const [userJobList, setUserJobList] =
    useState<NORMALISED_JOB_LISTING_DATA_TYPE>({});
  const [fetchingUserJobList, setfetchingUserJobList] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [chosenJobId, setChosenJobId] = useState<string>(null);
  const [failedToFetch, setFailedToFetch] = useState<boolean>(false);
  const [profileShortlistedJobIds, setProfileShortlistedJobIds] = useState<
    string[]
  >([]);

  const currentUserSessionToken = accessToken;
  const candidateProfileId =
    profileData && profileData && profileData.profile_id
      ? profileData.profile_id
      : null;
  const candidateName =
    profileData &&
    profileData &&
    profileData.profile &&
    profileData.profile.name
      ? profileData.profile.name
      : "";

  const fetchList = async (access_token?: string) => {
    const { jobList } = await fetchJobList({
      access_token: access_token,
    });

    if (profileData && profileData && profileData.profile_id) {
      const { shortlisted_job_ids } = await fetchProfileShortlistedJobIds({
        access_token: access_token,
        profileId: profileData.profile_id,
      });

      setProfileShortlistedJobIds(shortlisted_job_ids);
    }

    setUserJobList(jobList);
  };

  useEffect(() => {
    if (currentUserSessionToken && failedToFetch) {
      setFailedToFetch(false);
    }
  }, [currentUserSessionToken]);

  useEffect(() => {
    const callback_ = async () => {
      try {
        if (show) {
          if (currentUserSessionToken) {
            if (!fetchingUserJobList) {
              setfetchingUserJobList(true);
            }

            await fetchList(currentUserSessionToken);

            setfetchingUserJobList(false);
          } else {
            setFailedToFetch(true);
          }
        } else {
          if (!fetchingUserJobList) {
            setTimeout(() => {
              setProfileShortlistedJobIds([]);

              setfetchingUserJobList(true);

              if (chosenJobId) {
                setChosenJobId(null);
              }

              if (saving) {
                setSaving(false);
              }
            }, 1000);
          }
          if (failedToFetch) {
            setFailedToFetch(false);
          }
        }
      } catch (error) {
        setFailedToFetch(true);
        setfetchingUserJobList(false);
      }
    };

    callback_();
  }, [show]);

  /**
   * @desc Function to close dialog
   */
  const handleClose = () => {
    closeShortlistDialog();
  };

  /**
   * @desc Callback function when user clicks proceed button
   */
  const proceedOnClick = async () => {
    try {
      if (!currentUserSessionToken || !candidateProfileId) {
        throw "No session or invalid profile id";
      }

      if (chosenJobId) {
        setSaving(true);

        await shortlistCandidate({
          access_token: currentUserSessionToken,
          job_id: chosenJobId,
          profile_id: candidateProfileId,
        });

        const specificJob =
          userJobList && Object.keys(userJobList).length > 0
            ? userJobList[chosenJobId]
            : null;

        enqueueSnackbar(
          `${candidateName ? candidateName : "Candidate"} shortlisted${
            specificJob ? ` (${specificJob.job_title})` : ""
          }`,
          {
            variant: "success",
            content: (key, message) => (
              <CustomSnackbar id={key} message={message} variant={"success"} />
            ),
          }
        );
      }
    } catch (error) {
      enqueueSnackbar(
        `Failed to shortlist ${candidateName ? candidateName : "Candidate"}`,
        {
          variant: "error",
          content: (key, message) => (
            <CustomSnackbar id={key} message={message} variant={"error"} />
          ),
        }
      );
    }

    handleClose();
  };

  /**
   * @desc Callback function when user clicks cancel button
   */
  const cancelOnClick = async () => {
    if (callbackFunctions.cancel !== null) {
      await callbackFunctions.cancel();
    }

    handleClose();
  };

  const JobDropDown = useMemo(() => {
    const handleDropdownOnChange = (event) => {
      setChosenJobId(event.target.value);
    };

    return fetchingUserJobList ? (
      <Stack spacing={1}>
        <CustomSkeleton variant="rectangular" width={110} height={17} />
        <CustomSkeleton variant="rectangular" width={"100%"} height={32} />
      </Stack>
    ) : (
      <MaterialDropdown
        label="Choose from job list."
        placeholder="Jobs"
        value={chosenJobId}
        onChange={handleDropdownOnChange}
        menuItems={[
          {
            label: "All Jobs",
            value: null,
          },
          ...Object.keys(userJobList)
            .sort((a, b) => {
              const a_ = !profileShortlistedJobIds.includes(a) ? 0 : 1;

              const b_ = !profileShortlistedJobIds.includes(b) ? 0 : 1;

              if (a_ > b_) {
                return 1;
              }

              if (a_ < b_) {
                return -1;
              }
              return 0;
            })
            .map((jobId) => {
              const specificJob = userJobList[jobId];

              const alreadyShortlisted = specificJob
                ? profileShortlistedJobIds.includes(jobId)
                : false;

              return specificJob
                ? {
                    label: `${specificJob.job_title} (${
                      specificJob.company_name
                    })${alreadyShortlisted ? " (Shortlisted)" : ""}`,
                    value: jobId,
                    disabled: alreadyShortlisted,
                  }
                : null;
            })
            .filter((item) => item !== null),
        ]}
        SelectProps={{
          native: true,
        }}
        name="job"
        rotation="column"
        fullWidth
        sx={{
          "& .MuiInputBase-root": {
            maxHeight: "32px",
          },
        }}
      />
    );
  }, [fetchingUserJobList, chosenJobId, userJobList, profileShortlistedJobIds]);

  return (
    <StyledDialog
      open={show}
      onClose={cancelOnClick}
      aria-labelledby="shortlist-dialog-title"
      aria-describedby="shortlist-dialog-description"
      fullWidth
    >
      <StyledDialogTitle id="shortlist-dialog-title" variant="h6">
        {mode === "shortlist"
          ? `Shortlist ${candidateName}`
          : `Remove ${candidateName} from job's shortlist`}
      </StyledDialogTitle>
      <StyledDialogContent>
        <Box>
          {!failedToFetch ? (
            JobDropDown
          ) : (
            <Typography variant="body2">
              Failed to retirve job list. Please try again
            </Typography>
          )}
        </Box>
      </StyledDialogContent>
      <StyledDialogActions>
        <MainButton variant="text" onClick={cancelOnClick}>
          {!failedToFetch ? `Cancel` : "Close"}
        </MainButton>
        {!failedToFetch && (
          <MainButton
            sx={{ py: 1 }}
            onClick={proceedOnClick}
            disabled={fetchingUserJobList || !chosenJobId || saving}
            startIcon={
              saving ? <CircularProgress color="inherit" size={16} /> : null
            }
          >
            {`Save`}
          </MainButton>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    boxShadow: "none",
    border: `1px solid ${theme.customPalette.grey.light_grey}`,
    borderRadius: 6,
    overflow: "hidden",
    padding: "24px",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "bold",
  padding: 0,
  paddingBottom: theme.spacing(2),
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: `${theme.spacing(2)} 0`,
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.customPalette.grey.base,
  padding: 0,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: `0`,
  paddingTop: theme.spacing(2),
}));

const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.customPalette.grey.light_grey,
}));
