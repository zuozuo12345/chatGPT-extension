import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import {
  BuildingOffice2Icon,
  ChartBarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useSelector, shallowEqual } from "react-redux";
import _ from "lodash";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { REDUX_ROOT_STATE } from "../../../redux/store";
import { recommendationLvlType } from "../../support";
import ConsideredLogo from "../../../assets/considered.webp";
import HighlyRecommendedLogo from "../../../assets/highly_recommended.webp";
import RecommendedLogo from "../../../assets/recommended.webp";
import CertLogo from "../../../assets/cert_icon.webp";
import {
  HeroIconContainer,
  ShowMoreButton,
} from "../../common/customContainer";
import { StyledGreyBorderChip, StyledSkillChip } from "../../common";
import { titleCase } from "../../../utils/format";

export default function ProfileJobKeyInsight() {
  const { jobMatchingList, profileData, detailsMasked } = useProfileDetails();

  const [showMoreSkill, setShowMoreSkill] = useState<boolean>(false);
  const [showMoreCertification, setShowMoreCertification] =
    useState<boolean>(false);
  const [showMoreSummary, setShowMoreSummary] = useState<boolean>(false);

  const selectedJobMatching = useSelector<
    REDUX_ROOT_STATE,
    REDUX_ROOT_STATE["user"]["interface"]["selectedJobMatchingId"]
  >((state) => state.user.interface.selectedJobMatchingId, shallowEqual);

  const specificJob =
    profileData &&
    Object.keys(jobMatchingList).length > 0 &&
    selectedJobMatching &&
    selectedJobMatching !== null &&
    selectedJobMatching !== undefined
      ? jobMatchingList[selectedJobMatching]
      : null;

  const findInCandidateJob =
    profileData &&
    profileData.jobs &&
    profileData.jobs.length > 0 &&
    selectedJobMatching !== undefined &&
    selectedJobMatching !== null
      ? _.find(profileData.jobs, (o, index) => o.job.id === selectedJobMatching)
      : null;

  if (
    specificJob === null ||
    specificJob === undefined ||
    !findInCandidateJob
  ) {
    return null;
  }

  const recommendationLevel: recommendationLvlType =
    specificJob && specificJob.score !== undefined && specificJob.score !== null
      ? specificJob.score > 85
        ? "highly_recommended"
        : specificJob.score > 70
        ? "recommended"
        : specificJob.score > 50
        ? "considered"
        : "not_recommended"
      : specificJob.score !== undefined &&
        specificJob.score !== null &&
        specificJob.score === 0
      ? "not_recommended"
      : null;

  const candidateRawIndustry =
    profileData && profileData.industry ? profileData.industry.split(",") : [];

  const candidateMatchingIndustry = candidateRawIndustry
    ? _.uniq(candidateRawIndustry)
    : ["-"];

  const candidateMissingSkill = profileData
    ? _.difference(
        profileData.skills.map((item) => item.name),
        specificJob.job_skills
      )
    : [];

  const candidate_matched_skill_details =
    specificJob &&
    profileData &&
    specificJob.matched_skill_details &&
    specificJob.matched_skill_details.length > 0
      ? _.uniq(
          specificJob.matched_skill_details.map((item) =>
            item.skill.toLowerCase()
          )
        )
      : [];

  const candidateSkillsRelatedToJob =
    profileData && specificJob.job_skills
      ? _.uniqWith(
          [
            ...[...specificJob.job_skills, ...candidateMissingSkill].sort(
              (a__, b__) => {
                const a = `${a__}`;
                const b = `${b__}`;

                const a_ = candidate_matched_skill_details.includes(
                  a.toLowerCase()
                )
                  ? 0
                  : 1;
                const b_ = candidate_matched_skill_details.includes(
                  b.toLowerCase()
                )
                  ? 0
                  : 1;

                if (a_ > b_) {
                  return 1;
                }

                if (a_ < b_) {
                  return -1;
                }
                return 0;
              }
            ),
          ],
          (a, b) => a.toLowerCase() === b.toLowerCase()
        )
      : [];

  const candidateCertifications =
    profileData &&
    profileData.certifications &&
    profileData.certifications.length > 0
      ? _.uniqBy(profileData.certifications, "name")
      : [
          {
            dates: null,
            name: "-",
          },
        ];
  const candidateEducation =
    profileData && profileData.educations && profileData.educations.length > 0
      ? `${profileData.educations[0].degree_name ?? ""}${
          profileData.educations[0].degree_name &&
          profileData.educations[0].field
            ? " in "
            : ""
        }${profileData.educations[0].field ?? ""} @ ${
          profileData.educations[0].institution ?? ""
        } ${
          profileData.educations[0].dates
            ? `(${profileData.educations[0].dates})`
            : ""
        }`
      : "-";

  const skillMoreThanInitialSkillCount =
    candidateSkillsRelatedToJob.length > initialShownSkillCount;
  const certMoreThanInitialCertCount =
    candidateCertifications.length > initialShownCertCount;

  let candidateSkills = _.uniq(candidateSkillsRelatedToJob);
  let candidateCerts = candidateCertifications;

  if (
    !showMoreSkill &&
    candidateSkillsRelatedToJob.length > 1 &&
    skillMoreThanInitialSkillCount
  ) {
    candidateSkills = candidateSkillsRelatedToJob.slice(
      0,
      initialShownSkillCount
    );
  }

  if (
    !showMoreCertification &&
    candidateCertifications.length > 1 &&
    certMoreThanInitialCertCount
  ) {
    candidateCerts = candidateCertifications.slice(0, initialShownCertCount);
  }

  const showAllSkillOnClick = () => {
    if (!profileData.masked_details) {
      setShowMoreSkill(!showMoreSkill);
    }
  };

  const showAllCertOnClick = () => {
    if (!profileData.masked_details) {
      setShowMoreCertification(!showMoreCertification);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
        }}
      >
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: "14px",
          }}
        >
          {`Key Insights For `}
          <Box
            component="span"
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {`${specificJob.job.job_title}`}
          </Box>
        </Typography>
      </Box>
      <Box
        sx={{
          border: (theme) => `1px solid ${theme.customPalette.grey.platinium}`,
          borderRadius: (theme) => theme.spacing(0.5),
          bgcolor: (theme) => theme.customPalette.grey.cultured,
          py: 0.5,
          px: 1,
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              border: (theme) => `2px solid ${theme.palette.success.main}`,
              borderRadius: (theme) => theme.spacing(0.5),
              p: 0.5,
              width: "22px",
              height: "22px",
              padding: "1px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                maxHeight: "11px",
              }}
            >
              <img
                style={{
                  width: 11,
                  display: "flex",
                }}
                src={
                  recommendationLevel === "considered"
                    ? ConsideredLogo
                    : recommendationLevel === "recommended"
                    ? RecommendedLogo
                    : HighlyRecommendedLogo
                }
              />
            </Box>
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                fontSize: "11px",
                color: (theme) => theme.palette.success.main,
                lineHeight: "0.5",
              }}
            >
              {recommendationLevel === "considered"
                ? "Considered"
                : recommendationLevel === "recommended"
                ? "Recommended"
                : "Highly Recommended"}
            </Typography>
          </Box>
        </Stack>
      </Box>
      {findInCandidateJob && findInCandidateJob.summary ? (
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Box
            sx={(theme) =>
              !showMoreSummary
                ? {
                    backgroundColor: theme.customPalette.grey.platinium,
                    ...showMoreBasicCss,
                    ...showMoreCssObj,
                  }
                : {
                    backgroundColor: theme.customPalette.grey.platinium,
                    ...showMoreBasicCss,
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }
            }
          >
            <Typography variant="body2" noWrap={!showMoreSummary}>
              {findInCandidateJob.summary}
            </Typography>
            <Box
              sx={{
                pt: showMoreSummary ? 1 : 0,
              }}
            >
              <ShowMoreButton
                onClick={() => setShowMoreSummary(!showMoreSummary)}
                size="small"
                showMoreColor={false}
              >
                {showMoreSummary ? "less" : "more"}
              </ShowMoreButton>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Stack spacing={1}>
        {candidateMatchingIndustry.length > 0 && (
          <Box>
            <Stack spacing={1.5} direction="row">
              <Box>
                <Tooltip title="Industries">
                  <HeroIconContainer width={candidateCatIconSize}>
                    <BuildingOffice2Icon />
                  </HeroIconContainer>
                </Tooltip>
              </Box>
              <Box>
                <Typography variant="body2">
                  {candidateMatchingIndustry.join(", ")}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
        {candidateSkillsRelatedToJob.length > 0 &&
          candidateSkills.length > 0 && (
            <Box>
              <Stack spacing={1.5} direction="row">
                <Box>
                  <Tooltip title="Skills">
                    <HeroIconContainer width={candidateCatIconSize}>
                      <ChartBarIcon />
                    </HeroIconContainer>
                  </Tooltip>
                </Box>
                <Box>
                  <Grid container spacing={0.5}>
                    {candidateSkills.map((skill_, index) => {
                      const skill = skill_.toLowerCase();

                      const candidateHaveThisSkill =
                        candidate_matched_skill_details.includes(skill);

                      return (
                        <Grid key={index} item>
                          {candidateHaveThisSkill ? (
                            <StyledSkillChip
                              haveSkill={true}
                              label={titleCase(skill_)}
                              labelBold={false}
                            />
                          ) : (
                            <StyledGreyBorderChip label={titleCase(skill_)} />
                          )}
                        </Grid>
                      );
                    })}
                    {skillMoreThanInitialSkillCount && (
                      <Grid item>
                        <ShowMoreButton
                          size="small"
                          onClick={showAllSkillOnClick}
                          showMoreColor={
                            detailsMasked && skillMoreThanInitialSkillCount
                          }
                        >
                          {!showMoreSkill && skillMoreThanInitialSkillCount
                            ? `+${
                                candidateSkillsRelatedToJob.length -
                                initialShownSkillCount
                              } other skill${
                                candidateSkillsRelatedToJob.length -
                                  initialShownSkillCount >
                                1
                                  ? "s"
                                  : ""
                              }`
                            : "less"}
                        </ShowMoreButton>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Stack>
            </Box>
          )}
        {candidateCertifications.length > 0 && candidateCerts.length > 0 && (
          <Box>
            <Stack spacing={1.5} direction="row">
              <Box
                sx={{
                  pt: "2px",
                }}
              >
                <Tooltip title="Certifications">
                  <Box>
                    <img
                      style={{
                        width: candidateCatIconSize - 3,
                        height: candidateCatIconSize - 3 - 1.45,
                      }}
                      src={CertLogo}
                    />
                  </Box>
                </Tooltip>
              </Box>
              <Box>
                <Stack spacing={1.25}>
                  {candidateCerts.map((item, index) => {
                    return (
                      <Box sx={{ display: "inline-block" }} key={index}>
                        <Grid container spacing={1.25}>
                          <Grid item>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {item ? `${item.name.toLowerCase()}` : ""}
                            </Typography>
                          </Grid>
                          {index === 0 &&
                          candidateCertifications.length > 1 &&
                          !showMoreCertification ? (
                            <Grid item>
                              <ShowMoreButton
                                size="small"
                                onClick={showAllCertOnClick}
                                showMoreColor={
                                  !detailsMasked && certMoreThanInitialCertCount
                                }
                              >
                                {!showMoreCertification &&
                                certMoreThanInitialCertCount
                                  ? `+${
                                      candidateCertifications.length -
                                      initialShownCertCount
                                    } other certification${
                                      candidateCertifications.length -
                                        initialShownCertCount >
                                      1
                                        ? "s"
                                        : ""
                                    }`
                                  : "less"}
                              </ShowMoreButton>
                            </Grid>
                          ) : null}
                        </Grid>
                      </Box>
                    );
                  })}
                  {showMoreCertification && (
                    <Box>
                      <Tooltip
                        title={
                          !detailsMasked && certMoreThanInitialCertCount
                            ? "Reveal recommendation to view all certifications"
                            : null
                        }
                      >
                        <ShowMoreButton
                          sx={{
                            position: "relative",
                            left: -3,
                          }}
                          size="small"
                          onClick={showAllCertOnClick}
                          showMoreColor={
                            !detailsMasked && certMoreThanInitialCertCount
                          }
                        >
                          {!showMoreCertification &&
                          certMoreThanInitialCertCount
                            ? `+${
                                candidateCertifications.length -
                                initialShownCertCount
                              } other certification${
                                candidateCertifications.length -
                                  initialShownCertCount >
                                  1 && "s"
                              }`
                            : "less"}
                        </ShowMoreButton>
                      </Tooltip>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
        <Box>
          <Stack spacing={1.5} direction="row">
            <Box>
              <Tooltip title="Education">
                <HeroIconContainer width={candidateCatIconSize}>
                  <AcademicCapIcon />
                </HeroIconContainer>
              </Tooltip>
            </Box>
            <Box>
              <Typography variant="body2">{`${candidateEducation}`}</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

const candidateCatIconSize = 21;
const initialShownSkillCount = 4;
const initialShownCertCount = 1;
const showMoreBasicCss = {
  p: 1,
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
};
const showMoreCssObj = {
  width: 900,
  ["@media(max-width: 1240px)"]: {
    width: 850,
  },
  ["@media(max-width: 1190px)"]: {
    width: 800,
  },
  ["@media(max-width: 1140px)"]: {
    width: 750,
  },
  ["@media(max-width: 1090px)"]: {
    width: 700,
  },
  ["@media(max-width: 1040px)"]: {
    width: 650,
  },
  ["@media(max-width: 990px)"]: {
    width: 600,
  },
  ["@media(max-width: 940px)"]: {
    width: 550,
  },
  ["@media(max-width: 890px)"]: {
    width: 500,
  },
  ["@media(max-width: 840px)"]: {
    width: 450,
  },
  ["@media(max-width: 790px)"]: {
    width: 400,
  },
  ["@media(max-width: 740px)"]: {
    width: 350,
  },
  ["@media(max-width: 690px)"]: {
    width: 300,
  },
  ["@media(max-width: 640px)"]: {
    width: 250,
  },
  ["@media(max-width: 600px)"]: {
    width: 450,
  },
  ["@media(max-width: 550px)"]: {
    width: 400,
  },
  ["@media(max-width: 500px)"]: {
    width: 350,
  },
  ["@media(max-width: 450px)"]: {
    width: 300,
  },
  ["@media(max-width: 400px)"]: {
    width: 250,
  },
  ["@media(max-width: 350px)"]: {
    width: 200,
  },
  ["@media(max-width: 300px)"]: {
    width: 150,
  },
};
