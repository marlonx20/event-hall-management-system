import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type { QuickMessage } from "../../types/quickMessage";

interface QuickMessageDialogProps {
  open: boolean;
  message: QuickMessage | null;
  isSaving: boolean;
  hasError: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    content: string,
    displayOrder: number,
  ) => void;
}

function QuickMessageDialog({
  open,
  message,
  isSaving,
  hasError,
  onClose,
  onSave,
}: QuickMessageDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(message?.title ?? "");
    setContent(message?.content ?? "");
    setDisplayOrder(message?.display_order ?? 0);
  }, [message, open]);

  const isValid =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    displayOrder >= 0;

  function handleSave() {
    if (!isValid) {
      return;
    }

    onSave(
      title.trim(),
      content.trim(),
      displayOrder,
    );
  }

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {message ? "Editar mensaje" : "Nuevo mensaje"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {hasError && (
            <Alert severity="error">
              No fue posible guardar el mensaje.
            </Alert>
          )}

          <TextField
            required
            fullWidth
            label="Título"
            value={title}
            disabled={isSaving}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            placeholder="Ejemplo: Respuesta para Facebook"
          />

          <TextField
            required
            fullWidth
            multiline
            minRows={6}
            label="Mensaje"
            value={content}
            disabled={isSaving}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            placeholder="Escribe aquí el texto que quieres copiar rápidamente..."
          />

          <TextField
            fullWidth
            type="number"
            label="Orden de aparición"
            value={displayOrder}
            disabled={isSaving}
            onChange={(event) => {
              const value = Number(event.target.value);

              setDisplayOrder(
                Number.isNaN(value) ? 0 : value,
              );
            }}
            slotProps={{
              htmlInput: {
                min: 0,
              },
            }}
            helperText="Los números menores aparecen primero."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={!isValid || isSaving}
          onClick={handleSave}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuickMessageDialog;