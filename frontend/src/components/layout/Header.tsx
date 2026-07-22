import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          gap: 3,
          px: 3,
        }}
      >
        <Box
          sx={{
            minWidth: 240,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Logo />
        </Box>

        <SearchBar />

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            px: 2.5,
            whiteSpace: "nowrap",
          }}
        >
          Nueva reservación
        </Button>

        <IconButton
          aria-label="Notificaciones"
          sx={{
            color: "text.secondary",
          }}
        >
          <NotificationsNoneIcon />
        </IconButton>

        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Header;