import { useQuery } from "@tanstack/react-query";

import { getTasks } from "../services/taskService";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}