import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CollectionsBookmarkOutlinedIcon from "@mui/icons-material/CollectionsBookmarkOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import type { ReactNode } from "react";

interface HelpSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

function HelpSection({
  title,
  icon,
  children,
}: HelpSectionProps) {
  return (
    <Accordion
      disableGutters
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          py: 0.5,
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },
          pb: 2.5,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

function HelpPage() {
  return (
    <Box
      sx={{
        maxWidth: 900,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 0.75,
          }}
        >
          Ayuda
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
          }}
        >
          Guía rápida para usar Salon Loryan.
        </Typography>
      </Box>

      <Alert
        severity="info"
        sx={{ mb: 3 }}
      >
        Los cambios se guardan en la computadora
        que funciona como servidor. Los demás
        dispositivos conectados a la misma red
        utilizan esa misma información.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Uso básico
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            Usa el menú lateral para entrar a cada
            sección. En celular o tablet abre el
            menú con el botón de tres líneas de la
            esquina superior izquierda.
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        <HelpSection
          title="Reservaciones"
          icon={<EventNoteOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              Crea una reservación con el botón
              <strong> Nueva reservación</strong>.
              Selecciona un cliente existente o crea
              uno nuevo, captura la fecha, horario,
              tipo de evento, servicios y precio.
            </Typography>

            <Typography>
              Una reservación inicia como pendiente.
              Al registrar el anticipo o la
              liquidación correspondiente puede pasar
              a confirmada.
            </Typography>

            <Typography>
              Desde el detalle de la reservación
              puedes registrar pagos, cancelarla,
              agregar cargos de cierre por horas
              extra o desperfectos y finalizar el
              evento cuando el saldo quede pagado.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Calendario"
          icon={<CalendarMonthOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              El calendario muestra reservaciones,
              tareas y estados por día. Pulsa
              cualquier fecha para ver sus detalles.
            </Typography>

            <Typography>
              También puedes crear una nueva
              reservación o tarea directamente para
              la fecha seleccionada.
            </Typography>

            <Typography>
              Los colores indican si una reservación
              está pendiente, confirmada, finalizada
              o cancelada.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Clientes"
          icon={<GroupsOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              En Clientes puedes registrar nombre,
              teléfono, correo y otros datos de
              contacto.
            </Typography>

            <Typography>
              Al abrir un cliente puedes consultar
              sus reservaciones y editar su
              información.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Tareas del salón"
          icon={<TaskAltOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              Usa Tareas del salón para registrar
              pendientes, asignar responsables,
              fechas y prioridades.
            </Typography>

            <Typography>
              Una tarea puede marcarse como
              completada y volver a pendiente si es
              necesario.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Recursos"
          icon={<CollectionsBookmarkOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              En Recursos puedes guardar mensajes de
              uso frecuente y fotografías del salón.
            </Typography>

            <Typography>
              Las fotografías pueden abrirse,
              descargarse y marcarse como favoritas.
              La función Copiar puede depender del
              navegador y del dispositivo utilizado.
            </Typography>

            <Typography>
              En teléfonos y tablets, si Copiar no
              está disponible, utiliza Abrir o
              Descargar.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Configuración"
          icon={<SettingsOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              Configuración contiene los datos del
              salón, horarios, precios, información
              bancaria, redes sociales y otros datos
              utilizados por la aplicación.
            </Typography>

            <Typography>
              Revisa especialmente el precio base,
              costo del inflable y precio de hora
              extra antes de comenzar a registrar
              reservaciones reales.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Respaldos y restauración"
          icon={<BackupOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              En Configuración, la sección Respaldos
              permite crear una copia de seguridad
              de la base de datos, fotografías y
              comprobantes.
            </Typography>

            <Typography>
              Guarda los respaldos importantes en
              una memoria USB, disco externo o
              servicio de almacenamiento en la nube.
            </Typography>

            <Typography>
              Para restaurar, selecciona un respaldo
              válido y sigue el aviso de la
              aplicación. La restauración se aplica
              al reiniciar Salon Loryan.
            </Typography>

            <Divider />

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Antes de restaurar, el sistema crea
              automáticamente un respaldo de
              seguridad del estado actual.
            </Typography>
          </Stack>
        </HelpSection>

        <HelpSection
          title="Acceso desde celular o tablet"
          icon={<DevicesOutlinedIcon />}
        >
          <Stack spacing={1.5}>
            <Typography>
              La computadora servidor debe estar
              encendida, Salon Loryan debe estar
              abierto y el dispositivo debe estar
              conectado a la misma red Wi-Fi.
            </Typography>

            <Typography>
              Desde el celular o tablet abre en el
              navegador la dirección de red de la
              computadora servidor, por ejemplo:
            </Typography>

            <Box
              component="code"
              sx={{
                display: "block",
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: "grey.100",
                overflowWrap: "anywhere",
              }}
            >
              http://192.168.x.x:8000
            </Box>

            <Typography>
              Todos los dispositivos conectados de
              esta forma usan la misma base de datos
              almacenada en la computadora servidor.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              La dirección IP puede cambiar si el
              router asigna una diferente a la
              computadora.
            </Typography>
          </Stack>
        </HelpSection>
      </Stack>
    </Box>
  );
}

export default HelpPage;