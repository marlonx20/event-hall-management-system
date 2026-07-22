import { httpClient } from "../api/httpClient";
import type {
  Customer,
  CustomerCreate,
} from "../types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const response = await httpClient.get<Customer[]>("/customers");

  return response.data;
}

export async function createCustomer(
  customerData: CustomerCreate,
): Promise<Customer> {
  const response = await httpClient.post<Customer>(
    "/customers",
    customerData,
  );

  return response.data;
}