import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createReservationPayment,
  uploadPaymentReceipt,
} from "../services/paymentService";
import { createReservation } from "../services/reservationService";
import type { PaymentCreate } from "../types/payment";
import type { Reservation, ReservationCreate } from "../types/reservation";

interface CreateReservationVariables {
  reservationData: ReservationCreate;
  paymentData: PaymentCreate | null;
  paymentReceiptFile: File | null;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation<Reservation, Error, CreateReservationVariables>({
    mutationFn: async ({
  reservationData,
  paymentData,
  paymentReceiptFile,
}) => {
      const reservation = await createReservation(reservationData);

      if (paymentData) {
        const payment = await createReservationPayment(
          reservation.id,
          paymentData,
        );

        if (paymentData.method === "transfer" && paymentReceiptFile) {
          await uploadPaymentReceipt(
            reservation.id,
            payment.id,
            paymentReceiptFile,
          );
        }
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
