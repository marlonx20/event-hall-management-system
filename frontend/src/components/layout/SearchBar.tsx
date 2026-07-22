import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

function SearchBar() {
  return (
    <TextField
      fullWidth
      placeholder="Buscar reservación, cliente o teléfono..."
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        maxWidth: 420,
        "& .MuiOutlinedInput-root": {
          backgroundColor: "background.paper",
          borderRadius: 2,
        },
      }}
    />
  );
}

export default SearchBar;