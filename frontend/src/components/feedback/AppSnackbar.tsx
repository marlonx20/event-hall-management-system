import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  IconButton,
  Slide,
  Snackbar,
} from "@mui/material";
import type { SlideProps } from "@mui/material";

import { useSnackbarContext } from "../../context/SnackbarContext";

function Transition(
  props: SlideProps,
) {
  return (
    <Slide
      {...props}
      direction="left"
    />
  );
}

function AppSnackbar() {
  const {
    snackbar,
    hideSnackbar,
  } = useSnackbarContext();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={
        snackbar.autoHideDuration
      }
      onClose={hideSnackbar}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slots={{ transition: Transition }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbar.severity}
        variant="filled"
        sx={{
          minWidth: 360,
          alignItems: "center",
        }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() =>
              hideSnackbar()
            }
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;