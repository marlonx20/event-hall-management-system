import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import CustomerForm from "../components/customer/CustomerForm";
import { useCustomer } from "../hooks/useCustomer";
import { useSnackbar } from "../hooks/useSnackbar";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import type { CustomerUpdate } from "../types/customer";
import { translateApiError } from "../utils/translateApiError";

function EditCustomerPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { customerId } = useParams();
  const id = Number(customerId);

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useCustomer(id);

  const updateCustomerMutation =
    useUpdateCustomer();

  if (isLoading) {
    return (
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
    );
  }

  if (isError || !customer) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton
            color="inherit"
            onClick={() => {
              void refetch();
            }}
          >
            ↻
          </IconButton>
        }
      >
        No fue posible cargar el cliente.
      </Alert>
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
          disabled={
            updateCustomerMutation.isPending
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
          Editar cliente
        </Typography>
      </Stack>

      <CustomerForm
        customer={customer}
        isSaving={
          updateCustomerMutation.isPending
        }
        hasError={false}
        submitLabel="Guardar cambios"
        onCancel={() => {
          navigate(-1);
        }}
        onSubmit={(customerData) => {
          updateCustomerMutation.mutate(
            {
              customerId: customer.id,
              customerData:
                customerData as CustomerUpdate,
            },
            {
              onSuccess: () => {
                showSnackbar({
                  severity: "success",
                  message:
                    "Cliente actualizado correctamente.",
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
                    "No fue posible actualizar el cliente.",
                  ),
                });
              },
            },
          );
        }}
      />
    </Box>
  );
}

export default EditCustomerPage;