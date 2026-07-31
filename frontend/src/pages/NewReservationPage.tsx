import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
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
import { useSnackbar } from "../hooks/useSnackbar";
import { translateApiError } from "../utils/translateApiError";
import type { PaymentCreate } from "../types/payment";
import type { ReservationCreate } from "../types/reservation";
import {
  initialReservationFormData,
  type ReservationFormData,
} from "../types/reservationForm";

function NewReservationPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [searchParams] = useSearchParams();

  const venueScheduleWasApplied = useRef(false);

  const dateFromCalendar = searchParams.get("date");

  const initialEventDate =
    dateFromCalendar && dayjs(dateFromCalendar, "YYYY-MM-DD", true).isValid()
      ? dayjs(dateFromCalendar)
      : null;

  const createReservationMutation = useCreateReservation();

  const [formData, setFormData] = useState<ReservationFormData>(() => ({
    ...initialReservationFormData,
    eventDate: initialEventDate ?? initialReservationFormData.eventDate,
  }));

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [priceWasEdited, setPriceWasEdited] = useState(false);

  const { data: venue } = useVenue();
  const { data: customers = [] } = useCustomers();

  const suggestedPrice =
    !venue || formData.hasBouncyCastle === null
      ? null
      : Number(venue.base_price) +
        (formData.hasBouncyCastle ? Number(venue.bouncy_castle_cost) : 0);

  useEffect(() => {
    if (!venue || venueScheduleWasApplied.current) {
      return;
    }

    venueScheduleWasApplied.current = true;

    setFormData((currentData) => {
      const nextStartTime =
        currentData.startTime ??
        (venue.opening_time ? dayjs(`2000-01-01T${venue.opening_time}`) : null);

      const nextEndTime =
        currentData.endTime ??
        (venue.closing_time ? dayjs(`2000-01-01T${venue.closing_time}`) : null);

      return {
        ...currentData,
        startTime: nextStartTime,
        endTime: nextEndTime,
      };
    });
  }, [venue]);

  useEffect(() => {
    if (suggestedPrice === null || priceWasEdited) {
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      totalPrice: suggestedPrice,
    }));
  }, [suggestedPrice, priceWasEdited]);

  const selectedCustomer =
    customers.find((customer) => customer.id === formData.customerId) ?? null;

  function handleFieldChange<K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ): void {
    if (field === "totalPrice") {
      setPriceWasEdited(true);
    }

    if (field === "hasBouncyCastle" && !priceWasEdited && venue) {
      const hasBouncyCastle = value as boolean | null;

      const nextPrice =
        hasBouncyCastle === null
          ? null
          : Number(venue.base_price) +
            (hasBouncyCastle ? Number(venue.bouncy_castle_cost) : 0);

      setFormData((currentData) => ({
        ...currentData,
        hasBouncyCastle,
        totalPrice: nextPrice,
      }));
    } else {
      setFormData((currentData) => ({
        ...currentData,
        [field]: value,
      }));
    }

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }

  function validateForm(): string[] {
    const errors: string[] = [];

    if (formData.customerId === null) {
      errors.push("Debes seleccionar un cliente.");
    }

    if (!formData.eventDate) {
      errors.push("Debes seleccionar la fecha del evento.");
    }

    if (!formData.startTime) {
      errors.push("Debes seleccionar la hora de inicio.");
    }

    if (!formData.endTime) {
      errors.push("Debes seleccionar la hora de finalización.");
    }

    if (
      formData.startTime &&
      formData.endTime &&
      !formData.endTime.isAfter(formData.startTime)
    ) {
      errors.push(
        "La hora de finalización debe ser posterior a la hora de inicio.",
      );
    }

    if (!formData.eventType.trim()) {
      errors.push("Debes seleccionar el tipo de evento.");
    }

    if (formData.hasBouncyCastle === null) {
      errors.push("Debes indicar si la reservación incluye brincolín.");
    }

    if (formData.guestCount !== null && formData.guestCount < 1) {
      errors.push("El número de personas debe ser mayor que cero.");
    }

    if (formData.totalPrice === null || formData.totalPrice <= 0) {
      errors.push("No fue posible determinar el precio de la reservación.");
    }

    if (
      formData.totalPrice !== null &&
      formData.depositAmount > formData.totalPrice
    ) {
      errors.push("El anticipo no puede superar el precio total.");
    }

    if (formData.depositAmount > 0) {
      if (!formData.paymentMethod) {
        errors.push("Debes seleccionar el método del pago inicial.");
      }

      if (!formData.paymentDate) {
        errors.push("Debes seleccionar la fecha del pago inicial.");
      }
    }

    return errors;
  }

  function buildReservationData(): ReservationCreate {
    return {
      customer_id: formData.customerId!,
      event_date: formData.eventDate!.format("YYYY-MM-DD"),
      start_time: formData.startTime!.format("HH:mm:ss"),
      end_time: formData.endTime?.format("HH:mm:ss") ?? null,
      event_type: formData.eventType.trim() || null,
      guest_count: formData.guestCount,
      has_bouncy_castle: formData.hasBouncyCastle!,
      total_price: formData.totalPrice!,
      status: "pending",
      special_requirements: formData.specialRequirements.trim() || null,
      internal_notes: formData.internalNotes.trim() || null,
    };
  }

  function buildPaymentData(): PaymentCreate | null {
    if (formData.depositAmount <= 0) {
      return null;
    }

    return {
      amount: formData.depositAmount,
      payment_date: formData.paymentDate!.format("YYYY-MM-DD"),
      method: formData.paymentMethod as "cash" | "transfer",
      concept: "deposit",
      reference: formData.paymentReference.trim() || null,
    };
  }

  function handleSubmit() {
    const errors = validateForm();

    setValidationErrors(errors);

    if (errors.length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    createReservationMutation.mutate(
      {
        reservationData: buildReservationData(),
        paymentData: buildPaymentData(),
        paymentReceiptFile:
          formData.paymentReceiptFile,
      },
      {
        onSuccess: (reservation) => {
          showSnackbar({
            severity: "success",
            message:
              "Reservación creada correctamente.",
          });

          navigate("/reservations", {
            replace: true,
            state: {
              reservationId: reservation.id,
            },
          });
        },

        onError: (error) => {
          showSnackbar({
            severity: "error",
            message: translateApiError(
              error,
              "No fue posible guardar la reservación. Revisa la información e inténtalo de nuevo.",
            ),
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
          disabled={createReservationMutation.isPending}
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

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <CustomerSection formData={formData} onChange={handleFieldChange} />

            <EventSection formData={formData} onChange={handleFieldChange} />

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

            <PaymentSection formData={formData} onChange={handleFieldChange} />

            <ReservationSummary
              formData={formData}
              selectedCustomer={selectedCustomer}
              totalPrice={formData.totalPrice}
            />
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <ReservationActions
          validationErrors={validationErrors}
          isSaving={createReservationMutation.isPending}
          saveError={null}
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