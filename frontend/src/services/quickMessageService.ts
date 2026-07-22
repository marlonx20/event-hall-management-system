import { httpClient } from "../api/httpClient";
import type {
  QuickMessage,
  QuickMessageCreate,
  QuickMessageUpdate,
} from "../types/quickMessage";

export async function getQuickMessages(): Promise<QuickMessage[]> {
  const response = await httpClient.get<QuickMessage[]>(
    "/quick-messages",
  );

  return response.data;
}

export async function createQuickMessage(
  messageData: QuickMessageCreate,
): Promise<QuickMessage> {
  const response = await httpClient.post<QuickMessage>(
    "/quick-messages",
    messageData,
  );

  return response.data;
}

export async function updateQuickMessage(
  messageId: number,
  messageData: QuickMessageUpdate,
): Promise<QuickMessage> {
  const response = await httpClient.put<QuickMessage>(
    `/quick-messages/${messageId}`,
    messageData,
  );

  return response.data;
}

export async function deleteQuickMessage(
  messageId: number,
): Promise<void> {
  await httpClient.delete(`/quick-messages/${messageId}`);
}