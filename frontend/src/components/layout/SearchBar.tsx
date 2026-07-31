import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Fragment,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useCustomerSearch } from "../../hooks/useCustomerSearch";
import { useCustomers } from "../../hooks/useCustomers";
import { useReservationSearch } from "../../hooks/useReservationSearch";

const MINIMUM_QUERY_LENGTH = 2;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pendiente";

    case "confirmed":
      return "Confirmada";

    case "finished":
      return "Finalizada";

    case "cancelled":
      return "Cancelada";

    default:
      return status;
  }
}

function getStatusColor(
  status: string,
): "success" | "warning" | "error" | "default" {
  switch (status) {
    case "confirmed":
      return "success";

    case "pending":
      return "warning";

    case "cancelled":
      return "error";

    case "finished":
    default:
      return "default";
  }
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX");
}

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return <>{text}</>;
  }

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(trimmedQuery);
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) {
    return <>{text}</>;
  }

  const matchEnd = matchIndex + trimmedQuery.length;

  return (
    <>
      {text.slice(0, matchIndex)}
      <Box
        component="mark"
        sx={{
          px: 0.2,
          color: "inherit",
          bgcolor: "rgba(125, 15, 140, 0.18)",
          borderRadius: 0.5,
        }}
      >
        {text.slice(matchIndex, matchEnd)}
      </Box>
      {text.slice(matchEnd)}
    </>
  );
}

