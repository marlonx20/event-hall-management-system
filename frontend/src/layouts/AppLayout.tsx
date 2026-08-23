import {
  Box,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar, {
  sidebarWidth,
} from "../components/layout/Sidebar";

function AppLayout() {
  const theme = useTheme();

  const isDesktop = useMediaQuery(
    theme.breakpoints.up("md"),
  );

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  function handleOpenMobileMenu() {
    setMobileMenuOpen(true);
  }

  function handleCloseMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Header
        onMenuClick={
          handleOpenMobileMenu
        }
      />

      {isDesktop ? (
        <Box
          sx={{
            position: "fixed",
            top: 72,
            left: 0,
            bottom: 0,
            width: sidebarWidth,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Sidebar />
        </Box>
      ) : (
        <Drawer
          open={mobileMenuOpen}
          onClose={
            handleCloseMobileMenu
          }
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Sidebar
            onNavigate={
              handleCloseMobileMenu
            }
          />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          minHeight: "100vh",

          ml: {
            xs: 0,
            md: `${sidebarWidth}px`,
          },

          pt: {
            xs: "88px",
            md: "104px",
          },

          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          pb: {
            xs: 3,
            md: 4,
          },

          bgcolor: "#C5CCD3",

          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;