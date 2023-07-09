import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import _ from "lodash";
import { PencilSquareIcon as OutlinePencilSquareIcon } from "@heroicons/react/24/outline";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { useGenerateWriteUpDialog } from "../../../hooks/useGenerateWriteUpDialog";
import { REDUX_ROOT_STATE } from "../../../redux/store";
import { generateCandidateWriteUp } from "../../../api/scout/candidate/create";
import { CustomSnackbar, HeroIconContainer } from "../../common";
import { updateSpecificJobSummary } from "../../../redux/profile/profileSlice";

export default function ProfileGenerateSummaryButton() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { profileData } = useProfileDetails();
  const { openGenerateWriteUpDialog } = useGenerateWriteUpDialog();

  const scoutAccessToken = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["accessToken"]
  >((state) => state.user.accessToken, shallowEqual);
  const scoutUserDetails = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["details"]
  >((state) => state.user.details, shallowEqual);
  const selectedJobMatching = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["interface"]["selectedJobMatchingId"]
  >((state) => state.user.interface.selectedJobMatchingId, shallowEqual);

  const [disableGenerateWriteUpBtn, setDisableGenerateWriteUpBtn] =
    useState<boolean>(false);

  let findInCandidateJobIndex: number = null;

  const findInCandidateJob =
    profileData &&
    profileData.jobs &&
    profileData.jobs.length > 0 &&
    selectedJobMatching !== undefined &&
    selectedJobMatching !== null
      ? _.find(profileData.jobs, (o, index) => {
          if (o.job.id === selectedJobMatching) {
            findInCandidateJobIndex = index;

            return true;
          }

          return false;
        })
      : null;

  const generateSummary = async () => {
    try {
      if (findInCandidateJob) {
        setDisableGenerateWriteUpBtn(true);

        const generateCandidateWriteUpResponse = await generateCandidateWriteUp(
          {
            access_token: scoutAccessToken,
            recommended_candidate_id: findInCandidateJob.recommendation_id,
          }
        );

        if (!generateCandidateWriteUpResponse.candidateData.summary) {
          throw "Summary not generated";
        }

        dispatch(
          updateSpecificJobSummary({
            jobIndex: findInCandidateJobIndex,
            summary: generateCandidateWriteUpResponse.candidateData.summary,
          })
        );

        setDisableGenerateWriteUpBtn(false);

        enqueueSnackbar("Write-up successfully generated.", {
          variant: "success",
          content: (key, message) => (
            <CustomSnackbar id={key} message={message} variant={"success"} />
          ),
        });
      }
    } catch (error) {
      setDisableGenerateWriteUpBtn(false);

      enqueueSnackbar(`Failed to generate write-up. Please try again.`, {
        variant: "error",
        content: (key, message) => (
          <CustomSnackbar id={key} message={message} variant={"error"} />
        ),
      });
    }
  };

  const generateWriteUpBtnOnClick = async () => {
    if (findInCandidateJob) {
      if (scoutUserDetails && !scoutUserDetails.consented_summary_disclaimer) {
        await openGenerateWriteUpDialog({
          callbackFunc: {
            proceed: async () => {
              try {
                await generateSummary();
              } catch (error) {}
            },
            cancel: () => {},
          },
          recommendedCandidateId: findInCandidateJob.recommendation_id,
        });
      } else {
        generateSummary();
      }
    }
  };

  return findInCandidateJob && !findInCandidateJob.summary ? (
    <Box
      sx={{
        flexBasis: "50%",
        maxWidth: "50%",
      }}
    >
      <Button
        color="primary"
        sx={{
          textTransform: "none",
        }}
        size="small"
        fullWidth
        disableElevation
        endIcon={
          <HeroIconContainer width={20} color="inherit">
            <OutlinePencilSquareIcon />
          </HeroIconContainer>
        }
        onClick={generateWriteUpBtnOnClick}
        disabled={disableGenerateWriteUpBtn}
      >
        Generate A Write-Up
      </Button>
    </Box>
  ) : null;
}
