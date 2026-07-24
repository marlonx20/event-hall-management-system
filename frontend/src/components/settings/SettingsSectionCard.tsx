import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";

interface SettingsSectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  feedback?: ReactNode;
  saveButtonText: string;
  savingButtonText?: string;
  isSaving: boolean;
  saveDisabled: boolean;
  onSave: () => void;
}

function SettingsSectionCard({
  title,
  description,
  children,
  feedback,
  saveButtonText,
  savingButtonText = "Guardando...",
  isSaving,
  saveDisabled,
  onSave,
}: SettingsSectionCardProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 3,
          }}
        >
          {description}
        </Typography>

        {children}

        <Stack spacing={2} sx={{ mt: 3 }}>
          {feedback}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              disabled={saveDisabled || isSaving}
              onClick={onSave}
            >
              {isSaving
                ? savingButtonText
                : saveButtonText}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SettingsSectionCard;