import { useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { useSelector, shallowEqual } from "react-redux";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ScoutLogo from "../../../assets/scout-logo.webp";
import { useShortlistDialog } from "../../../hooks/useShortlistDialog";
import { REDUX_ROOT_STATE } from "../../../redux/store";
import { CustomSkeleton } from "../../support";
import { HeroIconContainer } from "../../common";
import {
  setLoginProcessStorage,
  setSessionTypeStorage,
} from "../../../utils/storage";
import { useSessionUser } from "../../../hooks/useSessionUser";

interface AppBarProps {
  loadingMode?: boolean;
}

export default function AppBar(props: AppBarProps) {
  const { loadingMode = false } = props;

  const { openShortlistDialog } = useShortlistDialog();
  const { authenticated, credits } = useSessionUser();

  const scoutAccessToken = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["accessToken"]
  >((state) => state.user.accessToken, shallowEqual);
  const scoutUserDetails = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["details"]
  >((state) => state.user.details, shallowEqual);
  const profileData = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["profile"]["details"]["profileDetails"]
  >((state) => state.profile.details.profileDetails, shallowEqual);

  const currentUserSessionToken =
    scoutUserDetails && scoutAccessToken ? scoutAccessToken : null;

  const candidateDetails = profileData ? profileData : null;

  const ShortlistBtnComp = useMemo(() => {
    const shortlistBtnOnClick = () => {
      openShortlistDialog({
        callbackFunc: {
          proceed: () => {},
          cancel: () => {},
        },
      });
    };

    return currentUserSessionToken && candidateDetails && !loadingMode ? (
      <Button
        color="primary"
        size="small"
        onClick={shortlistBtnOnClick}
        variant="contained"
        sx={{
          textTransform: "none",
        }}
        disableElevation
      >
        {"Shortlist"}
      </Button>
    ) : loadingMode ? (
      <CustomSkeleton variant="rounded" width={67} height={30.75} />
    ) : null;
  }, [currentUserSessionToken, candidateDetails, loadingMode]);

  const UserTokenComp = useMemo(() => {
    return !loadingMode ? (
      <Box
        component="span"
        sx={{
          flex: 1,
          pt: 0.75,
          display: "flex",
          alignItems: "center",
        }}
      >
        <FontAwesomeIcon
          style={{
            height: 15,
            color: "#FFD700",
            paddingRight: "4px",
          }}
          icon={faCoins}
        />
        <Typography variant="caption" lineHeight={1}>
          {`${credits} credit${credits > 1 ? "s" : ""}`}
        </Typography>
      </Box>
    ) : (
      <CustomSkeleton variant="rounded" width={70} height={30} />
    );
  }, [loadingMode, credits]);

  const LogoutBtn = useMemo(() => {
    const logoutOnClick = async () => {
      chrome.storage.sync.set({ scoutWebToken: null });
      await setLoginProcessStorage(null, null);
      await setSessionTypeStorage("scout_web_app");
    };

    return authenticated ? (
      <IconButton onClick={logoutOnClick}>
        <HeroIconContainer width={20}>
          <ArrowRightOnRectangleIcon />
        </HeroIconContainer>
      </IconButton>
    ) : null;
  }, [authenticated]);

  return (
    <Box>
      <Box
        sx={{
          pt: 2,
          px: 2,
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          flexWrap={"nowrap"}
        >
          <Grid item>
            <img style={{ width: 95 }} src={ScoutLogo} />
          </Grid>
          <Grid item>
            <Stack spacing={2} direction="row">
              {UserTokenComp}
              {ShortlistBtnComp}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
