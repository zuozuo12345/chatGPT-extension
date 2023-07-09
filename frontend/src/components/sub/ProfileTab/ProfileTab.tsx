import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

import { useProfileDetails } from "../../../hooks/useProfileDetails";
import { StyledTab, StyledTabLabel, StyledTabs } from "../../support";
import { HeroIconContainer, StyledBadgeBox } from "../../common";

export default function ProfileTab() {
  const { jobMatchingList } = useProfileDetails();

  // Current selected tab state
  const [tabValue, setTabValue] = useState<number>(0);

  // Handle tab change
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <StyledTabs
        id="scout-extension-tab"
        value={tabValue}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="fullWidth"
      >
        <StyledTab
          active={tabValue === 0}
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <HeroIconContainer
                sx={{
                  color: "inherit",
                }}
                width={22}
              >
                <ChartBarSquareIcon />
              </HeroIconContainer>
              <StyledTabLabel active={tabValue === 0}>Insights</StyledTabLabel>
              {Object.keys(jobMatchingList).length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <StyledBadgeBox active={tabValue === 0}>{`${
                      Object.keys(jobMatchingList).length
                    }`}</StyledBadgeBox>
                  </Box>
                </Box>
              )}
            </Stack>
          }
        />
        <StyledTab
          sx={{
            visibility: "hidden",
          }}
          active={tabValue === 1}
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledTabLabel active={tabValue === 1}>
                Similar Profiles
              </StyledTabLabel>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box>
                  <StyledBadgeBox
                    active={tabValue === 1}
                  >{`${"3"}`}</StyledBadgeBox>
                </Box>
              </Box>
            </Stack>
          }
        />
      </StyledTabs>
    </Box>
  );
}
