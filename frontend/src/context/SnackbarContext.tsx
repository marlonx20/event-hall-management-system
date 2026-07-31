import type {
  AlertColor,
  SnackbarCloseReason,
} from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type {
  ReactNode,
  SyntheticEvent,
} from "react";

export interface SnackbarOptions {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
}

interface SnackbarContextValue {
  snackbar: SnackbarState;
  showSnackbar: (options: SnackbarOptions) => void;
  hideSnackbar: (
    event?: Event | SyntheticEvent,
    reason?: SnackbarCloseReason,
  ) => void;
}

const SnackbarContext =
  createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [snackbar, setSnackbar] =
    useState<SnackbarState>({
      open: false,
      message: "",
      severity: "success",
      autoHideDuration: 4000,
    });

  const showSnackbar = useCallback(
    ({
      message,
      severity = "success",
      autoHideDuration = 4000,
    }: SnackbarOptions) => {
      setSnackbar({
        open: true,
        message,
        severity,
        autoHideDuration,
      });
    },
    [],
  );

  const hideSnackbar = useCallback(
    (
      _event?: Event | SyntheticEvent,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === "clickaway") {
        return;
      }

      setSnackbar((current) => ({
        ...current,
        open: false,
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      snackbar,
      showSnackbar,
      hideSnackbar,
    }),
    [hideSnackbar, showSnackbar, snackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbarContext() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error(
      "useSnackbarContext debe utilizarse dentro de SnackbarProvider.",
    );
  }

  return context;
}