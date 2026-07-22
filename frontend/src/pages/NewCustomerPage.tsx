import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateCustomer } from "../hooks/useCreateCustomer";

interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  preferredContactMethod: "" | "whatsapp" | "phone" | "facebook";
  messengerUserName: string;
  notes: string;
}

const initialCustomerFormData: CustomerFormData = {
  fullName: "",
  phoneNumber: "",
  preferredContactMethod: "",
  messengerUserName: "",
  notes: "",
};

function NewCustomerPage() {
  const navigate = useNavigate();
  const createCustomerMutation = useCreateCustomer();

  const [formData, setFormData] =
    useState<CustomerFormData>(
      initialCustomerFormData,
    );

  function handleChange<
    K extends keyof CustomerFormData,
  >(
    field: K,
    value: CustomerFormData[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit() {
    createCustomerMutation.mutate(
      {
        full_name: formData.fullName.trim(),
        phone_number:
          formData.phoneNumber.trim() || null,
        preferred_contact_method:
          formData.preferredContactMethod,
        messenger_user_name:
          formData.messengerUserName.trim() || null,
        notes: formData.notes.trim() || null,
      },
      {
        onSuccess: () => {
          navigate(-1);
        },
      },
    );
  }

  const isFormValid =
    formData.fullName.trim().length > 0 &&
    formData.preferredContactMethod !== "";

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          aria-label="Regresar"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Nuevo cliente
        </Typography>
      </Stack>

      <Card sx={{ maxWidth: 860 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {createCustomerMutation.isError && (
              <Alert severity="error">
                No fue posible guardar el cliente.
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 7 }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre completo"
                  value={formData.fullName}
                  onChange={(event) => {
                    handleChange(
                      "fullName",
                      event.target.value,
                    );
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.phoneNumber}
                  onChange={(event) => {
                    handleChange(
                      "phoneNumber",
                      event.target.value,
                    );
                  }}
                  placeholder="Opcional"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Facebook (usuario o enlace)"
              value={formData.messengerUserName}
              onChange={(event) => {
                handleChange(
                  "messengerUserName",
                  event.target.value,
                );
              }}
              placeholder="Ejemplo: maria.perez o https://facebook.com/maria.perez"
            />

            <FormControl
              fullWidth
              size="small"
              required
            >
              <InputLabel>
                Método de contacto preferido
              </InputLabel>

              <Select
                label="Método de contacto preferido"
                value={formData.preferredContactMethod}
                onChange={(event) => {
                  handleChange(
                    "preferredContactMethod",
                    event.target.value as CustomerFormData["preferredContactMethod"],
                  );
                }}
              >
                <MenuItem value="">
                  <em>Seleccionar...</em>
                </MenuItem>

                <MenuItem value="facebook">
                  Facebook
                </MenuItem>

                <MenuItem value="whatsapp">
                  WhatsApp
                </MenuItem>

                <MenuItem value="phone">
                  Teléfono
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Notas del cliente"
              value={formData.notes}
              onChange={(event) => {
                handleChange(
                  "notes",
                  event.target.value,
                );
              }}
              placeholder="Ejemplo: cliente frecuente, prefiere contacto por la tarde..."
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                disabled={createCustomerMutation.isPending}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                disabled={
                  !isFormValid ||
                  createCustomerMutation.isPending
                }
                onClick={handleSubmit}
              >
                {createCustomerMutation.isPending
                  ? "Guardando..."
                  : "Guardar cliente"}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NewCustomerPage;