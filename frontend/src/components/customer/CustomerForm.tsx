import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
} from "../../types/customer";

interface CustomerFormData {
  fullName: string;
  phoneNumber: string;
  preferredContactMethod:
    | ""
    | "whatsapp"
    | "phone"
    | "facebook";
  messengerUserName: string;
  notes: string;
}

interface CustomerFormProps {
  customer?: Customer | null;
  isSaving: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (
    customerData:
      | CustomerCreate
      | CustomerUpdate,
  ) => void;
}

const emptyFormData: CustomerFormData = {
  fullName: "",
  phoneNumber: "",
  preferredContactMethod: "",
  messengerUserName: "",
  notes: "",
};

function CustomerForm({
  customer = null,
  isSaving,
  submitLabel,
  onCancel,
  onSubmit,
}: CustomerFormProps) {
  const [formData, setFormData] =
    useState<CustomerFormData>(
      emptyFormData,
    );

  useEffect(() => {
    if (!customer) {
      setFormData(emptyFormData);
      return;
    }

    setFormData({
      fullName: customer.full_name,
      phoneNumber:
        customer.phone_number ?? "",
      preferredContactMethod:
        customer.preferred_contact_method as CustomerFormData["preferredContactMethod"],
      messengerUserName:
        customer.messenger_user_name ?? "",
      notes: customer.notes ?? "",
    });
  }, [customer]);

  function handleChange<
    K extends keyof CustomerFormData,
  >(
    field: K,
    value: CustomerFormData[K],
  ): void {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  function handleSubmit(): void {
    onSubmit({
      full_name:
        formData.fullName.trim(),
      phone_number:
        formData.phoneNumber.trim() || null,
      preferred_contact_method:
        formData.preferredContactMethod,
      messenger_user_name:
        formData.messengerUserName.trim() ||
        null,
      notes:
        formData.notes.trim() || null,
    });
  }

  const isFormValid =
    formData.fullName.trim().length > 0 &&
    formData.preferredContactMethod !== "";

  return (
    <Card sx={{ maxWidth: 860 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                required
                label="Nombre completo"
                value={formData.fullName}
                disabled={isSaving}
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
                disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
          >
            <InputLabel>
              Método de contacto preferido
            </InputLabel>

            <Select
              label="Método de contacto preferido"
              value={
                formData.preferredContactMethod
              }
              onChange={(event) => {
                handleChange(
                  "preferredContactMethod",
                  event.target
                    .value as CustomerFormData["preferredContactMethod"],
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
            disabled={isSaving}
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
              disabled={isSaving}
              onClick={onCancel}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              disabled={!isFormValid || isSaving}
              onClick={handleSubmit}
            >
              {isSaving
                ? "Guardando..."
                : submitLabel}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CustomerForm;