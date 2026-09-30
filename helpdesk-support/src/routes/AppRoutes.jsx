import {
  Navigate,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";


import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import TicketDetails from "../pages/TicketDetails";
import Agents from "../pages/Agents";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

import MainLayout from "../layouts/MainLayout";
import TicketDrawer from "../components/TicketDrawer";

function CreateTicket() {
  const navigate = useNavigate();

  return (
    <TicketDrawer
      isOpen={true}
      onClose={() => navigate("/tickets")}
      onTicketCreated={() =>
        navigate("/tickets")
      }
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/tickets"
          element={<Tickets />}
        />

        <Route
          path="/tickets/:ticketId"
          element={<TicketDetails />}
        />

        <Route
          path="/create-ticket"
          element={<CreateTicket />}
        />

        <Route
          path="/agents"
          element={<Agents />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;