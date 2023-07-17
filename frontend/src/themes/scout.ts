import { createTheme } from "@mui/material/styles";

// Module augmentation
declare module "@mui/material/styles" {
  interface Theme {
    customPalette?: {
      grey?: {
        base: string;
        dim: string;
        light_grey: string;
        platinium: string;
        cultured: string;
        light_grey_darker: string;
        onyx: string;
      };
      green?: {
        light: string;
        normal: string;
        dark: string;
      };
      internalTool?: {
        blaze_orange: string;
        champagne_pink: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette?: {
      grey?: {
        base: string;
        dim: string;
        light_grey: string;
        platinium: string;
        cultured: string;
        light_grey_darker: string;
        onyx: string;
      };
      green?: {
        light: string;
        normal: string;
        dark: string;
      };
      internalTool?: {
        blaze_orange: string;
        champagne_pink: string;
      };
    };
  }
}

const defaultTheme = createTheme({
  customPalette: {
    grey: {
      base: "#3D3D3D",
      dim: "#696969",
      light_grey: "#D6D6D6",
      platinium: "#EBEBEB",
      cultured: "#F9F9F9",
      light_grey_darker: "#d2d2d2",
      onyx: "#3D3D3D",
    },
    green: {
      dark: "#386641",
      normal: "#6a994e",
      light: "#a7c957",
    },
    internalTool: {
      blaze_orange: "#F66700",
      champagne_pink: "#FFEADB",
    },
  },
  palette: {
    primary: {
      main: "#F66700",
      light: "#FFEADB",
    },
    secondary: {
      main: "#FFEADB",
    },
    success: {
      main: "#4CAF50",
      light: "#EDF7ED",
    },
    text: {
      primary: "#3D3D3D",
      secondary: "#696969",
      disabled: "#696969",
    },
    background: {
      default: "#faf9f7",
    },
    error: {
      main: "#E57373",
      light: "#FCF1F1",
    },
    warning: {
      main: "#FF9800",
      light: "#FFF4E5",
    },
  },
  typography: {
    fontFamily: "Helvetica, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Helvetica';
          src: url("/fonts/helvetica.ttc");
          font-style: normal;
          font-display: swap;
          font-weight: 400;
        }      
      `,
    },
  },
});

// try changes

export default defaultTheme;
