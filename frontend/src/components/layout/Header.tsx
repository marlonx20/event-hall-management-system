import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Logo from "./Logo";
import SearchBar from "./SearchBar";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  function handleNewReservation() {
    navigate("/reservations/new");
  }

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        zIndex: (theme) =>
          theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          gap: {
            xs: 1,
            md: 2.5,
          },
          px: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
        }}
      >
        <IconButton
          edge="start"
          aria-label="Abrir menú"
          onClick={onMenuClick}
          sx={{
            display: {
              xs: "inline-flex",
              md: "none",
            },
            flexShrink: 0,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <Logo />
        </Box>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            flex: 1,
            minWidth: 0,
            maxWidth: 460,
            ml: {
              md: 2,
            },
          }}
        >
          <SearchBar />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="primary"
          aria-label="Nueva reservación"
          onClick={handleNewReservation}
          sx={{
            display: {
              xs: "inline-flex",
              sm: "none",
            },
            flexShrink: 0,
          }}
        >
          <AddIcon />
        </IconButton>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewReservation}
          sx={{
            display: {
              xs: "none",
              sm: "inline-flex",
            },
            px: {
              sm: 1.75,
              md: 2.5,
            },
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Nueva reservación
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;