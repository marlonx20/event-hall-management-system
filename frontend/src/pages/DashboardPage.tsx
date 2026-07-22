import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ScheduleItem from "../components/dashboard/ScheduleItem";
import SectionCard from "../components/dashboard/SectionCard";
import StatCard from "../components/dashboard/StatCard";
import { useDashboard } from "../hooks/useDashboard";
import type {
  DashboardReservation,
  DashboardTask,
} from "../types/dashboard";

function formatCurrency(value: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function formatTime(value: string): string {
  const [hours, minutes] = value.split(":");

  const time = new Date();
  time.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(time);
}

function formatDateLabel(value: string): string {
  const targetDate = new Date(`${value}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (targetDate.getTime() === today.getTime()) {
    return "Hoy";
  }

  if (targetDate.getTime() === tomorrow.getTime()) {
    return "Mañana";
  }

  return new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(targetDate);
}

function reservationSubtitle(
  reservation: DashboardReservation,
): string {
  const eventType = reservation.event_type ?? "Evento";

  return `${reservation.customer_name} · ${formatTime(
    reservation.start_time,
  )} · ${eventType}`;
}

function taskSubtitle(task: DashboardTask): string {
  return task.assigned_to
    ? `Asignada a ${task.assigned_to}`
    : "Sin responsable";
}

function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useDashboard();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        severity="error"
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
        No fue posible cargar el Dashboard.
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          Dashboard
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Consulta los eventos y tareas que requieren atención.
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <StatCard
          title="Eventos hoy"
          value={String(data.today_events.length)}
        />

        <StatCard
          title="Tareas pendientes hoy"
          value={String(data.today_tasks.length)}
        />

        <StatCard
          title="Anticipos pendientes"
          value={String(data.pending_reservations.length)}
        />

        <StatCard
          title="Ingreso del mes"
          value={formatCurrency(data.monthly_income)}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3}>
            <SectionCard title="Eventos de hoy">
              {data.today_events.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay evenots para hoy
                </Typography>
              ) : (
                data.today_events.map((reservation) => (
                  <ScheduleItem
                    key={reservation.id}
                    title={
                      reservation.event_type ??
                      "Evento sin tipo especificado"
                    }
                    subtitle={reservationSubtitle(reservation)}
                    statusLabel={
                      reservation.status === "confirmed"
                        ? "Confirmada"
                        : "Pendiente"
                    }
                  />
                ))
              )}
            </SectionCard>

            <SectionCard title="Tareas de hoy">
              {data.today_tasks.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay tareas para hoy.
                </Typography>
              ) : (
                data.today_tasks.map((task) => (
                  <ScheduleItem
                    key={task.id}
                    title={task.title}
                    subtitle={taskSubtitle(task)}
                  />
                ))
              )}
            </SectionCard>

            <SectionCard
              title="Próximos eventos"
              action={
                <Button size="small">
                  Ver calendario
                </Button>
              }
            >
              {data.upcoming_events.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay próximos eventos.
                </Typography>
              ) : (
                data.upcoming_events.map((reservation) => (
                  <ScheduleItem
                    key={reservation.id}
                    dateLabel={formatDateLabel(
                      reservation.event_date,
                    )}
                    title={
                      reservation.event_type ??
                      "Evento sin tipo especificado"
                    }
                    subtitle={reservationSubtitle(reservation)}
                    statusLabel="Confirmada"
                  />
                ))
              )}
            </SectionCard>

            <SectionCard title="Próximas tareas">
              {data.upcoming_tasks.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay próximas tareas.
                </Typography>
              ) : (
                data.upcoming_tasks.map((task) => (
                  <ScheduleItem
                    key={task.id}
                    dateLabel={formatDateLabel(task.due_date)}
                    title={task.title}
                    subtitle={taskSubtitle(task)}
                  />
                ))
              )}
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <SectionCard title="Pendientes de anticipo">
              {data.pending_reservations.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay anticipos pendientes.
                </Typography>
              ) : (
                data.pending_reservations.map((reservation) => (
                  <ScheduleItem
                    key={reservation.id}
                    dateLabel={formatDateLabel(
                      reservation.event_date,
                    )}
                    title={reservation.customer_name}
                    subtitle={
                      reservation.event_type ??
                      "Evento sin tipo especificado"
                    }
                    statusLabel="Pendiente"
                  />
                ))
              )}
            </SectionCard>

            <SectionCard title="Hoy deben liquidar">
              {data.today_pending_payments.length === 0 ? (
                <Typography sx={{ color: "text.secondary" }}>
                  No hay pagos pendientes para hoy.
                </Typography>
              ) : (
                data.today_pending_payments.map((reservation) => (
                  <ScheduleItem
                    key={reservation.id}
                    title={reservation.customer_name}
                    subtitle={`Faltante por pagar: ${formatCurrency(
                      reservation.remaining_balance,
                    )}`}
                  />
                ))
              )}
            </SectionCard>

            <SectionCard title="Próximos pagos por recibir">
  {data.today_pending_payments.length === 0 ? (
    <Typography sx={{ color: "text.secondary" }}>
      No hay pagos próximos por recibir.
    </Typography>
  ) : (
    <>
      {data.today_pending_payments.map((reservation) => (
        <ScheduleItem
          key={reservation.id}
          dateLabel={formatDateLabel(
            reservation.event_date,
          )}
          title={reservation.customer_name}
          subtitle={`Debe ${formatCurrency(
            reservation.remaining_balance,
          )}`}
        />
      ))}

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Total pendiente
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          {formatCurrency(
            data.today_pending_payments.reduce(
              (total, reservation) =>
                total +
                Number(reservation.remaining_balance),
              0,
            ).toString(),
          )}
        </Typography>
      </Box>
    </>
  )}
</SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;