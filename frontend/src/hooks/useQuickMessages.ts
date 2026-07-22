import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createQuickMessage,
  deleteQuickMessage,
  getQuickMessages,
  updateQuickMessage,
} from "../services/quickMessageService";
import type {
  QuickMessageCreate,
  QuickMessageUpdate,
} from "../types/quickMessage";

export function useQuickMessages() {
  return useQuery({
    queryKey: ["quick-messages"],
    queryFn: getQuickMessages,
  });
}

export function useCreateQuickMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuickMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quick-messages"],
      });
    },
  });
}

interface UpdateQuickMessageVariables {
  messageId: number;
  messageData: QuickMessageUpdate;
}

export function useUpdateQuickMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      messageData,
    }: UpdateQuickMessageVariables) =>
      updateQuickMessage(messageId, messageData),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quick-messages"],
      });
    },
  });
}

export function useDeleteQuickMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuickMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["quick-messages"],
      });
    },
  });
}

export type QuickMessageFormData = QuickMessageCreate;