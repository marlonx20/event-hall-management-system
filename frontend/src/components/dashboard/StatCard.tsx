import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
}

function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card
      sx={{
        width: 230,
        height: 110,
        flexShrink: 0,
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "text.primary",
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatCard;