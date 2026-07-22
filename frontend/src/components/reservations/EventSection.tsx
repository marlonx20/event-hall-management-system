import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface EventSectionProps {
  formData: ReservationFormData;
  onChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ) => void;
}

function EventSection({
  formData,
  onChange,
}: EventSectionProps) {
  return (
    <FormSection title="2. Detalles del evento">
      <Stack spacing={2.5}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Fecha del evento *"
              value={formData.eventDate}
              onChange={(value) => {
                onChange("eventDate", value);
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <TimePicker
              label="Hora inicio *"
              value={formData.startTime}
              onChange={(value) => {
                onChange("startTime", value);
              }}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <TimePicker
              label="Hora fin *"
              value={formData.endTime}
              onChange={(value) => {
                onChange("endTime", value);
              }}
              ampm
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: true,
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small" required>
              <InputLabel>Tipo de evento</InputLabel>

              <Select
                label="Tipo de evento"
                value={formData.eventType}
                onChange={(event) => {
                  onChange("eventType", event.target.value);
                }}
              >
                <MenuItem value="">
                  <em>Seleccionar...</em>
                </MenuItem>

                <MenuItem value="Cumpleaños">
                  Cumpleaños
                </MenuItem>

                <MenuItem value="Bautizo">
                  Bautizo
                </MenuItem>

                <MenuItem value="XV años">
                  XV años
                </MenuItem>

                <MenuItem value="Boda">
                  Boda
                </MenuItem>

                <MenuItem value="Baby shower">
                  Baby shower
                </MenuItem>

                <MenuItem value="Otro">
                  Otro
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              type="number"
              label="Personas"
              value={formData.guestCount ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onChange(
                  "guestCount",
                  value === "" ? null : Number(value),
                );
              }}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <FormControl
              fullWidth
              size="small"
              required
          >
              <InputLabel>Brincolín</InputLabel>

              <Select
                label="Brincolín"
                value={
                  formData.hasBouncyCastle === null
                    ? ""
                    : String(formData.hasBouncyCastle)
                }
                onChange={(event) => {
                  onChange(
                    "hasBouncyCastle",
                    event.target.value === "true",
                  );
                }}
              >
                <MenuItem value="">
                  <em>Seleccionar...</em>
                </MenuItem>

                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Stack>
    </FormSection>
  );
}

export default EventSection;