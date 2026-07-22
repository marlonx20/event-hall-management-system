import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar, {
  sidebarWidth,
} from "../components/layout/Sidebar";

function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Sidebar />

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          ml: `${sidebarWidth}px`,
          pt: "104px",
          px: 4,
          pb: 4,
          bgcolor: "#F7F8FA",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;