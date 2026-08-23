import {
  Add as AddIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TaskDialog from "../components/tasks/TaskDialog";
import { useCreateTask } from "../hooks/useCreateTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useTasks } from "../hooks/useTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task, TaskCreate, TaskPriority } from "../types/task";

dayjs.locale("es");

function getPriorityLabel(priority: TaskPriority): string {
  switch (priority) {
    case "high":
      return "Alta";

    case "low":
      return "Baja";

    default:
      return "Media";
  }
}

function getPriorityColor(
  priority: TaskPriority,
): "error" | "warning" | "default" {
  switch (priority) {
    case "high":
      return "error";

    case "medium":
      return "warning";

    default:
      return "default";
  }
}

function getPriorityOrder(priority: TaskPriority): number {
  switch (priority) {
    case "high":
      return 1;

    case "medium":
      return 2;

    case "low":
      return 3;
  }
}

function formatTaskDate(dueDate: string | null): string {
  if (!dueDate) {
    return "Sin fecha";
  }

  const taskDate = dayjs(dueDate);
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");

  if (taskDate.isSame(today, "day")) {
    return "Hoy";
  }

  if (taskDate.isSame(tomorrow, "day")) {
    return "Mañana";
  }

  return taskDate.format("dddd D [de] MMMM [de] YYYY");
}

