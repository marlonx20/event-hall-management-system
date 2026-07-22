import { httpClient } from "../api/httpClient";
import type { DashboardData } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const response = await httpClient.get<DashboardData>("/dashboard");

  return response.data;
}