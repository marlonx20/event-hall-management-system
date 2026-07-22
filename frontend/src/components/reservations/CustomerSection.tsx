import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useCustomers } from "../../hooks/useCustomers";
import type { Customer } from "../../types/customer";
import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface CustomerSectionProps {
  formData: ReservationFormData;
  onChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ) => void;
}

function CustomerSection({
  formData,
  onChange,
}: CustomerSectionProps) {
  const navigate = useNavigate();

  const {
    data: customers = [],
    isLoading,
    isError,
    refetch,
  } = useCustomers();

  const selectedCustomer =
    customers.find(
      (customer) => customer.id === formData.customerId,
    ) ?? null;

  function handleCustomerChange(
    customer: Customer | null,
  ) {
    onChange(
      "customerId",
      customer?.id ?? null,
    );
  }

  return (
    <FormSection title="1. Información del cliente">
      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void refetch();
              }}
            >
              Reintentar
            </Button>
          }
        >
          No fue posible cargar los clientes.
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <Autocomplete
          fullWidth
          options={customers}
          value={selectedCustomer}
          loading={isLoading}
          disabled={isError}
          onChange={(_, customer) => {
            handleCustomerChange(customer);
          }}
          getOptionLabel={(customer) =>
            customer.phone_number
              ? `${customer.full_name} · ${customer.phone_number}`
              : customer.full_name
          }
          isOptionEqualToValue={(option, value) =>
            option.id === value.id
          }
          noOptionsText="No se encontraron clientes"
          loadingText="Cargando clientes..."
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Cliente"
              placeholder="Buscar por nombre o teléfono"
            />
          )}
        />

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate("/customers/new");
          }}
          sx={{
            minWidth: 160,
            whiteSpace: "nowrap",
          }}
        >
          Nuevo cliente
        </Button>
      </Box>

      {selectedCustomer ? (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(70, 140, 0, 0.08)",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {selectedCustomer.full_name}
          </Typography>

          {selectedCustomer.phone_number && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Teléfono: {selectedCustomer.phone_number}
            </Typography>
          )}

          {selectedCustomer.messenger_user_name && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Facebook:{" "}
              <Link
                href={getFacebookUrl(
                  selectedCustomer.messenger_user_name,
                )}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {selectedCustomer.messenger_user_name}
              </Link>
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
            }}
          >
            Contacto preferido:{" "}
            {getPreferredContactMethodLabel(
              selectedCustomer.preferred_contact_method,
            )}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            mt: 1.5,
            color: "text.secondary",
          }}
        >
          Selecciona un cliente existente o crea uno nuevo.
        </Typography>
      )}
    </FormSection>
  );
}

function getPreferredContactMethodLabel(
  value: string | null,
): string {
  switch (value?.toLowerCase()) {
    case "whatsapp":
      return "WhatsApp";

    case "phone":
      return "Teléfono";

    case "facebook":
      return "Facebook";

    default:
      return "Sin preferencia";
  }
}

function getFacebookUrl(value: string): string {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `https://www.facebook.com/${trimmedValue}`;
}

export default CustomerSection;