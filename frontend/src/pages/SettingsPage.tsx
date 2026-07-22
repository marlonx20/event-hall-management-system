import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useVenue } from "../hooks/useVenue";
import { useUpdateVenue } from "../hooks/useUpdateVenue";

function SettingsPage() {
  const { data: venue, isLoading } = useVenue();

  const updateVenueMutation = useUpdateVenue();

  const [basePrice, setBasePrice] = useState("");

  const [bouncyCastleCost, setBouncyCastleCost] = useState("");

  const [extraHourPrice, setExtraHourPrice] = useState("");

  const hasChanges =
    venue !== undefined &&
    (basePrice !== venue.base_price ||
      bouncyCastleCost !== venue.bouncy_castle_cost ||
      extraHourPrice !== venue.extra_hour_price);

  useEffect(() => {
    if (!venue) {
      return;
    }

    setBasePrice(venue.base_price);
    setBouncyCastleCost(venue.bouncy_castle_cost);
    setExtraHourPrice(venue.extra_hour_price);
  }, [venue]);

  if (isLoading || !venue) {
    return <>Cargando...</>;
  }

  return (
    <Box
      sx={{
        maxWidth: 700,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
        }}
      >
        Configuración
      </Typography>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 700,
            }}
          >
            Precios
          </Typography>

          <Stack spacing={3}>
            <TextField
              label="Precio base"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              type="number"
              value={basePrice}
              onChange={(event) => setBasePrice(event.target.value)}
            />

            <TextField
              label="Costo del brincolín"
              type="number"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              value={bouncyCastleCost}
              onChange={(event) => setBouncyCastleCost(event.target.value)}
            />

            <TextField
              label="Precio por hora extra"
              type="number"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              value={extraHourPrice}
              onChange={(event) => setExtraHourPrice(event.target.value)}
            />

            {updateVenueMutation.isError && (
              <Alert severity="error">No fue posible guardar.</Alert>
            )}

            {updateVenueMutation.isSuccess && (
              <Alert severity="success">Configuración guardada.</Alert>
            )}

            <Button
              variant="contained"
              disabled={!hasChanges || updateVenueMutation.isPending}
              onClick={() => {
                updateVenueMutation.mutate({
                  ...venue,

                  base_price: Number(basePrice),

                  bouncy_castle_cost: Number(bouncyCastleCost),

                  extra_hour_price: Number(extraHourPrice),
                });
              }}
            >
              {updateVenueMutation.isPending
                ? "Guardando..."
                : "Guardar cambios"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default SettingsPage;
