import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

import type { CalendarDay } from "../../types/calendar";
import CalendarActivityCard from "./CalendarActivityCard";

interface CalendarDayDetailsDialogProps {
  open: boolean;

  calendarDay: CalendarDay | null;

  onClose: () => void;

  onOpenReservation: (reservationId: number) => void;

  onCreateReservation: (date: string) => void;

  onCreateTask: (date: string) => void;
}

function CalendarDayDetailsDialog({
  open,
  calendarDay,
  onClose,
  onOpenReservation,
  onCreateReservation,
  onCreateTask,
}: CalendarDayDetailsDialogProps) {
  if (!calendarDay) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          {dayjs(calendarDay.date).format("D [de] MMMM [de] YYYY")}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                mb: 2,
              }}
            >
              Actividades del día
            </Typography>

            {calendarDay.activities.length === 0 ? (
              <Typography color="text.secondary">
                No hay actividades para este día.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {calendarDay.activities.map((activity) => (
                  <CalendarActivityCard
                    key={activity.key}
                    activity={activity}
                    onClick={() => {
                      if (activity.type === "reservation") {
                        onOpenReservation(activity.id);
                      }

                      // Las tareas se
                      // conectarán cuando
                      // exista su pantalla.
                    }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onCreateTask(calendarDay.date)}>
          Nueva tarea
        </Button>

        <Button
          variant="contained"
          onClick={() => onCreateReservation(calendarDay.date)}
        >
          Nueva reservación
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CalendarDayDetailsDialog;
