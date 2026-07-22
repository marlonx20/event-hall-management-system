import { httpClient } from "../api/httpClient";
import type {
  Venue,
  VenueUpdate,
} from "../types/venue";

export async function getVenue(): Promise<Venue> {
  const response =
    await httpClient.get<Venue>("/venue");

  return response.data;
}

export async function updateVenue(
  venueData: VenueUpdate,
): Promise<Venue> {
  const response =
    await httpClient.put<Venue>(
      "/venue",
      venueData,
    );

  return response.data;
}