import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

import { useSnackbar } from "../../hooks/useSnackbar";
import {
  createBackup,
  downloadBackup,
  restoreBackup,
} from "../../services/backupService";
import { translateApiError } from "../../utils/translateApiError";

function BackupCard() {
  const { showSnackbar } = useSnackbar();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [isCreatingBackup, setIsCreatingBackup] =
    useState(false);

  const [isRestoringBackup, setIsRestoringBackup] =
    useState(false);

  const [selectedBackup, setSelectedBackup] =
    useState<File | null>(null);

  const [confirmationOpen, setConfirmationOpen] =
    useState(false);

  const [restartRequired, setRestartRequired] =
    useState(false);

  async function handleCreateBackup(): Promise<void> {
    setIsCreatingBackup(true);

    try {
      const backup = await createBackup();

      downloadBackup(backup);

      showSnackbar({
        severity: "success",
        message:
          "Respaldo creado y descargado correctamente.",
      });
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible crear el respaldo.",
        ),
      });
    } finally {
      setIsCreatingBackup(false);
    }
  }

  function handleSelectedFile(
    file: File | null,
  ): void {
    if (!file) {
      return;
    }

    setSelectedBackup(file);
    setConfirmationOpen(true);
  }

  async function handleConfirmRestore(): Promise<void> {
    if (!selectedBackup) {
      return;
    }

    setIsRestoringBackup(true);

    try {
      const result = await restoreBackup(
        selectedBackup,
      );

      setConfirmationOpen(false);
      setSelectedBackup(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setRestartRequired(
        result.restart_required,
      );

      showSnackbar({
        severity: "success",
        message: result.message,
        autoHideDuration: 8000,
      });
    } catch (error) {
      showSnackbar({
        severity: "error",
        message: translateApiError(
          error,
          "No fue posible preparar la restauración.",
        ),
        autoHideDuration: 8000,
      });
    } finally {
      setIsRestoringBackup(false);
    }
  }

  function handleCancelRestore(): void {
    if (isRestoringBackup) {
      return;
    }

    setConfirmationOpen(false);
    setSelectedBackup(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const operationInProgress =
    isCreatingBackup ||
    isRestoringBackup;

  return (
    <>
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Respaldos
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Crea una copia de seguridad de la
              base de datos, las fotografías y
              los comprobantes de pago. Guarda
              el archivo en una memoria USB,
              Google Drive, OneDrive u otra
              ubicación segura.
            </Typography>

            {restartRequired && (
              <Alert severity="warning">
                Hay una restauración pendiente.
                Cierra completamente la aplicación
                y vuelve a abrirla para aplicar el
                respaldo.
              </Alert>
            )}

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
            >
              <Button
                variant="contained"
                startIcon={
                  <BackupOutlinedIcon />
                }
                disabled={
                  operationInProgress
                }
                onClick={() => {
                  void handleCreateBackup();
                }}
              >
                {isCreatingBackup
                  ? "Creando respaldo..."
                  : "Crear respaldo"}
              </Button>

              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <RestoreOutlinedIcon />
                }
                disabled={
                  operationInProgress ||
                  restartRequired
                }
              >
                Restaurar respaldo

                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept=".zip,application/zip"
                  onChange={(event) => {
                    handleSelectedFile(
                      event.target.files?.[0] ??
                        null,
                    );
                  }}
                />
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={confirmationOpen}
        onClose={
          isRestoringBackup
            ? undefined
            : handleCancelRestore
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Restaurar respaldo
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="warning">
              Al reiniciar la aplicación se
              reemplazarán las reservaciones,
              clientes, pagos, fotografías y
              comprobantes actuales por los del
              respaldo seleccionado.
            </Alert>

            <Typography>
              Antes de restaurar, el sistema
              creará automáticamente un respaldo
              de seguridad del estado actual.
            </Typography>

            {selectedBackup && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  overflowWrap: "anywhere",
                }}
              >
                Archivo: {selectedBackup.name}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="outlined"
            disabled={isRestoringBackup}
            onClick={handleCancelRestore}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="warning"
            disabled={isRestoringBackup}
            onClick={() => {
              void handleConfirmRestore();
            }}
          >
            {isRestoringBackup
              ? "Validando..."
              : "Preparar restauración"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BackupCard;