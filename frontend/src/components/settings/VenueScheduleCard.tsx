import {
  Alert,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useUpdateVenue } from "../../hooks/useUpdateVenue";
import type {
  Venue,
  VenueUpdate,
} from "../../types/venue";
import SettingsSectionCard from "./SettingsSectionCard";

interface VenueScheduleCardProps {
  venue: Venue;
  buildVenueUpdate: (
    venue: Venue,
    changes: Partial<VenueUpdate>,
  ) => VenueUpdate;
}

function normalizeTime(
  value: string | null,
): string {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}

function VenueScheduleCard({
  venue,
  buildVenueUpdate,
}: VenueScheduleCardProps) {
  const scheduleMutation = useUpdateVenue();

  const [openingTime, setOpeningTime] =
    useState("");
  const [closingTime, setClosingTime] =
    useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setOpeningTime(
      normalizeTime(venue.opening_time),
    );
    setClosingTime(
      normalizeTime(venue.closing_time),
    );
  }, [venue]);

  const currentOpeningTime =
    normalizeTime(venue.opening_time);

  const currentClosingTime =
    normalizeTime(venue.closing_time);

  const hasChanges =
    openingTime !== currentOpeningTime ||
    closingTime !== currentClosingTime;

  function clearMessages() {
    setValidationMessage(null);
    scheduleMutation.reset();
  }

  function handleSave() {
    if (
      openingTime.length > 0 &&
      closingTime.length > 0 &&
      closingTime <= openingTime
    ) {
      setValidationMessage(
        "La hora de cierre debe ser posterior a la hora de apertura.",
      );
      return;
    }

    setValidationMessage(null);
    scheduleMutation.reset();

    scheduleMutation.mutate(
      buildVenueUpdate(venue, {
        opening_time:
          openingTime.length > 0
            ? openingTime
            : null,
        closing_time:
          closingTime.length > 0
            ? closingTime
            : null,
      }),
    );
  }

  return (
  <SettingsSectionCard
    title="Horarios del salón"
    description="Define el horario habitual de apertura y cierre del salón."
    saveButtonText="Guardar horarios"
    isSaving={scheduleMutation.isPending}
    saveDisabled={!hasChanges}
    onSave={handleSave}
    feedback={
      <>
        {validationMessage && (
          <Alert severity="warning">
            {validationMessage}
          </Alert>
        )}

        {scheduleMutation.isError && (
          <Alert severity="error">
            No fue posible guardar los horarios.
          </Alert>
        )}

        {scheduleMutation.isSuccess &&
          !hasChanges && (
            <Alert severity="success">
              Horarios guardados correctamente.
            </Alert>
          )}
      </>
    }
  >
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TimeField
  label="Hora de apertura"
  value={
    openingTime
      ? dayjs(
          `2000-01-01T${openingTime}`,
        )
      : null
  }
  format="HH:mm"
  disabled={scheduleMutation.isPending}
  onChange={(value: Dayjs | null) => {
    setOpeningTime(
      value
        ? value.format("HH:mm")
        : "",
    );

    clearMessages();
  }}
  slotProps={{
    textField: {
      fullWidth: true,
    },
  }}
/>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <TimeField
  label="Hora de cierre"
  value={
    closingTime
      ? dayjs(
          `2000-01-01T${closingTime}`,
        )
      : null
  }
  format="HH:mm"
  disabled={scheduleMutation.isPending}
  onChange={(value: Dayjs | null) => {
    setClosingTime(
      value
        ? value.format("HH:mm")
        : "",
    );

    clearMessages();
  }}
  slotProps={{
    textField: {
      fullWidth: true,
    },
  }}
/>
      </Grid>
    </Grid>
  </SettingsSectionCard>
);
}

export default VenueScheduleCard;