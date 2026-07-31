import { httpClient } from "../api/httpClient";
import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
} from "../types/customer";

import type { Reservation } from "../types/reservation";
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

export async function getCustomer(
  customerId: number,
): Promise<Customer> {
  const response = await httpClient.get<Customer>(
    `/customers/${customerId}`,
  );

  return response.data;
}

export async function updateCustomer(
  customerId: number,
  customerData: CustomerUpdate,
): Promise<Customer> {
  const response = await httpClient.put<Customer>(
    `/customers/${customerId}`,
    customerData,
  );

  return response.data;
}

export async function getCustomerReservations(
  customerId: number,
): Promise<Reservation[]> {
  const response = await httpClient.get<Reservation[]>(
    `/customers/${customerId}/reservations`,
  );

  return response.data;
}

export async function searchCustomers(
  query: string,
): Promise<Customer[]> {
  const response = await httpClient.get<Customer[]>(
    "/customers/search",
    {
      params: {
        q: query,
      },
    },
  );

  return response.data;
}