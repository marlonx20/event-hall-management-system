import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

function SectionCard({
  title,
  children,
  action,
}: SectionCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>

          {action}
        </Box>

        {children}
      </CardContent>
    </Card>
  );
}

export default SectionCard;