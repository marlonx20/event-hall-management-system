import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, Button } from "@mui/material";

function UserMenu() {
  return (
    <Button
      color="inherit"
      endIcon={<KeyboardArrowDownIcon />}
      sx={{
        color: "text.primary",
        px: 1,
      }}
    >
      <Avatar
        sx={{
          width: 36,
          height: 36,
          mr: 1,
          bgcolor: "secondary.main",
          fontSize: 16,
        }}
      >
        A
      </Avatar>

      Admin
    </Button>
  );
}

export default UserMenu;