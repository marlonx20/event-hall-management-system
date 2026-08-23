import {
  CalendarMonth,
  Dashboard,
  EventNote,
  Groups,
  HelpOutlined,
  Settings,
  TaskAlt,
} from "@mui/icons-material";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const sidebarWidth = 248;

interface SidebarProps {
  onNavigate?: () => void;
}

const mainItems = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/",
  },
  {
    label: "Calendario",
    icon: <CalendarMonth />,
    path: "/calendar",
  },
  {
    label: "Reservaciones",
    icon: <EventNote />,
    path: "/reservations",
  },
  {
    label: "Clientes",
    icon: <Groups />,
    path: "/customers",
  },
  {
    label: "Tareas del salón",
    icon: <TaskAlt />,
    path: "/tasks",
  },
  {
    label: "Recursos",
    icon: <CollectionsBookmarkOutlinedIcon />,
    path: "/resources",
  },
  {
    label: "Configuración",
    icon: <Settings />,
    path: "/settings",
  },
];

function Sidebar({
  onNavigate,
}: SidebarProps) {
  return (
    <Box
      component="aside"
      sx={{
        width: sidebarWidth,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        px: 2,
        py: 3,
        boxSizing: "border-box",
      }}
    >
      <Typography
        variant="overline"
        sx={{
          px: 1.5,
          mb: 1.5,
          color: "text.secondary",
          fontWeight: 700,
          letterSpacing: 1.1,
        }}
      >
        Menú principal
      </Typography>

      <List disablePadding>
        {mainItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {({ isActive }) => (
              <ListItemButton
                selected={isActive}
                sx={{
                  minHeight: 46,
                  mb: 0.75,
                  px: 1.5,
                  borderRadius: 2.5,
                  position: "relative",
                  "&.Mui-selected": {
                    bgcolor: "rgba(70, 140, 0, 0.10)",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "rgba(70, 140, 0, 0.14)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: -8,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: 999,
                      bgcolor: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive
                      ? "primary.main"
                      : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 15,
                        fontWeight: isActive
                          ? 700
                          : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        <NavLink
          to="/help"
          onClick={onNavigate}
          style={{
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {({ isActive }) => (
            <ListItemButton
              selected={isActive}
              sx={{
                minHeight: 44,
                px: 1.5,
                borderRadius: 2.5,
                mb: 0.5,
                position: "relative",
                "&.Mui-selected": {
                  bgcolor: "rgba(70, 140, 0, 0.10)",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "rgba(70, 140, 0, 0.14)",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: -8,
                    top: 8,
                    bottom: 8,
                    width: 4,
                    borderRadius: 999,
                    bgcolor: "primary.main",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive
                    ? "primary.main"
                    : "text.secondary",
                }}
              >
                <HelpOutlined />
              </ListItemIcon>

              <ListItemText
                primary="Ayuda"
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: 15,
                      fontWeight: isActive
                        ? 700
                        : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
        </NavLink>
      </List>
    </Box>
  );
}

export {
  sidebarWidth,
};

export default Sidebar;