function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateFromCalendar = searchParams.get("date");

  const taskIdFromCalendar = Number(searchParams.get("taskId"));

  const initialDate =
    dateFromCalendar && dayjs(dateFromCalendar).isValid()
      ? dateFromCalendar
      : null;

  const { data: tasks = [], isLoading, isError, refetch } = useTasks();

  const createTaskMutation = useCreateTask();

  const updateTaskMutation = useUpdateTask();

  const deleteTaskMutation = useDeleteTask();

  const [taskDialogOpen, setTaskDialogOpen] = useState(Boolean(initialDate));

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [successMessage, setSuccessMessage] = useState("");

  const [sortBy, setSortBy] = useState<"date" | "priority">("priority");

  const sortedPendingTasks = useMemo(() => {
    const pendingTasks = tasks.filter((task) => task.status === "pending");

    return pendingTasks.sort((firstTask, secondTask) => {
      if (sortBy === "priority") {
        const priorityComparison =
          getPriorityOrder(firstTask.priority) -
          getPriorityOrder(secondTask.priority);

        if (priorityComparison !== 0) {
          return priorityComparison;
        }

        if (firstTask.due_date && secondTask.due_date) {
          return firstTask.due_date.localeCompare(secondTask.due_date);
        }

        if (firstTask.due_date) {
          return -1;
        }

        if (secondTask.due_date) {
          return 1;
        }

        return firstTask.id - secondTask.id;
      }

      if (firstTask.due_date && secondTask.due_date) {
        const dateComparison = firstTask.due_date.localeCompare(
          secondTask.due_date,
        );

        if (dateComparison !== 0) {
          return dateComparison;
        }
      }

      if (firstTask.due_date) {
        return -1;
      }

      if (secondTask.due_date) {
        return 1;
      }

      return (
        getPriorityOrder(firstTask.priority) -
        getPriorityOrder(secondTask.priority)
      );
    });
  }, [tasks, sortBy]);

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === "completed")
        .sort((firstTask, secondTask) => {
          if (firstTask.due_date && secondTask.due_date) {
            return secondTask.due_date.localeCompare(firstTask.due_date);
          }

          return secondTask.id - firstTask.id;
        }),
    [tasks],
  );

  useEffect(() => {
    if (!taskIdFromCalendar || tasks.length === 0) {
      return;
    }

    const task = tasks.find(
      (currentTask) => currentTask.id === taskIdFromCalendar,
    );

    if (!task) {
      return;
    }

    setSelectedTask(task);
    setTaskDialogOpen(true);

    setSearchParams({});
  }, [taskIdFromCalendar, tasks, setSearchParams]);

  const taskMutationIsPending =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  const taskMutationHasError =
    createTaskMutation.isError || updateTaskMutation.isError;

  function openNewTaskDialog() {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setSelectedTask(null);
    setTaskDialogOpen(true);
  }

  function openEditTaskDialog(task: Task) {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setSelectedTask(task);
    setTaskDialogOpen(true);
  }

  function closeTaskDialog() {
    if (taskMutationIsPending) {
      return;
    }

    setTaskDialogOpen(false);
    setSelectedTask(null);

    if (dateFromCalendar) {
      setSearchParams({});
    }
  }

  function handleSaveTask(taskData: TaskCreate) {
    if (selectedTask) {
      updateTaskMutation.mutate(
        {
          taskId: selectedTask.id,
          taskData,
        },
        {
          onSuccess: () => {
            setSuccessMessage("Tarea actualizada correctamente.");
            closeTaskDialog();
          },
        },
      );

      return;
    }

    createTaskMutation.mutate(taskData, {
      onSuccess: () => {
        setSuccessMessage("Tarea creada correctamente.");
        closeTaskDialog();
      },
    });
  }

  function toggleTaskStatus(task: Task) {
    updateTaskMutation.mutate(
      {
        taskId: task.id,
        taskData: {
          status: task.status === "pending" ? "completed" : "pending",
        },
      },
      {
        onSuccess: () => {
          setSuccessMessage(
            task.status === "pending"
              ? "Tarea marcada como completada."
              : "Tarea marcada como pendiente.",
          );
        },
      },
    );
  }

  function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(
      `¿Deseas eliminar la tarea "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteTaskMutation.mutate(task.id, {
      onSuccess: () => {
        setSuccessMessage("Tarea eliminada correctamente.");
      },
    });
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
            Tareas del salón
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
            }}
          >
            Organiza pendientes, responsables y fechas importantes del salón.
          </Typography>
        </Box>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
          }}
        >
          <FormControl
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 180,
              },
            }}
          >
            <InputLabel>Ordenar por</InputLabel>

            <Select
              label="Ordenar por"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as "date" | "priority");
              }}
            >
              <MenuItem value="priority">Prioridad</MenuItem>

              <MenuItem value="date">Fecha</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openNewTaskDialog}
            sx={{
              width: {
                xs: "100%",
                sm: "auto",
              },
            }}
          >
            Nueva tarea
          </Button>
        </Stack>
      </Stack>

      {isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
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
          No fue posible cargar las tareas.
        </Alert>
      )}

      {!isError &&
        sortedPendingTasks.length === 0 &&
        completedTasks.length === 0 && (
          <Card>
            <CardContent
              sx={{
                py: 7,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Todavía no hay tareas
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 2.5,
                }}
              >
                Crea la primera tarea para organizar el trabajo del salón.
              </Typography>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openNewTaskDialog}
              >
                Nueva tarea
              </Button>
            </CardContent>
          </Card>
        )}

      {!isError && sortedPendingTasks.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Pendientes ({sortedPendingTasks.length})
          </Typography>

          <Stack spacing={2}>
            {sortedPendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isUpdating={updateTaskMutation.isPending}
                isDeleting={deleteTaskMutation.isPending}
                onToggleStatus={() => {
                  toggleTaskStatus(task);
                }}
                onEdit={() => {
                  openEditTaskDialog(task);
                }}
                onDelete={() => {
                  handleDeleteTask(task);
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {!isError && completedTasks.length > 0 && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Completadas ({completedTasks.length})
          </Typography>

          <Stack spacing={2}>
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isUpdating={updateTaskMutation.isPending}
                isDeleting={deleteTaskMutation.isPending}
                onToggleStatus={() => {
                  toggleTaskStatus(task);
                }}
                onEdit={() => {
                  openEditTaskDialog(task);
                }}
                onDelete={() => {
                  handleDeleteTask(task);
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <TaskDialog
        open={taskDialogOpen}
        task={selectedTask}
        initialDate={selectedTask ? null : initialDate}
        isSaving={taskMutationIsPending}
        hasError={taskMutationHasError}
        onClose={closeTaskDialog}
        onSave={handleSaveTask}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={3000}
        message={successMessage}
        onClose={() => {
          setSuccessMessage("");
        }}
      />
    </Box>
  );
}

interface TaskCardProps {
  task: Task;
  isUpdating: boolean;
  isDeleting: boolean;
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskCard({
  task,
  isUpdating,
  isDeleting,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";

  return (
    <Card
      sx={{
        opacity: isCompleted ? 0.72 : 1,
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
          <IconButton
            aria-label={
              isCompleted ? "Marcar como pendiente" : "Marcar como completada"
            }
            disabled={isUpdating}
            onClick={onToggleStatus}
            sx={{
              color: isCompleted ? "success.main" : "text.secondary",
            }}
          >
            {isCompleted ? <TaskAltIcon /> : <RadioButtonUncheckedIcon />}
          </IconButton>

          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
              sx={{
                justifyContent: "space-between",
                alignItems: {
                  xs: "flex-start",
                  sm: "center",
                },
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textDecoration: isCompleted ? "line-through" : "none",
                }}
              >
                {task.title}
              </Typography>

              <Chip
                size="small"
                label={`Prioridad ${getPriorityLabel(task.priority)}`}
                color={getPriorityColor(task.priority)}
                sx={{
                  fontWeight: 700,
                }}
              />
            </Stack>

            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  whiteSpace: "pre-wrap",
                  mb: 1.5,
                }}
              >
                {task.description}
              </Typography>
            )}

            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {formatTaskDate(task.due_date)}
              </Typography>

              {task.assigned_to && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Responsable: {task.assigned_to}
                </Typography>
              )}
            </Stack>

            {task.notes && (
              <>
                <Divider sx={{ my: 1.5 }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {task.notes}
                </Typography>
              </>
            )}
          </Box>

          <Stack direction="row">
            <IconButton
              aria-label="Editar tarea"
              disabled={isUpdating || isDeleting}
              onClick={onEdit}
            >
              <EditOutlinedIcon />
            </IconButton>

            <IconButton
              aria-label="Eliminar tarea"
              color="error"
              disabled={isUpdating || isDeleting}
              onClick={onDelete}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TasksPage;