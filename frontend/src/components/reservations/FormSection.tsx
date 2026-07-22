import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

function FormSection({
  title,
  children,
}: FormSectionProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2.5,
          }}
        >
          {title}
        </Typography>

        {children}
      </CardContent>
    </Card>
  );
}

export default FormSection;