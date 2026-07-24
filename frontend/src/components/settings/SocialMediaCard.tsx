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

interface SocialMediaCardProps {
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

function SocialMediaCard({
  venue,
  buildVenueUpdate,
}: SocialMediaCardProps) {
  const socialMediaMutation = useUpdateVenue();

  const [facebookUrl, setFacebookUrl] =
    useState("");

  const [
    whatsappNumber,
    setWhatsappNumber,
  ] = useState("");

  const [instagramUrl, setInstagramUrl] =
    useState("");

  const [websiteUrl, setWebsiteUrl] =
    useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    setFacebookUrl(
      venue.facebook_url ?? "",
    );

    setWhatsappNumber(
      venue.whatsapp_number ?? "",
    );

    setInstagramUrl(
      venue.instagram_url ?? "",
    );

    setWebsiteUrl(
      venue.website_url ?? "",
    );
  }, [venue]);

  const hasChanges =
    facebookUrl !==
      (venue.facebook_url ?? "") ||
    whatsappNumber !==
      (venue.whatsapp_number ?? "") ||
    instagramUrl !==
      (venue.instagram_url ?? "") ||
    websiteUrl !==
      (venue.website_url ?? "");

  function clearMessages() {
    setValidationMessage(null);
    socialMediaMutation.reset();
  }

  function isValidOptionalUrl(
    value: string,
  ): boolean {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      return true;
    }

    try {
      const url = new URL(normalizedValue);

      return (
        url.protocol === "http:" ||
        url.protocol === "https:"
      );
    } catch {
      return false;
    }
  }

  function handleSave() {
    if (!isValidOptionalUrl(facebookUrl)) {
      setValidationMessage(
        "El enlace de Facebook no es válido.",
      );
      return;
    }

    if (!isValidOptionalUrl(instagramUrl)) {
      setValidationMessage(
        "El enlace de Instagram no es válido.",
      );
      return;
    }

    if (!isValidOptionalUrl(websiteUrl)) {
      setValidationMessage(
        "El enlace del sitio web no es válido.",
      );
      return;
    }

    const normalizedWhatsApp =
      whatsappNumber.replace(
        /[\s()+-]/g,
        "",
      );

    if (
      normalizedWhatsApp.length > 0 &&
      !/^\d{10,15}$/.test(
        normalizedWhatsApp,
      )
    ) {
      setValidationMessage(
        "El número de WhatsApp debe contener entre 10 y 15 dígitos.",
      );
      return;
    }

    setValidationMessage(null);
    socialMediaMutation.reset();

    socialMediaMutation.mutate(
      buildVenueUpdate(venue, {
        facebook_url:
          normalizeOptionalText(
            facebookUrl,
          ),

        whatsapp_number:
          normalizedWhatsApp.length > 0
            ? normalizedWhatsApp
            : null,

        instagram_url:
          normalizeOptionalText(
            instagramUrl,
          ),

        website_url:
          normalizeOptionalText(
            websiteUrl,
          ),
      }),
    );
  }

  return (
    <SettingsSectionCard
      title="Redes sociales y contacto"
      description="Guarda los enlaces y números oficiales del salón."
      saveButtonText="Guardar contacto"
      isSaving={socialMediaMutation.isPending}
      saveDisabled={!hasChanges}
      onSave={handleSave}
      feedback={
        <>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {socialMediaMutation.isError && (
            <Alert severity="error">
              No fue posible guardar la información de contacto.
            </Alert>
          )}

          {socialMediaMutation.isSuccess &&
            !hasChanges && (
              <Alert severity="success">
                Información de contacto guardada correctamente.
              </Alert>
            )}
        </>
      }
    >
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Facebook"
            value={facebookUrl}
            disabled={
              socialMediaMutation.isPending
            }
            onChange={(event) => {
              setFacebookUrl(
                event.target.value,
              );
              clearMessages();
            }}
            placeholder="https://facebook.com/..."
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Número de WhatsApp"
            value={whatsappNumber}
            disabled={
              socialMediaMutation.isPending
            }
            onChange={(event) => {
              setWhatsappNumber(
                event.target.value,
              );
              clearMessages();
            }}
            placeholder="Ejemplo: 4921234567"
            helperText="Incluye lada; puedes agregar código de país."
            slotProps={{
              htmlInput: {
                inputMode: "tel",
                maxLength: 20,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Instagram"
            value={instagramUrl}
            disabled={
              socialMediaMutation.isPending
            }
            onChange={(event) => {
              setInstagramUrl(
                event.target.value,
              );
              clearMessages();
            }}
            placeholder="https://instagram.com/..."
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Sitio web"
            value={websiteUrl}
            disabled={
              socialMediaMutation.isPending
            }
            onChange={(event) => {
              setWebsiteUrl(
                event.target.value,
              );
              clearMessages();
            }}
            placeholder="https://..."
          />
        </Grid>
      </Grid>
    </SettingsSectionCard>
  );
}

export default SocialMediaCard;