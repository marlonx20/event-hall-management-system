import { Box, Typography } from "@mui/material";

function Logo() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
            }}
        >
            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                }}
            />

            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                }}
            >
                Nombre del salón
            </Typography>
        </Box>
    );
}

export default Logo;