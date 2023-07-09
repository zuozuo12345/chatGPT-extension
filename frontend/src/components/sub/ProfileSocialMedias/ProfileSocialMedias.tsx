import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { SocialMediaLink } from "../../common";

export default function ProfileSocialMedias() {
  const { profileData } = useProfileDetails();

  return (
    <Fade in={profileData ? true : false}>
      <Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mb: 0.25,
          }}
        >
          {profileData && profileData.profile.github && (
            <SocialMediaLink
              active={!profileData.masked_details}
              link={
                profileData.profile.github && !profileData.masked_details
                  ? profileData.profile.github
                  : null
              }
              socialMedia={"github"}
              height={16}
            />
          )}
          {profileData && profileData.profile.twitter && (
            <SocialMediaLink
              active={!profileData.masked_details}
              link={
                profileData.profile.twitter && !profileData.masked_details
                  ? profileData.profile.twitter
                  : null
              }
              socialMedia={"twitter"}
              height={16}
            />
          )}
          {profileData && profileData.profile.website && (
            <SocialMediaLink
              active={!profileData.masked_details}
              link={
                profileData.profile.website && !profileData.masked_details
                  ? profileData.profile.website
                  : null
              }
              socialMedia={"personalWebsite"}
              height={16}
            />
          )}
        </Stack>
      </Box>
    </Fade>
  );
}
