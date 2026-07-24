import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import { Box, Stack, Typography } from "@mui/material";

import type { CalendarActivity } from "../../types/calendarActivity";

interface CalendarActivityCardProps {
  activity: CalendarActivity;
  onClick?: () => void;
}

function getReservationColors(
  status: "pending" | "confirmed" | "finished" | "cancelled",
) {
  switch (status) {
    case "confirmed":
      return {
        backgroundColor: "success.main",
        textColor: "common.white",
      };

    case "pending":
      return {
        backgroundColor: "warning.main",
        textColor: "common.white",
      };

    case "cancelled":
      return {
        backgroundColor: "error.main",
        textColor: "common.white",
      };

    case "finished":
      return {
        backgroundColor: "grey.300",
        textColor: "text.primary",
      };
  }
}

function getTaskColors(status: "pending" | "completed") {
  switch (status) {
    case "completed":
      return {
        backgroundColor: "grey.300",
        textColor: "text.primary",
      };

    case "pending":
      return {
        backgroundColor: "secondary.main",
        textColor: "secondary.contrastText",
      };
  }
}

function CalendarActivityCard({
  activity,
  onClick,
}: CalendarActivityCardProps) {
  const colors =
    activity.type === "reservation"
      ? getReservationColors(activity.status)
      : getTaskColors(activity.status);

  return (
    <Box
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      sx={{
        width: "100%",
        borderRadius: 1.5,
        px: 1.5,
        py: 1.25,
        bgcolor: colors.backgroundColor,
        color: colors.textColor,
        boxShadow: 1,
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": onClick
          ? {
              transform: "translateY(-1px)",
              boxShadow: 2,
            }
          : undefined,
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pt: 0.25,
            flexShrink: 0,
          }}
        >
          {activity.type === "reservation" ? (
            <EventOutlinedIcon fontSize="small" />
          ) : (
            <BuildOutlinedIcon fontSize="small" />
          )}
        </Box>

        <Box
          sx={{
            minWidth: 0,
            flexGrow: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activity.title}
          </Typography>

          {activity.subtitle && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.25,
                opacity: 0.9,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activity.subtitle}
            </Typography>
          )}

          {activity.time && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.5,
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              {activity.time}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default CalendarActivityCard;
