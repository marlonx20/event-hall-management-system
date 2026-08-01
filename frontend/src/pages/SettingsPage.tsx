import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import BackupCard from "../components/settings/BackupCard";
import BankInformationCard from "../components/settings/BankInformationCard";
import SocialMediaCard from "../components/settings/SocialMediaCard";
import VenueInformationCard from "../components/settings/VenueInformationCard";
import VenuePricesCard from "../components/settings/VenuePricesCard";
import VenueScheduleCard from "../components/settings/VenueScheduleCard";
import { useVenue } from "../hooks/useVenue";
import type {
  Venue,
  VenueUpdate,
} from "../types/venue";

function buildVenueUpdate(
  venue: Venue,
  changes: Partial<VenueUpdate>,
): VenueUpdate {
  return {
    name: venue.name,
    address: venue.address,
    phone: venue.phone,
    capacity: venue.capacity,

    opening_time: venue.opening_time,
    closing_time: venue.closing_time,

    facebook_url: venue.facebook_url,
    whatsapp_number:
      venue.whatsapp_number,
    instagram_url:
      venue.instagram_url,
    website_url: venue.website_url,

    base_price:
      Number(venue.base_price),
    bouncy_castle_cost:
      Number(
        venue.bouncy_castle_cost,
      ),
    extra_hour_price:
      Number(
        venue.extra_hour_price,
      ),

    bank_name: venue.bank_name,
    bank_account_holder:
      venue.bank_account_holder,
    bank_account_number:
      venue.bank_account_number,
    bank_clabe: venue.bank_clabe,

    facebook_response_message:
      venue.facebook_response_message,
    banking_information_message:
      venue.banking_information_message,
    location_message:
      venue.location_message,
    venue_rules_message:
      venue.venue_rules_message,
    payment_reminder_message:
      venue.payment_reminder_message,
    thank_you_message:
      venue.thank_you_message,
    general_notes:
      venue.general_notes,

    ...changes,
  };
}

function SettingsPage() {
  const {
    data: venue,
    isLoading,
    isError,
    refetch,
  } = useVenue();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !venue) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              void refetch();
            }}
          >
            Reintentar
          </Button>
        }
      >
        No fue posible cargar la configuración.
      </Alert>
    );
  }

  const currentVenue = venue;

  return (
    <Box
      sx={{
        maxWidth: 900,
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

      <Stack spacing={3}>
        <VenueInformationCard
          venue={currentVenue}
          buildVenueUpdate={
            buildVenueUpdate
          }
        />

        <VenuePricesCard
          venue={currentVenue}
          buildVenueUpdate={
            buildVenueUpdate
          }
        />

        <VenueScheduleCard
          venue={currentVenue}
          buildVenueUpdate={
            buildVenueUpdate
          }
        />

        <BankInformationCard
          venue={currentVenue}
          buildVenueUpdate={
            buildVenueUpdate
          }
        />

        <SocialMediaCard
          venue={currentVenue}
          buildVenueUpdate={
            buildVenueUpdate
          }
        />

        <BackupCard />
      </Stack>
    </Box>
  );
}

export default SettingsPage