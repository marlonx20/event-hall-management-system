import { httpClient } from "../api/httpClient";

import type {
  Task,
  TaskCreate,
  TaskUpdate,
} from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const response =
    await httpClient.get<Task[]>("/tasks");

  return response.data;
}

export async function getTask(
  taskId: number,
): Promise<Task> {
  const response =
    await httpClient.get<Task>(
      `/tasks/${taskId}`,
    );

  return response.data;
}

export async function createTask(
  taskData: TaskCreate,
): Promise<Task> {
  const response =
    await httpClient.post<Task>(
      "/tasks",
      taskData,
    );

  return response.data;
}

export async function updateTask(
  taskId: number,
  taskData: TaskUpdate,
): Promise<Task> {
  const response =
    await httpClient.put<Task>(
      `/tasks/${taskId}`,
      taskData,
    );

  return response.data;
}

export async function deleteTask(
  taskId: number,
): Promise<void> {
  await httpClient.delete(
    `/tasks/${taskId}`,
  );
}