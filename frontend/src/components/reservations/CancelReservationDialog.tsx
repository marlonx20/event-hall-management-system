import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface CancelReservationDialogProps {
  open: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CancelReservationDialog({
  open,
  isSaving,
  onClose,
  onConfirm,
}: CancelReservationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        isSaving ? undefined : onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Cancelar reservación
      </DialogTitle>

      <DialogContent>
        <Typography>
          ¿Seguro que deseas cancelar esta
          reservación? El registro permanecerá
          en el historial, pero la fecha volverá
          a quedar disponible.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 3 }}
      >
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onClose}
        >
          Regresar
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={isSaving}
          onClick={onConfirm}
        >
          {isSaving
            ? "Cancelando..."
            : "Confirmar cancelación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CancelReservationDialog;