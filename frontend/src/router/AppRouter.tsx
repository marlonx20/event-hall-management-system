import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import CalendarPage from "../pages/CalendarPage";
import EditReservationPage from "../pages/EditReservationPage";
import CustomersPage from "../pages/CustomersPage";
import DashboardPage from "../pages/DashboardPage";
import ReservationDetailPage from "../pages/ReservationDetailPage";
import NewReservationPage from "../pages/NewReservationPage";
import ReservationsPage from "../pages/ReservationsPage";
import ResourcesPage from "../pages/ResourcesPage";
import SettingsPage from "../pages/SettingsPage";
import TasksPage from "../pages/TasksPage";
import NewCustomerPage from "../pages/NewCustomerPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="calendar" element={<CalendarPage />} />

          <Route path="reservations" element={<ReservationsPage />} />

          <Route path="reservations/new" element={<NewReservationPage />} />

          <Route
            path="reservations/:reservationId"
            element={<ReservationDetailPage />}
          />

          <Route path="customers" element={<CustomersPage />} />

          <Route path="resources" element={<ResourcesPage />} />

          <Route path="customers/new" element={<NewCustomerPage />} />

          <Route path="tasks" element={<TasksPage />} />

          <Route path="settings" element={<SettingsPage />} />

          <Route
            path="reservations/:reservationId/edit"
            element={<EditReservationPage />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
