import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
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

interface VenuePricesCardProps {
  venue: Venue;
  buildVenueUpdate: (
    venue: Venue,
    changes: Partial<VenueUpdate>,
  ) => VenueUpdate;
}

function VenuePricesCard({
  venue,
  buildVenueUpdate,
}: VenuePricesCardProps) {
  const pricesMutation = useUpdateVenue();

  const [basePrice, setBasePrice] =
    useState("");

  const [
    bouncyCastleCost,
    setBouncyCastleCost,
  ] = useState("");

  const [
    extraHourPrice,
    setExtraHourPrice,
  ] = useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setBasePrice(venue.base_price);
    setBouncyCastleCost(
      venue.bouncy_castle_cost,
    );
    setExtraHourPrice(
      venue.extra_hour_price,
    );
  }, [venue]);

  const hasChanges =
    basePrice !== venue.base_price ||
    bouncyCastleCost !==
      venue.bouncy_castle_cost ||
    extraHourPrice !==
      venue.extra_hour_price;

  function clearMessages() {
    setValidationMessage(null);
    pricesMutation.reset();
  }

  function handleSave() {
    const numericBasePrice =
      Number(basePrice);

    const numericBouncyCastleCost =
      Number(bouncyCastleCost);

    const numericExtraHourPrice =
      Number(extraHourPrice);

    if (
      !Number.isFinite(numericBasePrice) ||
      numericBasePrice < 0
    ) {
      setValidationMessage(
        "El precio base no puede ser negativo.",
      );
      return;
    }

    if (
      !Number.isFinite(
        numericBouncyCastleCost,
      ) ||
      numericBouncyCastleCost < 0
    ) {
      setValidationMessage(
        "El costo del brincolín no puede ser negativo.",
      );
      return;
    }

    if (
      !Number.isFinite(
        numericExtraHourPrice,
      ) ||
      numericExtraHourPrice < 0
    ) {
      setValidationMessage(
        "El precio por hora extra no puede ser negativo.",
      );
      return;
    }

    setValidationMessage(null);
    pricesMutation.reset();

    pricesMutation.mutate(
      buildVenueUpdate(venue, {
        base_price: numericBasePrice,
        bouncy_castle_cost:
          numericBouncyCastleCost,
        extra_hour_price:
          numericExtraHourPrice,
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
          Configuración de precios
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 3,
          }}
        >
          Estos precios se utilizarán
          automáticamente al crear nuevas
          reservaciones y calcular cargos
          adicionales.
        </Typography>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Precio base"
              value={basePrice}
              disabled={pricesMutation.isPending}
              onChange={(event) => {
                setBasePrice(event.target.value);
                clearMessages();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                  step: 50,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Costo del brincolín"
              value={bouncyCastleCost}
              disabled={pricesMutation.isPending}
              onChange={(event) => {
                setBouncyCastleCost(
                  event.target.value,
                );
                clearMessages();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                  step: 50,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type="number"
              label="Precio por hora extra"
              value={extraHourPrice}
              disabled={pricesMutation.isPending}
              onChange={(event) => {
                setExtraHourPrice(
                  event.target.value,
                );
                clearMessages();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      $
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  min: 0,
                  step: 50,
                },
              }}
            />
          </Grid>
        </Grid>

        <Stack spacing={2} sx={{ mt: 3 }}>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {pricesMutation.isError && (
            <Alert severity="error">
              No fue posible guardar los precios.
            </Alert>
          )}

          {pricesMutation.isSuccess &&
            !hasChanges && (
              <Alert severity="success">
                Precios guardados correctamente.
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
                pricesMutation.isPending
              }
              onClick={handleSave}
            >
              {pricesMutation.isPending
                ? "Guardando..."
                : "Guardar precios"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default VenuePricesCard;