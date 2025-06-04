import React, { useEffect, useState, useCallback } from "react";
import { HomeIcon, CalendarDaysIcon, ListBulletIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Paper, Typography, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download as DownloadIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './anim-dashboard.css';
dayjs.extend(isoWeek);

const COLORS = ["#FFD700", "#FF69B4", "#A78BFA", "#34D399", "#F87171"];

const navItems = [
  { label: "Accueil", icon: HomeIcon, to: "/" },
  { label: "Calendrier", icon: CalendarDaysIcon, to: "/dashboard#calendar" },
  { label: "Liste RDV", icon: ListBulletIcon, to: "/dashboard#list" },
  { label: "Statistiques", icon: ChartBarIcon, to: "/dashboard#stats" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null); // Ajoute dans le state

  // Statistiques
  const [todayCount, setTodayCount] = useState(0);
  const [weekCount, setWeekCount] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [topService, setTopService] = useState("");
  const [serviceStats, setServiceStats] = useState([]);

  // FullCalendar
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterService, setFilterService] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Charger les réservations
  const fetchReservations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/admin", { replace: true });
      const res = await api.getReservations(token);
      setReservations(res.data);
    } catch (err) {
      console.error("Erreur fetch réservations :", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Calcul des stats
  useEffect(() => {
    if (!reservations.length) return;
    const today = dayjs().format("YYYY-MM-DD");
    const startOfWeek = dayjs().startOf("isoWeek");
    const endOfWeek = dayjs().endOf("isoWeek");
    const todayRes = reservations.filter(r => r.date === today);
    setTodayCount(todayRes.length);
    const weekRes = reservations.filter(r =>
      dayjs(r.date).isAfter(startOfWeek.subtract(1, "day")) &&
      dayjs(r.date).isBefore(endOfWeek.add(1, "day"))
    );
    setWeekCount(weekRes.length);
    const slotsPerDay = 20;
    const weekDays = 7;
    const totalSlots = slotsPerDay * weekDays;
    setOccupancy(Math.round((weekRes.length / totalSlots) * 100));
    const serviceMap = {};
    reservations.forEach(r => {
      if (!serviceMap[r.service]) serviceMap[r.service] = 0;
      serviceMap[r.service]++;
    });
    const sortedServices = Object.entries(serviceMap).sort((a, b) => b[1] - a[1]);
    setTopService(sortedServices[0]?.[0] || "");
    setServiceStats(
      sortedServices.map(([service, count], i) => ({
        name: service,
        value: count,
        fill: COLORS[i % COLORS.length],
      }))
    );
  }, [reservations]);

  // Préparer les events pour FullCalendar
  useEffect(() => {
    let filtered = reservations;
    if (filterService) filtered = filtered.filter(r => r.service === filterService);
    if (filterEmployee) filtered = filtered.filter(r => r.employee === filterEmployee);
    setCalendarEvents(
      filtered.map(r => ({
        id: r._id,
        title: `${r.service} - ${r.name}`,
        start: `${r.date}T${r.time}`,
        end: `${r.date}T${r.time}`,
        extendedProps: r,
        backgroundColor: r.status === "confirmed" ? "#34D399" : "#FFD700"
      }))
    );
  }, [reservations, filterService, filterEmployee]);

  // Actions
  const handleDelete = async (id) => {
    setShowDeleteModal(true);
    setDeleteId(id);
  };
  const confirmDelete = async () => {
    try {
      await api.deleteReservation(deleteId, localStorage.getItem("token"));
      setReservations((prev) => prev.filter((r) => r._id !== deleteId));
      toast.success("Rendez-vous supprimé !");
    } catch (err) {
      toast.error("Erreur suppression : " + err.message);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleValidate = async (id) => {
    try {
      await api.updateReservation(id, { status: "confirmed" }, localStorage.getItem("token"));
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "confirmed" } : r))
      );
      toast.success("Rendez-vous validé !");
    } catch (err) {
      toast.error("Erreur validation : " + err.message);
    }
  };

  const handleEdit = (id) => {
    const res = reservations.find((r) => r._id === id);
    setSelectedEvent(res);
  };

  // FullCalendar: drag & drop
  const handleEventDrop = async (info) => {
    const id = info.event.id;
    const newDate = dayjs(info.event.start).format("YYYY-MM-DD");
    const newTime = dayjs(info.event.start).format("HH:mm");
    try {
      await api.updateReservation(id, { date: newDate, time: newTime }, localStorage.getItem("token"));
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, date: newDate, time: newTime } : r))
      );
      toast.success("Rendez-vous déplacé !");
    } catch (err) {
      toast.error("Erreur lors du déplacement : " + err.message);
      info.revert();
    }
  };

  // FullCalendar: click pour éditer
  const handleEventClick = (info) => {
    const r = info.event.extendedProps;
    setSelectedEvent(r);
  };

  // Edition rapide d'un RDV (nom, service, statut)
  const handleQuickEdit = async () => {
    if (!selectedEvent) return;
    try {
      await api.updateReservation(selectedEvent._id, {
        name: selectedEvent.name,
        service: selectedEvent.service,
        status: selectedEvent.status
      }, localStorage.getItem("token"));
      setReservations((prev) =>
        prev.map((r) => (r._id === selectedEvent._id ? { ...r, ...selectedEvent } : r))
      );
      setSelectedEvent(null);
      toast.success("Rendez-vous modifié !");
    } catch (err) {
      toast.error("Erreur édition : " + err.message);
    }
  };

  // Fonction d'export CSV
  const exportCSV = () => {
    if (!reservations.length) return;
    const headers = [
      "Service",
      "Date",
      "Heure",
      "Nom",
      "Téléphone",
      "Email",
      "Statut",
      "Employée"
    ];
    const rows = reservations.map(r =>
      [
        r.service,
        r.date,
        r.time,
        r.name,
        r.phone,
        r.email,
        r.status,
        r.employee || ""
      ]
    );
    const csvContent =
      [headers, ...rows]
        .map(row => row.map(field => `"${(field ?? "").toString().replace(/"/g, '""')}"`).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "rendez-vous.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Colonnes DataGrid (desktop)
  const columns = [
    { field: "service", headerName: "Service", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "time", headerName: "Heure", flex: 1 },
    { field: "name", headerName: "Nom", flex: 1 },
    { field: "phone", headerName: "Téléphone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Statut", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} className="w-full">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row._id)}
            className="min-w-[44px] h-12 rounded-xl text-base"
            style={{ fontSize: 16 }}
          >
            Éditer
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row._id)}
            className="min-w-[44px] h-12 rounded-xl text-base"
            style={{ fontSize: 16 }}
          >
            Supprimer
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            disabled={params.row.status === "confirmed"}
            onClick={() => handleValidate(params.row._id)}
            className="min-w-[44px] h-12 rounded-xl text-base"
            style={{ fontSize: 16 }}
          >
            Valider
          </Button>
        </Stack>
      ),
      flex: 2,
    },
  ];

  // Liste des services/employées pour les filtres
  const serviceList = Array.from(new Set(reservations.map(r => r.service))).filter(Boolean);
  const employeeList = Array.from(new Set(reservations.map(r => r.employee))).filter(Boolean);

  return (
    <div className="p-4 max-w-full min-h-screen bg-noir text-gold font-sans pb-24">
      <ToastContainer
  position="top-center"
  autoClose={2200}
  toastClassName="!rounded-xl !text-base !px-4 !py-3 !bg-noir !text-gold"
  bodyClassName="!text-base"
  style={{ minWidth: 220 }}
/>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">Dashboard Réservations</h1>
      {/* Actions & Export */}
      <Box className="flex flex-col md:flex-row gap-4 mb-4 items-stretch md:items-center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={exportCSV}
          className="w-full md:w-auto min-w-[44px] h-12 text-base md:text-lg rounded-xl"
          style={{ fontSize: 16 }}
        >
          Exporter la liste
        </Button>
      </Box>

      {/* Mini-dashboard responsive */}
      <Box className="flex flex-col md:flex-row gap-4 mb-4">
        <Paper elevation={2} className="flex-1 p-4 rounded-xl flex flex-col items-center min-w-0">
          <Typography variant="subtitle2" className="text-gold text-base md:text-lg">Rdv du jour</Typography>
          <Typography variant="h5" className="text-2xl md:text-3xl">{todayCount}</Typography>
        </Paper>
        <Paper elevation={2} className="flex-1 p-4 rounded-xl flex flex-col items-center min-w-0">
          <Typography variant="subtitle2" className="text-gold text-base md:text-lg">Rdv de la semaine</Typography>
          <Typography variant="h5" className="text-2xl md:text-3xl">{weekCount}</Typography>
        </Paper>
        <Paper elevation={2} className="flex-1 p-4 rounded-xl flex flex-col items-center min-w-0">
          <Typography variant="subtitle2" className="text-gold text-base md:text-lg">Taux d’occupation</Typography>
          <Typography variant="h5" className="text-2xl md:text-3xl">{occupancy}%</Typography>
        </Paper>
        <Paper elevation={2} className="flex-1 p-4 rounded-xl flex flex-col items-center min-w-0">
          <Typography variant="subtitle2" className="text-gold text-base md:text-lg">Top service</Typography>
          <Typography variant="h5" className="text-2xl md:text-3xl">{topService || "-"}</Typography>
        </Paper>
        <Paper elevation={2} className="flex-1 p-4 rounded-xl min-w-0">
          <Typography variant="subtitle2" className="text-gold text-base md:text-lg mb-1">Répartition services</Typography>
          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie
                data={serviceStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={32}
                label
              >
                {serviceStats.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Filtres calendrier */}
      <Box className="flex flex-col md:flex-row gap-4 mb-4">
        <FormControl size="small" className="flex-1 min-w-0">
          <InputLabel className="text-gold">Service</InputLabel>
          <Select
            label="Service"
            value={filterService}
            onChange={e => setFilterService(e.target.value)}
            className="bg-noir text-gold"
            style={{ fontSize: 16 }}
          >
            <MenuItem value="">Tous</MenuItem>
            {serviceList.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" className="flex-1 min-w-0">
          <InputLabel className="text-gold">Employée</InputLabel>
          <Select
            label="Employée"
            value={filterEmployee}
            onChange={e => setFilterEmployee(e.target.value)}
            className="bg-noir text-gold"
            style={{ fontSize: 16 }}
          >
            <MenuItem value="">Toutes</MenuItem>
            {employeeList.map(e => (
              <MenuItem key={e} value={e}>{e}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* FullCalendar */}
      <Paper elevation={2} className="p-2 mb-4 rounded-xl overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          editable
          selectable
          events={calendarEvents}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          height={window.innerWidth < 600 ? 500 : 600}
          contentHeight="auto"
        />
      </Paper>

      {/* Modale édition RDV (plein écran mobile, transition) */}
      <CSSTransition
        in={!!selectedEvent}
        timeout={350}
        classNames="fade-modal"
        unmountOnExit
      >
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-60
          `}
        >
          <div
            className={`
              bg-noir rounded-xl shadow-lg p-6
              w-full max-w-md mx-auto
              ${window.innerWidth < 640 ? "rounded-none h-full flex flex-col justify-center" : ""}
            `}
          >
            <Typography variant="h6" className="mb-4 text-lg md:text-xl text-center">
              Éditer le rendez-vous
            </Typography>
            <Box className="mb-4">
              <InputLabel className="text-gold">Nom</InputLabel>
              <input
                className="border rounded p-2 w-full text-base bg-noir text-gold"
                style={{ fontSize: 16 }}
                value={selectedEvent?.name || ""}
                onChange={e => setSelectedEvent(ev => ({ ...ev, name: e.target.value }))}
              />
            </Box>
            <Box className="mb-4">
              <InputLabel className="text-gold">Service</InputLabel>
              <Select
                value={selectedEvent?.service || ""}
                onChange={e => setSelectedEvent(ev => ({ ...ev, service: e.target.value }))}
                fullWidth
                className="bg-noir text-gold"
                style={{ fontSize: 16 }}
              >
                {serviceList.map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box className="mb-4">
              <InputLabel className="text-gold">Statut</InputLabel>
              <Select
                value={selectedEvent?.status || ""}
                onChange={e => setSelectedEvent(ev => ({ ...ev, status: e.target.value }))}
                fullWidth
                className="bg-noir text-gold"
                style={{ fontSize: 16 }}
              >
                <MenuItem value="pending">En attente</MenuItem>
                <MenuItem value="confirmed">Confirmé</MenuItem>
                <MenuItem value="cancelled">Annulé</MenuItem>
              </Select>
            </Box>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setSelectedEvent(null)}
                className="flex-1 min-w-[44px] h-12 rounded-xl text-base"
                style={{ fontSize: 16 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleQuickEdit}
                className="flex-1 min-w-[44px] h-12 rounded-xl text-base"
                style={{ fontSize: 16 }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Modale suppression RDV (plein écran mobile, transition) */}
      <CSSTransition
        in={showDeleteModal}
        timeout={350}
        classNames="fade-modal"
        unmountOnExit
      >
        <div
          className={`
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-60
          `}
        >
          <div
            className={`
              bg-noir rounded-xl shadow-lg p-6
              w-full max-w-md mx-auto
              ${window.innerWidth < 640 ? "rounded-none h-full flex flex-col justify-center" : ""}
            `}
          >
            <Typography variant="h6" className="mb-4 text-lg md:text-xl text-center">
              Supprimer ce rendez-vous ?
            </Typography>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 min-w-[44px] h-12 rounded-xl text-base"
                style={{ fontSize: 16 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={confirmDelete}
                className="flex-1 min-w-[44px] h-12 rounded-xl text-base"
                style={{ fontSize: 16 }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      </CSSTransition>

      {/* Affichage mobile : cards individuelles avec transition */}
      {loading ? (
  <div className="block md:hidden flex flex-col gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse bg-[#181818] rounded-xl h-24 w-full" />
    ))}
  </div>
) : (
  <TransitionGroup className="flex flex-col gap-4">
    {reservations.map((r) => (
      <CSSTransition key={r._id} timeout={350} classNames="fade-slide">
        <div
          className={`
            bg-[#181818] rounded-xl shadow-lg p-4 flex flex-col gap-2 border border-gold transition-all
            ${highlightedId === r._id ? "card-highlight" : ""}
          `}
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-lg">{r.name}</div>
              <div className="text-gold text-base">{r.service}</div>
              <div className="text-sm text-gray-400">{r.date} à {r.time}</div>
              <div className="text-sm text-gray-400">{r.phone}</div>
              <div className="text-sm text-gray-400">{r.email}</div>
              <div className="text-xs mt-1">
                Statut : <span className={r.status === "confirmed" ? "text-green-400" : "text-yellow-400"}>{r.status}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                aria-label="Éditer"
                className="bg-gold text-noir rounded-full w-12 h-12 flex items-center justify-center shadow-lg mb-1
    focus-visible:ring-2 focus-visible:ring-rose hover:scale-105 active:scale-95 transition-transform btn-action"
                style={{ minWidth: 44, minHeight: 44, fontSize: 20 }}
                onClick={() => handleEdit(r._id)}
              >
                <EditIcon fontSize="inherit" />
              </button>
              <button
                aria-label="Supprimer"
                className="bg-rose text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg mb-1
    focus-visible:ring-2 focus-visible:ring-rose hover:scale-105 active:scale-95 transition-transform btn-action"
                style={{ minWidth: 44, minHeight: 44, fontSize: 20 }}
                onClick={() => handleDelete(r._id)}
              >
                <DeleteIcon fontSize="inherit" />
              </button>
              <button
                aria-label="Valider"
                className={`bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg
    focus-visible:ring-2 focus-visible:ring-rose hover:scale-105 active:scale-95 transition-transform btn-action
    ${r.status === "confirmed" ? "opacity-50" : ""}`}
                style={{ minWidth: 44, minHeight: 44, fontSize: 20 }}
                onClick={() => handleValidate(r._id)}
                disabled={r.status === "confirmed"}
              >
                <CheckCircleIcon fontSize="inherit" />
              </button>
            </div>
          </div>
        </div>
      </CSSTransition>
    ))}
  </TransitionGroup>
)}

      {/* Affichage desktop : DataGrid */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl bg-noir mt-4">
        <DataGrid
          rows={reservations.map((r) => ({ ...r, id: r._id }))}
          columns={columns.map(col =>
            col.field === "actions"
              ? {
                  ...col,
                  renderCell: (params) => (
                    <Stack direction="row" spacing={1} className="w-full">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEdit(params.row._id)}
                        className="min-w-[44px] h-12 rounded-xl text-base"
                        style={{ fontSize: 16 }}
                      >
                        Éditer
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(params.row._id)}
                        className="min-w-[44px] h-12 rounded-xl text-base"
                        style={{ fontSize: 16 }}
                      >
                        Supprimer
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        disabled={params.row.status === "confirmed"}
                        onClick={() => handleValidate(params.row._id)}
                        className="min-w-[44px] h-12 rounded-xl text-base"
                        style={{ fontSize: 16 }}
                      >
                        Valider
                      </Button>
                    </Stack>
                  ),
                }
              : { ...col, headerClassName: "text-base md:text-lg", cellClassName: "text-base md:text-lg" }
          )}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          autoHeight
          sx={{
            fontSize: 16,
            "& .MuiDataGrid-cell": { py: 2 },
            "& .MuiDataGrid-columnHeaders": { fontSize: 16 },
          }}
        />
      </div>

      {/* FAB mobile pour ajouter un RDV */}
      <button
        type="button"
        aria-label="Ajouter un rendez-vous"
        className="fixed z-50 bottom-24 right-4 md:hidden bg-rose text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl
    hover:bg-pink-600 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose btn-action"
        style={{ minWidth: 56, minHeight: 56 }}
        onClick={() => {
          window.location.hash = "#booking";
        }}
      >
        <AddIcon fontSize="inherit" />
      </button>

      {/* MENU NAVIGATION MOBILE FIXE */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-noir border-t border-gold flex justify-around items-center h-16 md:hidden">
        {navItems.map((item) => {
          const isActive =
            (item.to === "/" && location.pathname === "/") ||
            (item.to.startsWith("/dashboard") && location.pathname === "/dashboard" && location.hash === item.to.replace("/dashboard", ""));
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className={`flex flex-col items-center justify-center flex-1 h-full focus:outline-none
          focus-visible:ring-2 focus-visible:ring-rose hover:scale-105 active:scale-95 transition-transform btn-action
          ${isActive ? "text-rose" : "text-gold"}`}
              aria-label={item.label}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              <item.icon className="w-7 h-7 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Dashboard;