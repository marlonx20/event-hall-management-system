import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import type {
  Task,
  TaskCreate,
  TaskPriority,
} from "../../types/task";

interface TaskDialogProps {
  open: boolean;
  task: Task | null;
  initialDate: string | null;
  isSaving: boolean;
  hasError: boolean;
  onClose: () => void;
  onSave: (taskData: TaskCreate) => void;
}

function normalizeOptionalText(
  value: string,
): string | null {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0
    ? normalizedValue
    : null;
}

function TaskDialog({
  open,
  task,
  initialDate,
  isSaving,
  hasError,
  onClose,
  onSave,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [dueDate, setDueDate] =
    useState<Dayjs | null>(null);
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [assignedTo, setAssignedTo] =
    useState("");
  const [notes, setNotes] = useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");

    setDueDate(
      task?.due_date
        ? dayjs(task.due_date)
        : initialDate
          ? dayjs(initialDate)
          : null,
    );

    setPriority(task?.priority ?? "medium");
    setAssignedTo(task?.assigned_to ?? "");
    setNotes(task?.notes ?? "");
    setValidationMessage(null);
  }, [open, task, initialDate]);

  function clearValidation() {
    setValidationMessage(null);
  }

  function handleSave() {
    if (title.trim().length === 0) {
      setValidationMessage(
        "Escribe el título de la tarea.",
      );
      return;
    }

    onSave({
      title: title.trim(),
      description:
        normalizeOptionalText(description),
      due_date: dueDate
        ? dueDate.format("YYYY-MM-DD")
        : null,
      priority,
      assigned_to:
        normalizeOptionalText(assignedTo),
      notes: normalizeOptionalText(notes),
    });
  }

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {task ? "Editar tarea" : "Nueva tarea"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {validationMessage && (
            <Alert severity="warning">
              {validationMessage}
            </Alert>
          )}

          {hasError && (
            <Alert severity="error">
              No fue posible guardar la tarea.
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Título"
            value={title}
            disabled={isSaving}
            onChange={(event) => {
              setTitle(event.target.value);
              clearValidation();
            }}
            placeholder="Ejemplo: Lavar manteles"
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Descripción"
            value={description}
            disabled={isSaving}
            onChange={(event) => {
              setDescription(
                event.target.value,
              );
              clearValidation();
            }}
            placeholder="Opcional"
          />

          <DatePicker
            label="Fecha"
            value={dueDate}
            disabled={isSaving}
            onChange={(value) => {
              setDueDate(value);
              clearValidation();
            }}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />

          <FormControl
            fullWidth
            disabled={isSaving}
          >
            <InputLabel>Prioridad</InputLabel>

            <Select
              label="Prioridad"
              value={priority}
              onChange={(event) => {
                setPriority(
                  event.target
                    .value as TaskPriority,
                );
                clearValidation();
              }}
            >
              <MenuItem value="low">
                Baja
              </MenuItem>

              <MenuItem value="medium">
                Media
              </MenuItem>

              <MenuItem value="high">
                Alta
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Responsable"
            value={assignedTo}
            disabled={isSaving}
            onChange={(event) => {
              setAssignedTo(
                event.target.value,
              );
              clearValidation();
            }}
            placeholder="Ejemplo: Papá, Marlon..."
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Notas"
            value={notes}
            disabled={isSaving}
            onChange={(event) => {
              setNotes(event.target.value);
              clearValidation();
            }}
            placeholder="Opcional"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          disabled={isSaving}
          onClick={onClose}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving
            ? "Guardando..."
            : task
              ? "Guardar cambios"
              : "Crear tarea"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDialog;