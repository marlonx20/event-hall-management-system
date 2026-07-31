import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import type { CalendarActivity } from "../types/calendarActivity";
import CalendarDayDetailsDialog from "../components/calendar/CalendarDayDetailsDialog";
import type { CalendarDay } from "../types/calendar";
import { useTasks } from "../hooks/useTasks";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCustomers } from "../hooks/useCustomers";
import { useReservations } from "../hooks/useReservations";
import type { Reservation, ReservationStatus } from "../types/reservation";

dayjs.locale("es");

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function getReservationPriority(status: ReservationStatus): number {
  switch (status) {
    case "confirmed":
      return 1;

    case "pending":
      return 2;

    case "finished":
      return 3;

    case "cancelled":
      return 4;
  }
}

function CalendarPage() {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    dayjs().startOf("month"),
  );

  const [selectedCalendarDay, setSelectedCalendarDay] =
    useState<CalendarDay | null>(null);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const {
    data: reservations = [],
    isLoading: reservationsAreLoading,
    isError: reservationsHaveError,
    refetch: refetchReservations,
  } = useReservations();
  const {
    data: tasks = [],
    isLoading: tasksAreLoading,
    isError: tasksHaveError,
    refetch: refetchTasks,
  } = useTasks();

  const {
    data: customers = [],
    isLoading: customersAreLoading,
    isError: customersHaveError,
    refetch: refetchCustomers,
  } = useCustomers();

  const calendarDays = useMemo(() => {
    const firstCalendarDay = currentMonth.startOf("month").startOf("week");

    return Array.from(
      {
        length: 42,
      },
      (_, index) => firstCalendarDay.add(index, "day"),
    );
  }, [currentMonth]);

  const reservationsByDate = useMemo(() => {
    const groupedReservations = new Map<string, Reservation[]>();

    reservations.forEach((reservation) => {
      const existingReservations =
        groupedReservations.get(reservation.event_date) ?? [];

      existingReservations.push(reservation);

      groupedReservations.set(reservation.event_date, existingReservations);
    });

    groupedReservations.forEach((dateReservations) => {
      dateReservations.sort(
        (firstReservation, secondReservation) =>
          getReservationPriority(firstReservation.status) -
          getReservationPriority(secondReservation.status),
      );
    });

    return groupedReservations;
  }, [reservations]);

  const customerNamesById = useMemo(
    () =>
      new Map(customers.map((customer) => [customer.id, customer.full_name])),
    [customers],
  );

  const isLoading =
    reservationsAreLoading || customersAreLoading || tasksAreLoading;

  const hasError =
    reservationsHaveError || customersHaveError || tasksHaveError;

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              void Promise.all([
                refetchReservations(),
                refetchCustomers(),
                refetchTasks(),
              ]);
            }}
          >
            Reintentar
          </Button>
        }
      >
        No fue posible cargar el calendario.
      </Alert>
    );
  }

  function openNewReservation(date?: Dayjs) {
    if (date) {
      navigate(`/reservations/new?date=${date.format("YYYY-MM-DD")}`);
      return;
    }

    navigate("/reservations/new");
  }

  function handleDayClick(day: Dayjs) {
    const dateKey = day.format("YYYY-MM-DD");

    const dateReservations = reservationsByDate.get(dateKey) ?? [];

    const reservationActivities: CalendarActivity[] = dateReservations.map(
      (reservation) => {
        const customerName =
          customerNamesById.get(reservation.customer_id) ??
          "Cliente no encontrado";

        const startTime = reservation.start_time.slice(0, 5);

        const endTime = reservation.end_time
          ? reservation.end_time.slice(0, 5)
          : null;

        return {
          key: `reservation-${reservation.id}`,
          id: reservation.id,
          type: "reservation",
          date: reservation.event_date,
          title: reservation.event_type ?? "Evento sin especificar",
          subtitle: customerName,
          time: endTime ? `${startTime} - ${endTime}` : startTime,
          status: reservation.status,
          customerName,
        };
      },
    );

    const taskActivities: CalendarActivity[] = tasks
      .filter((task) => task.due_date === dateKey)
      .map((task) => ({
        key: `task-${task.id}`,
        id: task.id,
        type: "task",
        date: task.due_date ?? dateKey,
        title: task.title,
        subtitle: task.assigned_to ? `Responsable: ${task.assigned_to}` : null,
        time: null,
        status: task.status,
        assignedTo: task.assigned_to,
      }));

    const activities = [...reservationActivities, ...taskActivities].sort(
      (firstActivity, secondActivity) => {
        if (firstActivity.time && secondActivity.time) {
          return firstActivity.time.localeCompare(secondActivity.time);
        }

        if (firstActivity.time) {
          return -1;
        }

        if (secondActivity.time) {
          return 1;
        }

        return firstActivity.title.localeCompare(secondActivity.title, "es");
      },
    );

    const calendarDay: CalendarDay = {
      date: dateKey,
      activities,
      isCurrentMonth: day.isSame(currentMonth, "month"),
      isToday: day.isSame(dayjs(), "day"),
    };

    setSelectedCalendarDay(calendarDay);
    setDetailsDialogOpen(true);
  }

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Calendario
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Consulta reservaciones y fechas disponibles.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            openNewReservation();
          }}
        >
          Nueva reservación
        </Button>
      </Stack>

      <Card
        sx={{
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Stack
              direction="row"
              spacing={12}
              sx={{
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="Mes anterior"
                onClick={() => {
                  setCurrentMonth((month) => month.subtract(1, "month"));
                }}
              >
                <ChevronLeftIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{
                  width: 190,
                  flexShrink: 0,
                  textAlign: "center",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {currentMonth.format("MMMM [de] YYYY")}
              </Typography>

              <IconButton
                aria-label="Mes siguiente"
                onClick={() => {
                  setCurrentMonth((month) => month.add(1, "month"));
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              disabled={currentMonth.isSame(dayjs(), "month")}
              onClick={() => {
                setCurrentMonth(dayjs().startOf("month"));
              }}
            >
              Hoy
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          {weekDays.map((weekDay) => (
            <Box
              key={weekDay}
              sx={{
                py: 1.5,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                }}
              >
                {weekDay}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          }}
        >
          {calendarDays.map((day) => {
            const dateKey = day.format("YYYY-MM-DD");

            const dateReservations = reservationsByDate.get(dateKey) ?? [];

            const dateTasks = tasks.filter((task) => task.due_date === dateKey);

            const mainReservation = dateReservations[0];

            const additionalReservations = Math.max(
              dateReservations.length - 1,
              0,
            );

            const belongsToCurrentMonth = day.isSame(currentMonth, "month");

            const isToday = day.isSame(dayjs(), "day");

            const customerName = mainReservation
              ? (customerNamesById.get(mainReservation.customer_id) ??
                "Cliente no encontrado")
              : null;

            return (
              <Box
                key={dateKey}
                role="button"
                tabIndex={0}
                onClick={() => {
                  handleDayClick(day);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleDayClick(day);
                  }
                }}
                sx={{
                  minHeight: {
                    xs: 110,
                    md: 145,
                  },
                  p: 1.25,
                  borderRight: "1px solid",
                  borderBottom: "1px solid",
                  border: isToday ? "2px solid" : undefined,

                  borderColor: isToday ? "success.main" : "divider",
                  color: isToday ? "primary.main" : "inherit",
                  cursor: "pointer",
                  bgcolor: isToday
                    ? "rgba(76, 175, 80, 0.14)"
                    : belongsToCurrentMonth
                      ? "background.paper"
                      : "grey.100",
                  opacity: belongsToCurrentMonth ? 1 : 0.55,
                  transition:
                    "background-color .15s ease, border-color .15s ease",
                  "&:hover": {
                    bgcolor: isToday
                      ? "rgba(76, 175, 80, 0.20)"
                      : "action.hover",
                  },
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: -2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      color: isToday ? "primary.main" : "text.primary",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 800 : 600,
                      }}
                    >
                      {day.date()}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    {dateTasks.length > 0 ? (
                      <Box
                        title={`${dateTasks.length} ${
                          dateTasks.length === 1 ? "tarea" : "tareas"
                        }`}
                        sx={{
                          minWidth: 27,
                          height: 24,
                          px: 0.6,
                          borderRadius: 1.25,
                          bgcolor: "secondary.main",
                          color: "secondary.contrastText",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.35,
                          boxShadow: 1,
                        }}
                      >
                        <AssignmentTurnedInOutlinedIcon
                          sx={{
                            fontSize: 15,
                          }}
                        />

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          {dateTasks.length}
                        </Typography>
                      </Box>
                    ) : (
                      !mainReservation &&
                      belongsToCurrentMonth && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          Disponible
                        </Typography>
                      )
                    )}
                  </Stack>
                </Box>

                {mainReservation && (
                  <Box
                    sx={{
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 1.25,
                      bgcolor:
                        mainReservation.status === "confirmed"
                          ? "success.main"
                          : mainReservation.status === "pending"
                            ? "warning.main"
                            : mainReservation.status === "cancelled"
                              ? "error.main"
                              : "grey.300",
                      color:
                        mainReservation.status === "finished"
                          ? "text.primary"
                          : "common.white",
                      boxShadow: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        fontWeight: 700,
                        opacity: 0.9,
                        mb: 0.25,
                      }}
                    >
                      {mainReservation.status === "cancelled"
                        ? "Cancelada"
                        : (mainReservation.event_type ?? "Evento")}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {customerName}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.9,
                      }}
                    >
                      {mainReservation.start_time.slice(0, 5)}
                    </Typography>

                    {additionalReservations > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          fontWeight: 700,
                        }}
                      >
                        +{additionalReservations} reservación
                        {additionalReservations === 1 ? "" : "es"}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Card>

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          mt: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
          }}
        >
          Estados:
        </Typography>

        <LegendItem
          label="Pendiente"
          backgroundColor="warning.main"
          textColor="common.white"
        />

        <LegendItem
          label="Confirmada"
          backgroundColor="success.main"
          textColor="common.white"
        />

        <LegendItem
          label="Finalizada"
          backgroundColor="grey.300"
          textColor="text.primary"
        />

        <LegendItem
          label="Cancelada"
          backgroundColor="error.main"
          textColor="common.white"
        />
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            alignItems: "center",
          }}
        >
          <AssignmentTurnedInOutlinedIcon color="secondary" fontSize="small" />

          <Typography variant="body2">Tareas</Typography>
        </Stack>
      </Stack>

      <CalendarDayDetailsDialog
        open={detailsDialogOpen}
        calendarDay={selectedCalendarDay}
        onClose={() => {
          setDetailsDialogOpen(false);
        }}
        onOpenReservation={(reservationId) => {
          setDetailsDialogOpen(false);
          navigate(`/reservations/${reservationId}`);
        }}
        onOpenTask={(taskId) => {
          setDetailsDialogOpen(false);

          navigate(`/tasks?taskId=${taskId}`);
        }}
        onCreateReservation={(date) => {
          setDetailsDialogOpen(false);
          navigate(`/reservations/new?date=${date}`);
        }}
        onCreateTask={(date) => {
          setDetailsDialogOpen(false);

          navigate(`/tasks?date=${date}`);
        }}
      />
    </Box>
  );
}

interface LegendItemProps {
  label: string;
  backgroundColor: string;
  textColor: string;
}

function LegendItem({ label, backgroundColor, textColor }: LegendItemProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.25,
        py: 0.5,
        borderRadius: 1.5,
        bgcolor: backgroundColor,
        color: textColor,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default CalendarPage;
