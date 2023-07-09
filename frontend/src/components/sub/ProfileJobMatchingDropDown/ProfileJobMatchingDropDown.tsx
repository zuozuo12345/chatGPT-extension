import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { MainButton, MaterialDropdown } from "../../common";
import { SCOUT_WEB_URL } from "../../../scripts/scout/settings";
import { setSelectedJobMatchingId } from "../../../redux/user/userSlice";
import { REDUX_ROOT_STATE } from "../../../redux/store";

export default function ProfileJobMatchingDropDown() {
  const dispatch = useDispatch();

  const { jobMatchingList } = useProfileDetails();

  const selectedJobMatching = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["interface"]["selectedJobMatchingId"]
  >((state) => state.user.interface.selectedJobMatchingId, shallowEqual);

  const handleDropdownOnChange = useCallback((event) => {
    dispatch(setSelectedJobMatchingId(event.target.value));
  }, []);

  const JobMatchingDropDown = useMemo(
    () => (
      <>
        <MaterialDropdown
          label="Job Matching"
          placeholder="Job Matching"
          value={selectedJobMatching}
          onChange={handleDropdownOnChange}
          menuItems={[
            {
              label: "All Matched Jobs",
              value: null,
            },
            ...Object.keys(jobMatchingList)
              .map((jobId) => {
                const specificJob = jobMatchingList[jobId];

                return specificJob
                  ? {
                      label: specificJob.job.job_title,
                      value: jobId,
                    }
                  : null;
              })
              .filter((item) => item !== null),
          ]}
          name="location"
          rotation="column"
          fullWidth
          sx={{
            "& .MuiInputBase-root": {
              maxHeight: "32px",
            },
          }}
        />
        <Box
          sx={{
            mt: 0.25,
            mb: 2,
            position: "relative",
            left: "-8px",
          }}
        >
          <a href={`${SCOUT_WEB_URL}job`} rel="noreferrer" target="_blank">
            <MainButton
              variant="text"
              size="small"
              sx={{
                py: "2px",
              }}
            >
              Go to Jobs
            </MainButton>
          </a>
        </Box>
      </>
    ),
    [jobMatchingList, selectedJobMatching]
  );

  return <Box>{JobMatchingDropDown}</Box>;
}
