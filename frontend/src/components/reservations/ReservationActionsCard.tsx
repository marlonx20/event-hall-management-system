import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import type { Reservation } from "../../types/reservation";

interface ReservationActionsCardProps {
  reservation: Reservation;
  onRegisterPayment: () => void;
  onCancel: () => void;
  onFinish: () => void;
}

function ReservationActionsCard({
  reservation,
  onRegisterPayment,
  onCancel,
  onFinish,
}: ReservationActionsCardProps) {
  if (
    reservation.status === "cancelled" ||
    reservation.status === "finished"
  ) {
    return null;
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Acciones
        </Typography>

        <Stack spacing={1.5}>
          <Button
            variant="contained"
            disabled={
              Number(
                reservation.remaining_balance,
              ) <= 0
            }
            onClick={onRegisterPayment}
          >
            Registrar pago
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
          >
            Cancelar reservación
          </Button>

          <Button
            variant="outlined"
            disabled={
              reservation.status !== "confirmed"
            }
            onClick={onFinish}
          >
            Finalizar evento
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ReservationActionsCard;