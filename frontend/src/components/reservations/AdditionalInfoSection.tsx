import {
  Grid,
  TextField,
} from "@mui/material";

import type { ReservationFormData } from "../../types/reservationForm";
import FormSection from "./FormSection";

interface AdditionalInfoSectionProps {
  formData: ReservationFormData;
  onChange: <K extends keyof ReservationFormData>(
    field: K,
    value: ReservationFormData[K],
  ) => void;
}

function AdditionalInfoSection({
  formData,
  onChange,
}: AdditionalInfoSectionProps) {
  return (
    <FormSection title="3. Información adicional">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Requerimientos especiales"
            placeholder="Ejemplo: mesa de dulces, mantelería rosa, proyector, música en vivo..."
            value={formData.specialRequirements}
            onChange={(event) => {
              onChange(
                "specialRequirements",
                event.target.value,
              );
            }}
            slotProps={{
              htmlInput: {
                maxLength: 500,
              },
            }}
            helperText={`${formData.specialRequirements.length} / 500`}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            multiline
            minRows={5}
            label="Notas internas"
            placeholder="Notas que solamente puede ver el personal del salón."
            value={formData.internalNotes}
            onChange={(event) => {
              onChange(
                "internalNotes",
                event.target.value,
              );
            }}
            slotProps={{
              htmlInput: {
                maxLength: 500,
              },
            }}
            helperText={`${formData.internalNotes.length} / 500`}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
}

export default AdditionalInfoSection;