import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import CustomerForm from "../components/customer/CustomerForm";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useSnackbar } from "../hooks/useSnackbar";
import type { CustomerCreate } from "../types/customer";
import { translateApiError } from "../utils/translateApiError";

function NewCustomerPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const createCustomerMutation =
    useCreateCustomer();

  function handleSubmit(
    customerData: CustomerCreate,
  ): void {
    createCustomerMutation.mutate(
      customerData,
      {
        onSuccess: (customer) => {
          showSnackbar({
            severity: "success",
            message:
              "Cliente creado correctamente.",
          });

          navigate(
            `/customers/${customer.id}`,
            {
              replace: true,
            },
          );
        },

        onError: (error) => {
          showSnackbar({
            severity: "error",
            message: translateApiError(
              error,
              "No fue posible crear el cliente.",
            ),
          });
        },
      },
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: "center",
          mb: 3,
        }}
      >
        <IconButton
          aria-label="Regresar"
          disabled={
            createCustomerMutation.isPending
          }
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Nuevo cliente
        </Typography>
      </Stack>

      <CustomerForm
        isSaving={
          createCustomerMutation.isPending
        }
        hasError={false}
        submitLabel="Guardar cliente"
        onCancel={() => {
          navigate(-1);
        }}
        onSubmit={(customerData) => {
          handleSubmit(
            customerData as CustomerCreate,
          );
        }}
      />
    </Box>
  );
}

export default NewCustomerPage;