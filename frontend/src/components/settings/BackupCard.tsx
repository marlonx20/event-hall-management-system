import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useSnackbar } from "../../hooks/useSnackbar";
import {
  createBackup,
  downloadBackup,
} from "../../services/backupService";
import { translateApiError } from "../../utils/translateApiError";

function BackupCard() {
  const { showSnackbar } = useSnackbar();

  const [isCreatingBackup, setIsCreatingBackup] =
    useState(false);

  async function handleCreateBackup(): Promise<void> {
    setIsCreatingBackup(true);

    try {
      const backup =
        await createBackup();

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

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Respaldos
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Crea una copia de seguridad de la base
            de datos, las fotografías y los
            comprobantes de pago. Guarda el archivo
            en una memoria USB, Google Drive,
            OneDrive u otra ubicación segura.
          </Typography>

          <Button
            variant="contained"
            startIcon={
              <BackupOutlinedIcon />
            }
            disabled={isCreatingBackup}
            onClick={() => {
              void handleCreateBackup();
            }}
            sx={{
              alignSelf: "flex-start",
            }}
          >
            {isCreatingBackup
              ? "Creando respaldo..."
              : "Crear respaldo"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BackupCard;