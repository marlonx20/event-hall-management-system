import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#468C00",
      dark: "#304D13",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#7D0F8C",
      dark: "#331237",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#304D13",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F5FFEB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#331237",
      secondary: "#5F6368",
    },

    divider: "#E2E6DE",
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
          boxShadow: "none",

          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#468C00",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#468C00",
            borderWidth: 2,
          },
        },

        notchedOutline: {
          borderColor: "#D5D8DC",
        },

        input: {
          caretColor: "#468C00",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#468C00",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        icon: {
          color: "#304D13",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(70, 140, 0, 0.12)",

            "&:hover": {
              backgroundColor: "rgba(70, 140, 0, 0.18)",
            },
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#5F6368",

          "&.Mui-checked": {
            color: "#468C00",
          },
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#5F6368",

          "&.Mui-checked": {
            color: "#468C00",
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#468C00",

            "& + .MuiSwitch-track": {
              backgroundColor: "#468C00",
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});