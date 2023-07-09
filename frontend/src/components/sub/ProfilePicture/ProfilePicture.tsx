import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import defaultProfileImg from "../../../assets/default_profile_img.webp";
import openToWorkImg from "../../../assets/open_to_work_wrap.webp";
import diversiftWrapImg from "../../../assets/diversify_wrap.webp";

export default function ProfilePicture() {
  const { openToWork, diversifyHire, profilePic } = useProfileDetails();

  return (
    <Box
      sx={{
        position: "relative",
        ml: openToWork ? 0 : "-10px",
      }}
    >
      <Box
        sx={{
          width: profileImgSize,
          height: profileImgSize,
          borderRadius: "50%",
          overflow: "hidden",
          m: "10px",
        }}
      >
        <img
          src={profilePic ? profilePic : defaultProfileImg}
          style={{
            width: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      {openToWork && (
        <OpenToWorkContainer>
          <img
            style={{
              width: profileImgSize + 20,
              height: profileImgSize + 20,
            }}
            src={openToWorkImg}
          />
        </OpenToWorkContainer>
      )}
      {diversifyHire ? (
        <DiversifyContainer>
          <img
            style={{
              width: profileImgSize + 20,
              height: profileImgSize + 20,
            }}
            src={diversiftWrapImg}
          />
        </DiversifyContainer>
      ) : null}
    </Box>
  );
}

const profileImgSize = 58;

const DiversifyContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  zIndex: 2,
  top: 0,
  right: 0,
}));

const OpenToWorkContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  zIndex: 2,
  top: 0,
}));
