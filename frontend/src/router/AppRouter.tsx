import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import CalendarPage from "../pages/CalendarPage";
import CustomerDetailPage from "../pages/CustomerDetailPage";
import CustomersPage from "../pages/CustomersPage";
import DashboardPage from "../pages/DashboardPage";
import EditCustomerPage from "../pages/EditCustomerPage";
import EditReservationPage from "../pages/EditReservationPage";
import HelpPage from "../pages/HelpPage";
import NewCustomerPage from "../pages/NewCustomerPage";
import NewReservationPage from "../pages/NewReservationPage";
import ReservationDetailPage from "../pages/ReservationDetailPage";
import ReservationsPage from "../pages/ReservationsPage";
import ResourcesPage from "../pages/ResourcesPage";
import SettingsPage from "../pages/SettingsPage";
import TasksPage from "../pages/TasksPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            index
            element={<DashboardPage />}
          />

          <Route
            path="calendar"
            element={<CalendarPage />}
          />

          <Route
            path="reservations"
            element={<ReservationsPage />}
          />

          <Route
            path="reservations/new"
            element={<NewReservationPage />}
          />

          <Route
            path="reservations/:reservationId"
            element={<ReservationDetailPage />}
          />

          <Route
            path="reservations/:reservationId/edit"
            element={<EditReservationPage />}
          />

          <Route
            path="customers"
            element={<CustomersPage />}
          />

          <Route
            path="customers/new"
            element={<NewCustomerPage />}
          />

          <Route
            path="customers/:customerId"
            element={<CustomerDetailPage />}
          />

          <Route
            path="customers/:customerId/edit"
            element={<EditCustomerPage />}
          />

          <Route
            path="tasks"
            element={<TasksPage />}
          />

          <Route
            path="resources"
            element={<ResourcesPage />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />

          <Route
            path="help"
            element={<HelpPage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;