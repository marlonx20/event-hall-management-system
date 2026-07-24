import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useUpdateVenue } from "../../hooks/useUpdateVenue";
import type {
  Venue,
  VenueUpdate,
} from "../../types/venue";

interface VenueInformationCardProps {
  venue: Venue;

  buildVenueUpdate: (
    venue: Venue,
    changes: Partial<VenueUpdate>,
  ) => VenueUpdate;
}

function normalizeOptionalText(
  value: string,
): string | null {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0
    ? normalizedValue
    : null;
}

function VenueInformationCard({
  venue,
  buildVenueUpdate,
}: VenueInformationCardProps) {
  const informationMutation =
    useUpdateVenue();

  const [name, setName] = useState("");
  const [address, setAddress] =
    useState("");
  const [phone, setPhone] =
    useState("");
  const [capacity, setCapacity] =
    useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setName(venue.name);
    setAddress(venue.address ?? "");
    setPhone(venue.phone ?? "");
    setCapacity(String(venue.capacity));
  }, [venue]);

  const numericCapacity =
    Number(capacity);

  const hasChanges =
    name !== venue.name ||
    address !==
      (venue.address ?? "") ||
    phone !==
      (venue.phone ?? "") ||
    numericCapacity !==
      venue.capacity;

  function clearMessages() {
    setValidationMessage(null);
    informationMutation.reset();
  }

  function handleSave() {
    if (name.trim().length === 0) {
      setValidationMessage(
        "Escribe el nombre del salón.",
      );
      return;
    }

    if (
      !Number.isFinite(
        numericCapacity,
      ) ||
      numericCapacity < 1
    ) {
      setValidationMessage(
        "La capacidad debe ser de al menos una persona.",
      );
      return;
    }

    setValidationMessage(null);

    informationMutation.reset();

    informationMutation.mutate(
      buildVenueUpdate(venue, {
        name: name.trim(),

        address:
          normalizeOptionalText(
            address,
          ),

        phone:
          normalizeOptionalText(
            phone,
          ),

        capacity:
          numericCapacity,
      }),
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          Información del salón
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color:
              "text.secondary",
            mb: 3,
          }}
        >
          Estos datos identifican
          el salón y podrán
          utilizarse posteriormente
          en mensajes y documentos.
        </Typography>

        <Grid
          container
          spacing={2.5}
        >
                      <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              label="Nombre del salón"
              value={name}
              disabled={
                informationMutation.isPending
              }
              onChange={(event) => {
                setName(event.target.value);
                clearMessages();
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Capacidad"
              value={capacity}
              disabled={
                informationMutation.isPending
              }
              onChange={(event) => {
                setCapacity(
                  event.target.value,
                );
                clearMessages();
              }}
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              helperText="Cantidad máxima de personas"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Dirección"
              value={address}
              disabled={
                informationMutation.isPending
              }
              onChange={(event) => {
                setAddress(
                  event.target.value,
                );
                clearMessages();
              }}
              placeholder="Opcional"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Teléfono"
              value={phone}
              disabled={
                informationMutation.isPending
              }
              onChange={(event) => {
                setPhone(
                  event.target.value,
                );
                clearMessages();
              }}
              placeholder="Opcional"
            />
          </Grid>
        </Grid>

        <Stack
          spacing={2}
          sx={{ mt: 3 }}
        >
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {informationMutation.isError && (
            <Alert severity="error">
              No fue posible guardar la
              información del salón.
            </Alert>
          )}

          {informationMutation.isSuccess &&
            !hasChanges && (
              <Alert severity="success">
                Información guardada
                correctamente.
              </Alert>
            )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              disabled={
                !hasChanges ||
                informationMutation.isPending
              }
              onClick={handleSave}
            >
              {informationMutation.isPending
                ? "Guardando..."
                : "Guardar información"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default VenueInformationCard;