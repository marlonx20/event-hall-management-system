import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types/customer";

function getPreferredContactMethodLabel(
  value: string,
): string {
  switch (value.toLowerCase()) {
    case "whatsapp":
      return "WhatsApp";

    case "phone":
      return "Teléfono";

    case "facebook":
      return "Facebook";

    default:
      return "Sin preferencia";
  }
}

function CustomersPage() {
  const navigate = useNavigate();

  const {
    data: customers = [],
    isLoading,
    isError,
    refetch,
  } = useCustomers();

  function openCustomer(customer: Customer): void {
    navigate(`/customers/${customer.id}`);
  }

  function editCustomer(
    event: React.MouseEvent<HTMLButtonElement>,
    customer: Customer,
  ): void {
    event.stopPropagation();

    navigate(`/customers/${customer.id}/edit`);
  }

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            Clientes
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Consulta y administra los clientes del salón.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate("/customers/new");
          }}
        >
          Nuevo cliente
        </Button>
      </Stack>

      {isLoading && (
        <Box
          sx={{
            minHeight: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                void refetch();
              }}
            >
              Reintentar
            </Button>
          }
        >
          No fue posible cargar los clientes.
        </Alert>
      )}

      {!isLoading &&
        !isError &&
        customers.length === 0 && (
          <Card>
            <CardContent
              sx={{
                py: 7,
                textAlign: "center",
              }}
            >
              <PersonOutlineIcon
                sx={{
                  fontSize: 52,
                  color: "text.secondary",
                  mb: 1.5,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Todavía no hay clientes
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 2.5,
                }}
              >
                Registra el primer cliente para comenzar.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  navigate("/customers/new");
                }}
              >
                Nuevo cliente
              </Button>
            </CardContent>
          </Card>
        )}

      {!isLoading &&
        !isError &&
        customers.length > 0 && (
          <Grid container spacing={2.5}>
            {customers.map((customer) => (
              <Grid
                key={customer.id}
                size={{
                  xs: 12,
                  md: 6,
                  xl: 4,
                }}
              >
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    openCustomer(customer);
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      openCustomer(customer);
                    }
                  }}
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition:
                      "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow:
                        "0 5px 16px rgba(0, 0, 0, 0.10)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          flexShrink: 0,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor:
                            "rgba(70, 140, 0, 0.10)",
                          color: "primary.main",
                        }}
                      >
                        <PersonOutlineIcon />
                      </Box>

                      <Box
                        sx={{
                          flexGrow: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 0.75,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {customer.full_name}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            mb: 0.5,
                          }}
                        >
                          Teléfono:{" "}
                          {customer.phone_number ??
                            "Sin teléfono"}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          Contacto preferido:{" "}
                          {getPreferredContactMethodLabel(
                            customer.preferred_contact_method,
                          )}
                        </Typography>
                      </Box>

                      <IconButton
                        aria-label={`Editar ${customer.full_name}`}
                        onClick={(event) => {
                          editCustomer(event, customer);
                        }}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
    </Box>
  );
}

export default CustomersPage;