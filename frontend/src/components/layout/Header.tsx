import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Toolbar,
} from "@mui/material";

import Logo from "./Logo";
import SearchBar from "./SearchBar";

function Header() {

  const navigate = useNavigate();
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
  onClick={() => {
    navigate("/reservations/new");
  }}
  sx={{
    px: 2.5,
    whiteSpace: "nowrap",
  }}
>
  Nueva reservación
</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;