  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import AdditionalInfoSection from "../components/reservations/AdditionalInfoSection";
import CustomerSection from "../components/reservations/CustomerSection";
import EventSection from "../components/reservations/EventSection";
import ReservationSummary from "../components/reservations/ReservationSummary";
import { useCustomers } from "../hooks/useCustomers";
import { useReservation } from "../hooks/useReservation";
import { useUpdateReservation } from "../hooks/useUpdateReservation";
import { useVenue } from "../hooks/useVenue";
import type { ReservationUpdate } from "../types/reservation";
import {
  initialReservationFormData,
  type ReservationFormData,
} from "../types/reservationForm";

function EditReservationPage() {
  const navigate = useNavigate();
  const { reservationId } = useParams();

  const numericReservationId = Number(reservationId);

  const {
    data: reservation,
    isLoading,
    isError,
    refetch,
  } = useReservation(numericReservationId);

  const updateMutation = useUpdateReservation();

  const { data: venue } = useVenue();
  const { data: customers = [] } = useCustomers();

  const [formData, setFormData] =
    useState<ReservationFormData>(
      initialReservationFormData,
    );

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const [initialized, setInitialized] =
    useState(false);

  useEffect(() => {
    if (!reservation || initialized) {
      return;
    }

    setFormData({
      ...initialReservationFormData,
      customerId: reservation.customer_id,
      eventDate: dayjs(reservation.event_date),
      startTime: dayjs(
        `${reservation.event_date}T${reservation.start_time}`,
      ),
      endTime: reservation.end_time
        ? dayjs(
            `${reservation.event_date}T${reservation.end_time}`,
          )
        : null,
      eventType: reservation.event_type ?? "",
      guestCount: reservation.guest_count,
      hasBouncyCastle:
        reservation.has_bouncy_castle,
      specialRequirements:
        reservation.special_requirements ?? "",
      internalNotes:
        reservation.internal_notes ?? "",
      depositAmount: Number(
        reservation.amount_paid,
      ),
    });

    setInitialized(true);
  }, [initialized, reservation]);

  const selectedCustomer =
    customers.find(
      (customer) =>
        customer.id === formData.customerId,
    ) ?? null;

  const totalPrice =
    !venue ||
    formData.hasBouncyCastle === null
      ? null
      : formData.hasBouncyCastle
        ? Number(venue.base_price)
        : Number(venue.base_price) -
          Number(venue.bouncy_castle_cost);

  function handleFieldChange<
    K extends keyof ReservationFormData,
  >(
    field: K,
    value: ReservationFormData[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));

    setValidationErrors([]);
    setSaveError(null);
  }

  function validateForm(): string[] {
    const errors: string[] = [];

    if (formData.customerId === null) {
      errors.push(
        "Debes seleccionar un cliente.",
      );
    }

    if (!formData.eventDate) {
      errors.push(
        "Debes seleccionar la fecha del evento.",
      );
    }

    if (!formData.startTime) {
      errors.push(
        "Debes seleccionar la hora de inicio.",
      );
    }

    if (!formData.endTime) {
      errors.push(
        "Debes seleccionar la hora de finalización.",
      );
    }

    if (
      formData.startTime &&
      formData.endTime &&
      !formData.endTime.isAfter(
        formData.startTime,
      )
    ) {
      errors.push(
        "La hora de finalización debe ser posterior a la hora de inicio.",
      );
    }

    if (!formData.eventType.trim()) {
      errors.push(
        "Debes seleccionar el tipo de evento.",
      );
    }

    if (
      formData.hasBouncyCastle === null
    ) {
      errors.push(
        "Debes indicar si la reservación incluye brincolín.",
      );
    }

    if (
      formData.guestCount !== null &&
      formData.guestCount < 1
    ) {
      errors.push(
        "El número de personas debe ser mayor que cero.",
      );
    }

    return errors;
  }

  function buildUpdateData(): ReservationUpdate {
    return {
      customer_id: formData.customerId!,
      event_date:
        formData.eventDate!.format(
          "YYYY-MM-DD",
        ),
      start_time:
        formData.startTime!.format(
          "HH:mm:ss",
        ),
      end_time:
        formData.endTime?.format(
          "HH:mm:ss",
        ) ?? null,
      event_type:
        formData.eventType.trim() || null,
      guest_count: formData.guestCount,
      has_bouncy_castle:
        formData.hasBouncyCastle!,
      special_requirements:
        formData.specialRequirements.trim() ||
        null,
      internal_notes:
        formData.internalNotes.trim() || null,
    };
  }

  function getErrorMessage(
    error: unknown,
  ): string {
    if (isAxiosError(error)) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        return detail;
      }
    }

    return "No fue posible actualizar la reservación.";
  }

  function handleSubmit() {
    const errors = validateForm();

    setValidationErrors(errors);
    setSaveError(null);

    if (errors.length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    updateMutation.mutate(
      {
        reservationId:
          numericReservationId,
        reservationData:
          buildUpdateData(),
      },
      {
        onSuccess: (updatedReservation) => {
          navigate(
            `/reservations/${updatedReservation.id}`,
            {
              replace: true,
              state: {
                successMessage:
                  "Reservación actualizada correctamente.",
              },
            },
          );
        },

        onError: (error) => {
          setSaveError(
            getErrorMessage(error),
          );

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        },
      },
    );
  }

  if (
    !reservationId ||
    Number.isNaN(numericReservationId)
  ) {
    return (
      <Alert severity="error">
        El identificador de la reservación no es válido.
      </Alert>
    );
  }

  if (isLoading || !initialized) {
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

  if (isError || !reservation) {
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
        No fue posible cargar la reservación.
      </Alert>
    );
  }

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
          disabled={updateMutation.isPending}
          onClick={() => {
            navigate(
              `/reservations/${numericReservationId}`,
            );
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
          Editar reservación
        </Typography>
      </Stack>

      {validationErrors.length > 0 && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          <Box
            component="ul"
            sx={{
              m: 0,
              pl: 2.5,
            }}
          >
            {validationErrors.map((error) => (
              <li key={error}>
                {error}
              </li>
            ))}
          </Box>
        </Alert>
      )}

      {saveError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {saveError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <CustomerSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <EventSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <AdditionalInfoSection
              formData={formData}
              onChange={handleFieldChange}
            />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ReservationSummary
            formData={formData}
            selectedCustomer={
              selectedCustomer
            }
            totalPrice={totalPrice}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          disabled={updateMutation.isPending}
          onClick={() => {
            navigate(
              `/reservations/${numericReservationId}`,
            );
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          disabled={updateMutation.isPending}
          onClick={handleSubmit}
        >
          {updateMutation.isPending
            ? "Guardando..."
            : "Guardar cambios"}
        </Button>
      </Box>
    </Box>
  );
}

export default EditReservationPage;