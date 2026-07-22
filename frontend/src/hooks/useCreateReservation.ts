import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createReservationPayment } from "../services/paymentService";
import { createReservation } from "../services/reservationService";
import type { PaymentCreate } from "../types/payment";
import type {
  Reservation,
  ReservationCreate,
} from "../types/reservation";

interface CreateReservationVariables {
  reservationData: ReservationCreate;
  paymentData: PaymentCreate | null;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation<
    Reservation,
    Error,
    CreateReservationVariables
  >({
    mutationFn: async ({
      reservationData,
      paymentData,
    }) => {
      const reservation = await createReservation(
        reservationData,
      );

      if (paymentData) {
        await createReservationPayment(
          reservation.id,
          paymentData,
        );
      }

      return reservation;
    },

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["reservations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["calendar"],
        }),
      ]);
    },
  });
}