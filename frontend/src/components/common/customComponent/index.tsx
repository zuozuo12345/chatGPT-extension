import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import {
  faLinkedin,
  faGithub,
  faStackOverflow,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BuildingLibraryIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { HeroIconContainer } from "../customContainer";
import TwitterLogo from "../../../assets/Twitter.svg";
import PersonalWebsiteLogo from "../../../assets/personalwebsite.svg";

interface SocialMediaLinkProps extends BoxProps {
  socialMedia:
    | "linkedin"
    | "github"
    | "stackoverflow"
    | "twitter"
    | "personalWebsite";
  active?: boolean;
  height?: number;
  link?: string;
  useNextImage?: boolean;
}

const prefix = "https://";

export function SocialMediaLink(props: SocialMediaLinkProps) {
  const {
    socialMedia,
    active = false,
    height = 22,
    link = null,
    useNextImage = false,
    ...others
  } = props;

  const hyperLink = link
    ? link.search(/^http[s]?\:\/\//) === -1
      ? `${prefix}${link}`
      : link
    : null;

  return link && hyperLink && active ? (
    <MuiLink href={hyperLink} rel="noreferrer" target="_blank">
      <SocialMediaLinkBox
        active={active}
        socialMedia={socialMedia}
        {...others}
        component="span"
      >
        {socialMedia === "twitter" || socialMedia === "personalWebsite" ? (
          <img
            src={socialMedia === "twitter" ? TwitterLogo : PersonalWebsiteLogo}
            style={{
              height: height,
            }}
          />
        ) : (
          <FontAwesomeIcon
            style={{ height: height }}
            icon={
              socialMedia === "linkedin"
                ? faLinkedin
                : socialMedia === "github"
                ? faGithub
                : faStackOverflow
            }
          />
        )}
      </SocialMediaLinkBox>
    </MuiLink>
  ) : (
    <SocialMediaLinkBox active={active} socialMedia={socialMedia} {...others}>
      {socialMedia === "twitter" || socialMedia === "personalWebsite" ? (
        <img
          src={socialMedia === "twitter" ? TwitterLogo : PersonalWebsiteLogo}
          style={{
            height: height,
          }}
        />
      ) : (
        <FontAwesomeIcon
          style={{ height: height }}
          icon={
            socialMedia === "linkedin"
              ? faLinkedin
              : socialMedia === "github"
              ? faGithub
              : faStackOverflow
          }
        />
      )}
    </SocialMediaLinkBox>
  );
}

interface SocialMediaLinkBoxProps extends BoxProps {
  socialMedia?: SocialMediaLinkProps["socialMedia"];
  active?: boolean;
}

const SocialMediaLinkBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "socialMedia",
})<SocialMediaLinkBoxProps>(
  ({ theme, active = false, socialMedia = "linkedin" }) => ({
    display: "flex",
    // borderRadius: "50%",
    // border: `1px solid ${
    //   active
    //     ? socialMedia === "linkedin"
    //       ? "#0072b1"
    //       : socialMedia === "github"
    //       ? "#171515"
    //       : "#ef8236"
    //     : theme.customPalette.grey.light_grey
    // }`,
    overflow: "hidden",
    color: active
      ? socialMedia === "linkedin"
        ? "#0072b1"
        : socialMedia === "github"
        ? "#171515"
        : socialMedia === "twitter"
        ? "#00acee"
        : "#ef8236"
      : theme.customPalette.grey.light_grey,
  })
);

const MuiLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

interface SuitabilityIconsProps extends BoxProps {
  passed?: boolean;
  type?:
    | "job_family"
    | "skills_required"
    | "matching_experience_level"
    | "relevant_projects"
    | "matching_industries";
  label?: string;
  width?: number;
  iconColor?: "inherit" | "black" | "light_grey" | "dim_grey" | "green";
  labelColor?: "inherit" | "black";
  labelVariant?: TypographyProps["variant"];
  recommendCandidateMode?: boolean;
}

interface SuitabilityIconsContainerProps extends BoxProps {
  passed?: boolean;
  type?: SuitabilityIconsProps["type"];
}

const SuitabilityIconsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "passed" && prop !== "type",
})<SuitabilityIconsContainerProps>(
  ({ theme, passed, type = "job_family" }) => ({
    color: passed ? theme.palette.success.main : theme.palette.error.main,
    "& .MuiBadge-badge":
      type === "matching_experience_level" || type === "relevant_projects"
        ? {
            backgroundColor: "transparent",
            color: passed
              ? theme.palette.success.main
              : theme.palette.error.main,
            width: "auto",
            height: "auto",
            right: type === "relevant_projects" ? 2 : 4,
            bottom: 2,
          }
        : {
            backgroundColor: "transparent",
            color: passed
              ? theme.palette.success.main
              : theme.palette.error.main,
            width: "auto",
            height: "auto",
          },
  })
);

export function SuitabilityIcons(props: SuitabilityIconsProps) {
  const {
    passed = false,
    type = "job_family",
    label = null,
    width = 28,
    iconColor = "inherit",
    labelColor = "inherit",
    labelVariant = "body1",
    recommendCandidateMode = false,
    ...others
  } = props;

  const theme = useTheme();

  return (
    <SuitabilityIconsContainer passed={passed} type={type} {...others}>
      <Stack spacing={2} alignItems="center">
        <Box>
          <Badge
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              passed ? (
                <HeroIconContainer
                  width={recommendCandidateMode ? width - 3 : width - 8}
                  color="inherit"
                >
                  {passed ? <CheckCircleIcon /> : <XCircleIcon />}
                </HeroIconContainer>
              ) : null
            }
            color={passed ? "success" : "error"}
          >
            <HeroIconContainer
              width={type === "matching_experience_level" ? width + 4 : width}
              color={passed ? iconColor : "light_grey"}
            >
              {type === "job_family" ? (
                <BriefcaseIcon />
              ) : type === "skills_required" ? (
                <BuildingLibraryIcon />
              ) : type === "matching_experience_level" ? (
                <AcademicCapIcon />
              ) : (
                <ChartPieIcon />
              )}
            </HeroIconContainer>
          </Badge>
        </Box>
        {label && (
          <Box
            sx={{
              maxWidth: recommendCandidateMode ? 100 : "none",
              textAlign: "center",
              lineHeight: "0.8px",
              position: "relative",
            }}
          >
            <Typography
              variant={labelVariant}
              align="center"
              sx={{
                color: passed
                  ? labelColor
                  : theme.customPalette.grey.light_grey,
                lineHeight: "normal",
                position: "relative",
                top: type === "matching_experience_level" ? "-4px" : 0,
              }}
            >
              {label}
            </Typography>
          </Box>
        )}
      </Stack>
    </SuitabilityIconsContainer>
  );
}

export function SuitabilityAltVersion(props: SuitabilityIconsProps) {
  const {
    passed = false,
    type = "job_family",
    label = null,
    width = 28,
    iconColor = "inherit",
    labelColor = "inherit",
    labelVariant = "body1",
    recommendCandidateMode = false,
    ...others
  } = props;

  const theme = useTheme();

  return (
    <Stack direction="row" spacing={0.75} alignItems={"center"}>
      <HeroIconContainer
        width={width}
        color={passed ? iconColor : "light_grey"}
      >
        <CheckCircleIcon />
      </HeroIconContainer>
      <Box>
        <Typography
          variant={labelVariant}
          align="left"
          sx={{
            color: passed ? labelColor : theme.customPalette.grey.light_grey,
            lineHeight: "normal",
            position: "relative",
            top: 0,
            fontWeight: "bold",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Stack>
  );
}
