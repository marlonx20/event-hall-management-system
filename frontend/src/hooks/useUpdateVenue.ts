import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateVenue } from "../services/venueService";
import type {
  Venue,
  VenueUpdate,
} from "../types/venue";

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation<
    Venue,
    Error,
    VenueUpdate
  >({
    mutationFn: updateVenue,

    onSuccess: async (venue) => {
      queryClient.setQueryData(
        ["venue"],
        venue,
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}