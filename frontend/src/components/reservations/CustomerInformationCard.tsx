import {
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import type { Customer } from "../../types/customer";

interface CustomerInformationCardProps {
  customer: Customer | null;
}

function getContactLabel(value: string): string {
  switch (value.toLowerCase()) {
    case "facebook":
      return "Facebook";

    case "whatsapp":
      return "WhatsApp";

    case "phone":
      return "Teléfono";

    default:
      return value;
  }
}

function CustomerInformationCard({
  customer,
}: CustomerInformationCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2.5,
          }}
        >
          Cliente
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomerDetail
              label="Nombre"
              value={
                customer?.full_name ??
                "Cliente no encontrado"
              }
            />
          </Grid>

          {customer?.phone_number && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomerDetail
                label="Teléfono"
                value={customer.phone_number}
              />
            </Grid>
          )}

          {customer?.messenger_user_name && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomerDetail
                label="Facebook"
                value={customer.messenger_user_name}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomerDetail
              label="Contacto preferido"
              value={
                customer
                  ? getContactLabel(
                      customer.preferred_contact_method,
                    )
                  : "No especificado"
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

interface CustomerDetailProps {
  label: string;
  value: string;
}

function CustomerDetail({
  label,
  value,
}: CustomerDetailProps) {
  return (
    <>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontWeight: 600,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Typography>
    </>
  );
}

export default CustomerInformationCard;