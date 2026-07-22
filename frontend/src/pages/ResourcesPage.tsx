import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

import PhotoGallery from "../components/resources/PhotoGallery";
import QuickMessageDialog from "../components/resources/QuickMessageDialog";
import {
  useCreateQuickMessage,
  useDeleteQuickMessage,
  useQuickMessages,
  useUpdateQuickMessage,
} from "../hooks/useQuickMessages";
import type { QuickMessage } from "../types/quickMessage";

function ResourcesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingMessage, setEditingMessage] =
    useState<QuickMessage | null>(null);

  const [messageToDelete, setMessageToDelete] =
    useState<QuickMessage | null>(null);

  const [copyNoticeOpen, setCopyNoticeOpen] =
    useState(false);

  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuickMessages();

  const createMutation = useCreateQuickMessage();
  const updateMutation = useUpdateQuickMessage();
  const deleteMutation = useDeleteQuickMessage();

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  const hasSaveError =
    createMutation.isError ||
    updateMutation.isError;

  function openCreateDialog() {
    createMutation.reset();
    updateMutation.reset();

    setEditingMessage(null);
    setDialogOpen(true);
  }

  function openEditDialog(message: QuickMessage) {
    createMutation.reset();
    updateMutation.reset();

    setEditingMessage(message);
    setDialogOpen(true);
  }

  function closeMessageDialog() {
    if (isSaving) {
      return;
    }

    setDialogOpen(false);
    setEditingMessage(null);
  }

  function saveMessage(
    title: string,
    content: string,
    displayOrder: number,
  ) {
    if (editingMessage) {
      updateMutation.mutate(
        {
          messageId: editingMessage.id,
          messageData: {
            title,
            content,
            display_order: displayOrder,
          },
        },
        {
          onSuccess: closeMessageDialog,
        },
      );

      return;
    }

    createMutation.mutate(
      {
        title,
        content,
        display_order: displayOrder,
      },
      {
        onSuccess: closeMessageDialog,
      },
    );
  }

  async function copyMessage(content: string) {
    try {
      await navigator.clipboard.writeText(content);

      setCopyNoticeOpen(true);
    } catch {
      window.alert(
        "No fue posible copiar el mensaje al portapapeles.",
      );
    }
  }

  function confirmDelete() {
    if (!messageToDelete) {
      return;
    }

    deleteMutation.mutate(messageToDelete.id, {
      onSuccess: () => {
        setMessageToDelete(null);
      },
    });
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 0.75,
            }}
          >
            Recursos
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Copia rápidamente mensajes y fotografías del
            salón.
          </Typography>
        </Box>

        {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Nuevo mensaje
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue: number) => {
            setActiveTab(newValue);
          }}
          sx={{
            px: 2,
          }}
        >
          <Tab
            icon={<MessageOutlinedIcon />}
            iconPosition="start"
            label="Mensajes"
          />

          <Tab
            icon={<ImageOutlinedIcon />}
            iconPosition="start"
            label="Fotos"
          />
        </Tabs>
      </Card>

      {activeTab === 0 && (
        <>
          {isLoading && (
            <Box
              sx={{
                minHeight: 300,
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
              No fue posible cargar los mensajes rápidos.
            </Alert>
          )}

          {!isLoading &&
            !isError &&
            messages.length === 0 && (
              <Card>
                <CardContent
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <MessageOutlinedIcon
                    sx={{
                      fontSize: 48,
                      color: "text.secondary",
                      mb: 1.5,
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    Todavía no hay mensajes
                  </Typography>

                  <Typography
                    sx={{
                      color: "text.secondary",
                      mb: 2.5,
                    }}
                  >
                    Crea el primer mensaje para poder copiarlo
                    rápidamente.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={openCreateDialog}
                  >
                    Nuevo mensaje
                  </Button>
                </CardContent>
              </Card>
            )}

          {!isLoading &&
            !isError &&
            messages.length > 0 && (
              <Grid container spacing={3}>
                {messages.map((message) => (
                  <Grid
                    key={message.id}
                    size={{
                      xs: 12,
                      md: 6,
                      xl: 4,
                    }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            mb: 1.5,
                          }}
                        >
                          {message.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: "text.secondary",
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {message.content}
                        </Typography>
                      </CardContent>

                      <CardActions
                        sx={{
                          px: 2,
                          pb: 2,
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          startIcon={<ContentCopyIcon />}
                          onClick={() => {
                            void copyMessage(
                              message.content,
                            );
                          }}
                        >
                          Copiar
                        </Button>

                        <Stack
                          direction="row"
                          spacing={0.5}
                        >
                          <IconButton
                            aria-label={`Editar ${message.title}`}
                            onClick={() => {
                              openEditDialog(message);
                            }}
                          >
                            <EditOutlinedIcon />
                          </IconButton>

                          <IconButton
                            aria-label={`Eliminar ${message.title}`}
                            color="error"
                            onClick={() => {
                              setMessageToDelete(message);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
        </>
      )}

      {activeTab === 1 && <PhotoGallery />}

      <QuickMessageDialog
        open={dialogOpen}
        message={editingMessage}
        isSaving={isSaving}
        hasError={hasSaveError}
        onClose={closeMessageDialog}
        onSave={saveMessage}
      />

      <Dialog
        open={messageToDelete !== null}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setMessageToDelete(null);
          }
        }}
      >
        <DialogTitle>
          Eliminar mensaje
        </DialogTitle>

        <DialogContent>
          <Typography>
            ¿Seguro que deseas eliminar el mensaje{" "}
            <strong>
              {messageToDelete?.title}
            </strong>
            ?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            disabled={deleteMutation.isPending}
            onClick={() => {
              setMessageToDelete(null);
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            onClick={confirmDelete}
          >
            {deleteMutation.isPending
              ? "Eliminando..."
              : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copyNoticeOpen}
        autoHideDuration={2500}
        message="Mensaje copiado"
        onClose={() => {
          setCopyNoticeOpen(false);
        }}
      />
    </Box>
  );
}

export default ResourcesPage;