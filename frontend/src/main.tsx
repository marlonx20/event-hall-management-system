import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "dayjs/locale/es-mx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import AppSnackbar from "./components/feedback/AppSnackbar";
import {
  SnackbarProvider,
} from "./context/SnackbarContext";
import { appTheme } from "./theme/theme";

const queryClient = new QueryClient();

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={appTheme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="es-mx"
        >
          <SnackbarProvider>
            <CssBaseline />
            <App />
            <AppSnackbar />
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);