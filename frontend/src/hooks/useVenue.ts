import { useQuery } from "@tanstack/react-query";

import { getVenue } from "../services/venueService";

export function useVenue() {
  return useQuery({
    queryKey: ["venue"],
    queryFn: getVenue,
  });
}