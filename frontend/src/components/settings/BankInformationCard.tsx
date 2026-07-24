import {
  Alert,
  Grid,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useUpdateVenue } from "../../hooks/useUpdateVenue";
import type {
  Venue,
  VenueUpdate,
} from "../../types/venue";
import SettingsSectionCard from "./SettingsSectionCard";

interface BankInformationCardProps {
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

function BankInformationCard({
  venue,
  buildVenueUpdate,
}: BankInformationCardProps) {
  const bankMutation = useUpdateVenue();

  const [bankName, setBankName] =
    useState("");

  const [
    accountHolder,
    setAccountHolder,
  ] = useState("");

  const [
    accountNumber,
    setAccountNumber,
  ] = useState("");

  const [clabe, setClabe] =
    useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setBankName(venue.bank_name ?? "");
    setAccountHolder(
      venue.bank_account_holder ?? "",
    );
    setAccountNumber(
      venue.bank_account_number ?? "",
    );
    setClabe(venue.bank_clabe ?? "");
  }, [venue]);

  const hasChanges =
    bankName !== (venue.bank_name ?? "") ||
    accountHolder !==
      (venue.bank_account_holder ?? "") ||
    accountNumber !==
      (venue.bank_account_number ?? "") ||
    clabe !== (venue.bank_clabe ?? "");

  function clearMessages() {
    setValidationMessage(null);
    bankMutation.reset();
  }

  function handleSave() {
    const normalizedClabe =
      clabe.replace(/\s/g, "");

    if (
      normalizedClabe.length > 0 &&
      !/^\d{18}$/.test(normalizedClabe)
    ) {
      setValidationMessage(
        "La CLABE debe contener exactamente 18 dígitos.",
      );
      return;
    }

    setValidationMessage(null);
    bankMutation.reset();

    bankMutation.mutate(
      buildVenueUpdate(venue, {
        bank_name:
          normalizeOptionalText(bankName),
        bank_account_holder:
          normalizeOptionalText(
            accountHolder,
          ),
        bank_account_number:
          normalizeOptionalText(
            accountNumber,
          ),
        bank_clabe:
          normalizedClabe.length > 0
            ? normalizedClabe
            : null,
      }),
    );
  }

  return (
    <SettingsSectionCard
      title="Datos bancarios"
      description="Guarda la información utilizada para recibir anticipos y liquidaciones."
      saveButtonText="Guardar datos bancarios"
      isSaving={bankMutation.isPending}
      saveDisabled={!hasChanges}
      onSave={handleSave}
      feedback={
        <>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {bankMutation.isError && (
            <Alert severity="error">
              No fue posible guardar los datos bancarios.
            </Alert>
          )}

          {bankMutation.isSuccess &&
            !hasChanges && (
              <Alert severity="success">
                Datos bancarios guardados correctamente.
              </Alert>
            )}
        </>
      }
    >
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Banco"
            value={bankName}
            disabled={bankMutation.isPending}
            onChange={(event) => {
              setBankName(event.target.value);
              clearMessages();
            }}
            placeholder="Ejemplo: BBVA"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Titular de la cuenta"
            value={accountHolder}
            disabled={bankMutation.isPending}
            onChange={(event) => {
              setAccountHolder(
                event.target.value,
              );
              clearMessages();
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Número de cuenta o tarjeta"
            value={accountNumber}
            disabled={bankMutation.isPending}
            onChange={(event) => {
              setAccountNumber(
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
            label="CLABE"
            value={clabe}
            disabled={bankMutation.isPending}
            onChange={(event) => {
              setClabe(event.target.value);
              clearMessages();
            }}
            placeholder="18 dígitos"
            slotProps={{
              htmlInput: {
                inputMode: "numeric",
                maxLength: 18,
              },
            }}
          />
        </Grid>
      </Grid>
    </SettingsSectionCard>
  );
}

export default BankInformationCard;