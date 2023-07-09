import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import ProfilePicture from "../ProfilePicture/ProfilePicture";
import ProfileHighlight from "../ProfileHighlight/ProfileHighlight";
import ProfileContactDetails from "../ProfileContactDetails/ProfileContactDetails";
import ProfileSocialMedias from "../ProfileSocialMedias/ProfileSocialMedias";
import ProfileTab from "../ProfileTab/ProfileTab";
import ProfileJobMatchingDropDown from "../ProfileJobMatchingDropDown/ProfileJobMatchingDropDown";
import ProfileJobKeyInsight from "../ProfileJobKeyInsight/ProfileJobKeyInsight";
import ProfileEngageButton from "../ProfileEngageButton/ProfileEngageButton";
import ProfileGenerateSummaryButton from "../ProfileGenerateSummaryButton";

export default function ProfileBasicDetails() {
  return (
    <Box>
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ProfilePicture />
          </Box>
          <Box>
            <Stack spacing={0.75}>
              <ProfileHighlight />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          mt: 1.25,
        }}
      >
        <ProfileContactDetails />
      </Box>
      <Box
        sx={{
          mt: 1.25,
        }}
      >
        <ProfileSocialMedias />
      </Box>
      <Box
        sx={{
          mt: 1.5,
        }}
      >
        <ProfileTab />
      </Box>
      <Box
        sx={{
          mt: 1.5,
        }}
      >
        <ProfileJobMatchingDropDown />
      </Box>
      <Box
        sx={{
          mt: 2,
        }}
      >
        <ProfileJobKeyInsight />
      </Box>
      <Box
        sx={{
          mt: 3,
        }}
      >
        <Stack direction="row" spacing={2}>
          <ProfileEngageButton />
          <ProfileGenerateSummaryButton />
        </Stack>
      </Box>
    </Box>
  );
}
