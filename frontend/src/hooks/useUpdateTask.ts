import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateTask } from "../services/taskService";
import type { TaskUpdate } from "../types/task";

interface UpdateTaskVariables {
  taskId: number;
  taskData: TaskUpdate;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      taskData,
    }: UpdateTaskVariables) =>
      updateTask(taskId, taskData),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["tasks"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["calendar"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}