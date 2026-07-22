import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AdditionalInfoSection from "../components/reservations/AdditionalInfoSection";
import CustomerSection from "../components/reservations/CustomerSection";
import EventSection from "../components/reservations/EventSection";
import FinancialSection from "../components/reservations/FinancialSection";
import PaymentSection from "../components/reservations/PaymentSection";
import ReservationActions from "../components/reservations/ReservationActions";
import ReservationSummary from "../components/reservations/ReservationSummary";
import { useCreateReservation } from "../hooks/useCreateReservation";
import { useCustomers } from "../hooks/useCustomers";
import { useVenue } from "../hooks/useVenue";
import type { PaymentCreate } from "../types/payment";
import type { ReservationCreate } from "../types/reservation";
import {
  initialReservationFormData,
  type ReservationFormData,
} from "../types/reservationForm";

function NewReservationPage() {
  const navigate = useNavigate();

  const createReservationMutation =
    useCreateReservation();

  const [formData, setFormData] =
    useState<ReservationFormData>(
      initialReservationFormData,
    );

  const [validationErrors, setValidationErrors] =
    useState<string[]>([]);

  const [saveError, setSaveError] =
    useState<string | null>(null);

  const [formValidated, setFormValidated] =
    useState(false);

  const { data: venue } = useVenue();
  const { data: customers = [] } = useCustomers();

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

    if (
      formValidated ||
      validationErrors.length > 0 ||
      saveError
    ) {
      setFormValidated(false);
      setValidationErrors([]);
      setSaveError(null);
    }
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

    if (
      totalPrice === null ||
      totalPrice <= 0
    ) {
      errors.push(
        "No fue posible determinar el precio de la reservación.",
      );
    }

    if (
      totalPrice !== null &&
      formData.depositAmount > totalPrice
    ) {
      errors.push(
        "El anticipo no puede superar el precio total.",
      );
    }

    if (formData.depositAmount > 0) {
      if (!formData.paymentMethod) {
        errors.push(
          "Debes seleccionar el método del pago inicial.",
        );
      }

      if (!formData.paymentDate) {
        errors.push(
          "Debes seleccionar la fecha del pago inicial.",
        );
      }
    }

    return errors;
  }

  function buildReservationData(): ReservationCreate {
    return {
      customer_id: formData.customerId!,
      event_date:
        formData.eventDate!.format("YYYY-MM-DD"),
      start_time:
        formData.startTime!.format("HH:mm:ss"),
      end_time:
        formData.endTime?.format("HH:mm:ss") ??
        null,
      event_type:
        formData.eventType.trim() || null,
      guest_count: formData.guestCount,
      has_bouncy_castle:
        formData.hasBouncyCastle!,
      status: "pending",
      special_requirements:
        formData.specialRequirements.trim() ||
        null,
      internal_notes:
        formData.internalNotes.trim() || null,
    };
  }

  function buildPaymentData(): PaymentCreate | null {
    if (formData.depositAmount <= 0) {
      return null;
    }

    return {
      amount: formData.depositAmount,
      payment_date:
        formData.paymentDate!.format(
          "YYYY-MM-DD",
        ),
      method: formData.paymentMethod as
        | "cash"
        | "transfer",
      concept: "deposit",
      reference:
        formData.paymentReference.trim() ||
        null,
    };
  }

  function getSaveErrorMessage(
    error: unknown,
  ): string {
    if (isAxiosError(error)) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        return detail;
      }

      if (error.response?.status === 409) {
        return "Ya existe una reservación confirmada para esa fecha.";
      }
    }

    return "No fue posible guardar la reservación. Revisa la información e inténtalo de nuevo.";
  }

  function handleSubmit() {
    const errors = validateForm();

    setValidationErrors(errors);
    setSaveError(null);
    setFormValidated(false);

    if (errors.length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    createReservationMutation.mutate(
      {
        reservationData:
          buildReservationData(),
        paymentData: buildPaymentData(),
      },
      {
        onSuccess: (reservation) => {
          setFormValidated(true);

          navigate("/reservations", {
            replace: true,
            state: {
              successMessage:
                "Reservación creada correctamente.",
              reservationId: reservation.id,
            },
          });
        },

        onError: (error) => {
          setSaveError(
            getSaveErrorMessage(error),
          );

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        },
      },
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
          disabled={
            createReservationMutation.isPending
          }
          onClick={() => {
            navigate("/reservations");
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
          Nueva reservación
        </Typography>
      </Stack>

      {formValidated && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
        >
          Reservación guardada correctamente.
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
          <Stack spacing={3}>
            <FinancialSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <PaymentSection
              formData={formData}
              onChange={handleFieldChange}
            />

            <ReservationSummary
              formData={formData}
              selectedCustomer={
                selectedCustomer
              }
              totalPrice={totalPrice}
            />
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <ReservationActions
          validationErrors={
            validationErrors
          }
          isSaving={
            createReservationMutation.isPending
          }
          saveError={saveError}
          onCancel={() => {
            navigate("/reservations");
          }}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
}

export default NewReservationPage;