import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { IdentificationIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useSelector, shallowEqual } from "react-redux";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { HeroIconContainer, StyledYellowChip } from "../../common";
import { REDUX_ROOT_STATE } from "../../../redux/store";

export default function ProfileHighlight() {
  const { profileData, isHackerTrailMember } = useProfileDetails();

  const scoutUserDetails = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["details"]
  >((state) => state.user.details, shallowEqual);

  const sessionUserIsInternal =
    scoutUserDetails && scoutUserDetails.is_internal_org
      ? scoutUserDetails.is_internal_org
      : false;

  return (
    <>
      <Box
        sx={{
          lineHeight: 1,
          mt: 0.5,
          flex: 1,
        }}
      >
        <Box>
          <Grid
            container
            spacing={0.5}
            alignItems="center"
            justifyContent="space-between"
          >
            {profileData &&
              profileData.highlights_v2 &&
              profileData.highlights_v2.length > 0 &&
              profileData.highlights_v2
                .filter(
                  (highlight) => highlight.toLowerCase() !== "open to work"
                )
                .map((highlight, index) => {
                  const visaStatus = [
                    "Singaporean",
                    "Employment Pass",
                    "Student Pass",
                    "Permanent Resident",
                    "Not Applicable",
                  ];

                  const isVisaStatus = visaStatus.some((el) =>
                    highlight.includes(el)
                  );

                  return (
                    <Grid key={index} item>
                      <StyledYellowChip
                        label={
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            {isVisaStatus && (
                              <HeroIconContainer width={16} color="inherit">
                                <IdentificationIcon />
                              </HeroIconContainer>
                            )}
                            <span
                              style={{
                                fontSize: "11px",
                              }}
                            >
                              {highlight}
                            </span>
                          </Stack>
                        }
                        size="small"
                        sx={{
                          height: "auto",
                          py: 0.25,
                          px: 0,
                          "& .MuiChip-label": {
                            px: 0.5,
                          },
                        }}
                        yellowText
                        typographyVariant="caption"
                        border
                        borderRadius={4}
                      />
                    </Grid>
                  );
                })}
          </Grid>
        </Box>
      </Box>
      <Box>
        {profileData && profileData.profile && profileData.profile.name ? (
          <Box>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "700",
                }}
                color="text.primary"
              >
                {`${profileData.profile.name}`}
              </Typography>
              {sessionUserIsInternal && isHackerTrailMember ? (
                <Box
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                  }}
                >
                  <Tooltip title="HackerTrail Member">
                    <HeroIconContainer width={20} color="inherit">
                      <CheckBadgeIcon />
                    </HeroIconContainer>
                  </Tooltip>
                </Box>
              ) : null}
            </Stack>
          </Box>
        ) : null}
        {profileData &&
          profileData.experiences.length > 0 &&
          profileData.experiences[0] && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "12px",
                }}
                color="text.secondary"
              >
                {`${
                  profileData.experiences[0].job_title
                    ? `${profileData.experiences[0].job_title}, `
                    : ""
                }${
                  profileData.experiences[0].company_name
                    ? profileData.experiences[0].company_name
                    : ""
                }`}
              </Typography>
            </Box>
          )}
      </Box>
    </>
  );
}
