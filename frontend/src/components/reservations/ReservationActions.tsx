import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  Stack,
} from "@mui/material";

interface ReservationActionsProps {
  validationErrors: string[];
  isSaving: boolean;
  saveError: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}

function ReservationActions({
  validationErrors,
  isSaving,
  saveError,
  onCancel,
  onSubmit,
}: ReservationActionsProps) {
  return (
    <Stack spacing={2}>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {validationErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </Box>
        </Alert>
      )}

      {saveError && (
        <Alert severity="error">
          {saveError}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          disabled={isSaving}
          onClick={onSubmit}
        >
          {isSaving
            ? "Guardando..."
            : "Guardar reservación"}
        </Button>
      </Box>
    </Stack>
  );
}

export default ReservationActions;