import { useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import Zoom from "@mui/material/Zoom";
import { Provider } from "react-redux";

import {
  ConfirmationDialog,
  EngageCandidateDialog,
  GenerateWriteUpDialog,
  IntegrateEmailDialog,
  UpgradeToPremiumDialog,
  ShortlistDialog,
} from "./components/dialog";
import { BaseComp } from "./components/main";
import { ConfirmationDialogContextProvider } from "./hooks/useConfirmationDialog";
import { IntegrateEmailDialogContextProvider } from "./hooks/useIntegrateEmailDialog";
import defaultTheme from "./themes/scout";
import { UpgradeToPremiumDialogContextProvider } from "./hooks/useUpgradeToPremiumDialog";
import { GenerateWriteUpDialogContextProvider } from "./hooks/useGenerateWriteUpDialog";
import { EngageCandidateDialogContextProvider } from "./hooks/useEngageCandidateDialog";
import { store } from "./redux/store";
import { ShortlistDialogContextProvider } from "./hooks/useShortlistDialog";
import { SessionUserContextProvider } from "./hooks/useSessionUser";
import { ProfileDetailsContextProvider } from "./hooks/useProfileDetails";

export default function App() {
  const theme = useMemo(() => defaultTheme, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={Zoom}
          dense
        >
          <ShortlistDialogContextProvider>
            <GenerateWriteUpDialogContextProvider>
              <UpgradeToPremiumDialogContextProvider>
                <EngageCandidateDialogContextProvider>
                  <IntegrateEmailDialogContextProvider>
                    <ConfirmationDialogContextProvider>
                      <SessionUserContextProvider>
                        <ProfileDetailsContextProvider>
                          <BaseComp />
                          <ConfirmationDialog />
                          <IntegrateEmailDialog />
                          <UpgradeToPremiumDialog />
                          <GenerateWriteUpDialog />
                          <EngageCandidateDialog />
                          <ShortlistDialog />
                        </ProfileDetailsContextProvider>
                      </SessionUserContextProvider>
                    </ConfirmationDialogContextProvider>
                  </IntegrateEmailDialogContextProvider>
                </EngageCandidateDialogContextProvider>
              </UpgradeToPremiumDialogContextProvider>
            </GenerateWriteUpDialogContextProvider>
          </ShortlistDialogContextProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