function SearchBar() {
  const navigate = useNavigate();

  const anchorRef = useRef<HTMLDivElement>(null);
  const resultElementRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const {
    data: reservations = [],
    isFetching: reservationsAreLoading,
    isError: reservationsHaveError,
  } = useReservationSearch(query);

  const {
    data: customerResults = [],
    isFetching: customersAreLoading,
    isError: customersHaveError,
  } = useCustomerSearch(query);

  const { data: allCustomers = [] } = useCustomers();

  const customerNamesById = useMemo(
    () =>
      new Map(
        allCustomers.map((customer) => [
          customer.id,
          customer.full_name,
        ]),
      ),
    [allCustomers],
  );

  const resultItems = useMemo(
    () => [
      ...reservations.map((reservation) => ({
        key: `reservation-${reservation.id}`,
        path: `/reservations/${reservation.id}`,
      })),
      ...customerResults.map((customer) => ({
        key: `customer-${customer.id}`,
        path: `/customers/${customer.id}`,
      })),
    ],
    [customerResults, reservations],
  );

  const isLoading =
    reservationsAreLoading || customersAreLoading;

  const hasError =
    reservationsHaveError || customersHaveError;

  const hasResults = resultItems.length > 0;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, reservations.length, customerResults.length]);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    const activeResult = resultItems[activeIndex];

    if (!activeResult) {
      return;
    }

    resultElementRefs.current[
      activeResult.key
    ]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex, resultItems]);

  function closeSearch(clearQuery = true): void {
    setOpen(false);
    setActiveIndex(-1);

    if (clearQuery) {
      setQuery("");
    }
  }

  function openResult(path: string): void {
    closeSearch();
    navigate(path);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ): void {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch(false);
      return;
    }

    if (!open || !hasResults) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex >= resultItems.length - 1
          ? 0
          : currentIndex + 1,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex <= 0
          ? resultItems.length - 1
          : currentIndex - 1,
      );

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const activeResult = resultItems[activeIndex];

      if (activeResult) {
        openResult(activeResult.path);
      }
    }
  }

  return (
    <Box
      ref={anchorRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 460,
      }}
    >
      <TextField
        fullWidth
        placeholder="Buscar reservación, cliente, teléfono o fecha..."
        value={query}
        onChange={(event) => {
          const value = event.target.value;

          setQuery(value);
          setOpen(
            value.trim().length >= MINIMUM_QUERY_LENGTH,
          );
        }}
        onFocus={() => {
          if (
            query.trim().length >= MINIMUM_QUERY_LENGTH
          ) {
            setOpen(true);
          }
        }}
        onBlur={() => {
          setOpen(false);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
          htmlInput: {
            "aria-label": "Buscar en la aplicación",
            "aria-expanded": open,
            "aria-controls": open
              ? "global-search-results"
              : undefined,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
            borderRadius: 2,
          },
        }}
      />

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        sx={{
          width: anchorRef.current?.offsetWidth,
          zIndex: 2000,
        }}
      >
        <Paper
          id="global-search-results"
          elevation={6}
          sx={{
            mt: 1,
            maxHeight: 440,
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                py: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : hasError ? (
            <Typography
              sx={{
                p: 2,
                color: "error.main",
              }}
            >
              No fue posible realizar la búsqueda.
            </Typography>
          ) : !hasResults ? (
            <Typography
              sx={{
                p: 2,
                color: "text.secondary",
              }}
            >
              No se encontraron resultados.
            </Typography>
          ) : (
            <List disablePadding>
              {reservations.length > 0 && (
                <>
                  <Typography
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.7,
                      color: "secondary.main",
                      bgcolor:
                        "rgba(125, 15, 140, 0.05)",
                    }}
                  >
                    RESERVACIONES
                  </Typography>

                  {reservations.map(
                    (reservation, reservationIndex) => {
                      const resultKey =
                        `reservation-${reservation.id}`;
                      const resultIndex = reservationIndex;
                      const customerName =
                        customerNamesById.get(
                          reservation.customer_id,
                        ) ?? "Cliente no encontrado";

                      return (
                        <ListItemButton
                          key={resultKey}
                          ref={(element) => {
                            resultElementRefs.current[
                              resultKey
                            ] = element;
                          }}
                          selected={
                            activeIndex === resultIndex
                          }
                          onMouseEnter={() => {
                            setActiveIndex(resultIndex);
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            openResult(
                              `/reservations/${reservation.id}`,
                            );
                          }}
                          sx={{
                            px: 2,
                            py: 1.25,
                            alignItems: "flex-start",
                            transition:
                              "background-color 0.15s ease",

                            "&:hover, &.Mui-selected, &.Mui-selected:hover":
                              {
                                bgcolor:
                                  "rgba(125, 15, 140, 0.12)",
                              },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 38,
                              mt: 0.2,
                              color: "secondary.main",
                            }}
                          >
                            <CalendarMonthOutlinedIcon />
                          </ListItemIcon>

                          <Box
                            sx={{
                              flexGrow: 1,
                              minWidth: 0,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <HighlightedText
                                text={customerName}
                                query={query}
                              />
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={1}
                              useFlexGap
                              sx={{
                                mt: 0.4,
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "text.secondary",
                                }}
                              >
                                <HighlightedText
                                  text={formatDate(
                                    reservation.event_date,
                                  )}
                                  query={query}
                                />
                                {" · "}
                                <HighlightedText
                                  text={
                                    reservation.event_type ??
                                    "Evento"
                                  }
                                  query={query}
                                />
                              </Typography>

                              <Chip
                                size="small"
                                label={getStatusLabel(
                                  reservation.status,
                                )}
                                color={getStatusColor(
                                  reservation.status,
                                )}
                                sx={{
                                  height: 22,
                                  fontSize: 11,
                                }}
                              />
                            </Stack>
                          </Box>
                        </ListItemButton>
                      );
                    },
                  )}
                </>
              )}

              {reservations.length > 0 &&
                customerResults.length > 0 && (
                  <Divider />
                )}

              {customerResults.length > 0 && (
                <>
                  <Typography
                    sx={{
                      px: 2,
                      py: 1,
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.7,
                      color: "secondary.main",
                      bgcolor:
                        "rgba(125, 15, 140, 0.05)",
                    }}
                  >
                    CLIENTES
                  </Typography>

                  {customerResults.map(
                    (customer, customerIndex) => {
                      const resultKey =
                        `customer-${customer.id}`;
                      const resultIndex =
                        reservations.length +
                        customerIndex;
                      const phoneNumber =
                        customer.phone_number ??
                        "Sin teléfono";

                      return (
                        <Fragment key={resultKey}>
                          <ListItemButton
                            ref={(element) => {
                              resultElementRefs.current[
                                resultKey
                              ] = element;
                            }}
                            selected={
                              activeIndex === resultIndex
                            }
                            onMouseEnter={() => {
                              setActiveIndex(resultIndex);
                            }}
                            onMouseDown={(event) => {
                              event.preventDefault();
                              openResult(
                                `/customers/${customer.id}`,
                              );
                            }}
                            sx={{
                              px: 2,
                              py: 1.25,
                              transition:
                                "background-color 0.15s ease",

                              "&:hover, &.Mui-selected, &.Mui-selected:hover":
                                {
                                  bgcolor:
                                    "rgba(125, 15, 140, 0.12)",
                                },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 38,
                                color: "secondary.main",
                              }}
                            >
                              <PersonOutlinedIcon />
                            </ListItemIcon>

                            <Box
                              sx={{
                                minWidth: 0,
                                flexGrow: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <HighlightedText
                                  text={customer.full_name}
                                  query={query}
                                />
                              </Typography>

                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 0.25,
                                  color: "text.secondary",
                                }}
                              >
                                <HighlightedText
                                  text={phoneNumber}
                                  query={query}
                                />
                              </Typography>
                            </Box>
                          </ListItemButton>
                        </Fragment>
                      );
                    },
                  )}
                </>
              )}
            </List>
          )}
        </Paper>
      </Popper>
    </Box>
  );
}

export default SearchBar;