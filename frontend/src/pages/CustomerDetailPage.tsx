import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { useCustomerReservations } from "../hooks/useCustomerReservations";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useCustomer } from "../hooks/useCustomer";

function getPreferredContactMethodLabel(
  value: string,
): string {
  switch (value.toLowerCase()) {
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

function getReservationStatusLabel(
  status: string,
): string {
  switch (status) {
    case "pending":
      return "Pendiente";

    case "confirmed":
      return "Confirmada";

    case "finished":
      return "Finalizada";

    case "cancelled":
      return "Cancelada";

    default:
      return status;
  }
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function CustomerDetailPage() {
  const navigate = useNavigate();

  const { customerId } = useParams();

  const id = Number(customerId);

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useCustomer(id);

  const {
  data: reservations = [],
} = useCustomerReservations(id);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !customer) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            onClick={() => {
              void refetch();
            }}
          >
            Reintentar
          </Button>
        }
      >
        No fue posible cargar el cliente.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
          }}
        >
          {customer.full_name}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<EditOutlinedIcon />}
          onClick={() => {
            navigate(
              `/customers/${customer.id}/edit`,
            );
          }}
        >
          Editar
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Teléfono
              </Typography>

              <Typography>
                {customer.phone_number ??
                  "Sin teléfono"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Contacto preferido
              </Typography>

              <Typography>
                {getPreferredContactMethodLabel(
                  customer.preferred_contact_method,
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Facebook
              </Typography>

              <Typography>
                {customer.messenger_user_name ??
                  "No registrado"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Notas
              </Typography>

              <Typography>
                {customer.notes ??
                  "Sin notas"}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
  <CardContent>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        mb: 2,
      }}
    >
      Reservaciones
    </Typography>

    {reservations.length === 0 ? (
      <Typography color="text.secondary">
        Este cliente todavía no tiene reservaciones.
      </Typography>
    ) : (
      <List disablePadding>
        {reservations.map(
          (reservation, index) => (
            <Box key={reservation.id}>
              <ListItemButton
                onClick={() => {
                  navigate(
                    `/reservations/${reservation.id}`,
                  );
                }}
              >
                <ListItemText
                  primary={formatDate(
                    reservation.event_date,
                  )}
                  secondary={`${reservation.event_type} · ${getReservationStatusLabel(
                    reservation.status,
                  )}`}
                />

                <ChevronRightIcon
                  color="action"
                />
              </ListItemButton>

              {index <
                reservations.length - 1 && (
                <Divider />
              )}
            </Box>
          ),
        )}
      </List>
    )}
  </CardContent>
</Card>
    </Box>
  );
}

export default CustomerDetailPage;