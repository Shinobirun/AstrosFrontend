import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, getDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  parseISO,
} from "date-fns";
import {jwtDecode} from "jwt-decode";

export default function TurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // URLs de la API
  const localUrl = "http://localhost:5000/api/turnos";
  const remoteUrl = "https://astrosfrontend.onrender.com/api/turnos";

  // Función helper para probar local y fallback remoto
  const axiosGetFallback = async (endpoint, config) => {
    try {
      return await axios.get(`${localUrl}${endpoint}`, config);
    } catch {
      return await axios.get(`${remoteUrl}${endpoint}`, config);
    }
  };

  const axiosDeleteFallback = async (endpoint, config) => {
    try {
      return await axios.delete(`${localUrl}${endpoint}`, config);
    } catch {
      return await axios.delete(`${remoteUrl}${endpoint}`, config);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        cargarTurnos(decoded);
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const cargarTurnos = async (decodedUser) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosGetFallback("/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todosLosTurnos = res.data;

      const rol = decodedUser?.role?.toLowerCase() || "";
      const esUsuarioComun = ["blanco", "azul", "violeta"].includes(rol);

      const turnosFiltrados = esUsuarioComun
        ? todosLosTurnos.filter((t) => t.userId === decodedUser.id)
        : todosLosTurnos;

      setTurnos(turnosFiltrados);
    } catch (err) {
      console.error("Error cargando turnos:", err.response?.data || err.message);
    }
  };

  const eliminarTurno = async () => {
    if (!turnoSeleccionado) return;
    try {
      const token = localStorage.getItem("token");
      await axiosDeleteFallback(`/${turnoSeleccionado._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cerrarDialogoYRecargar();
    } catch (error) {
      console.error(
        "Error al eliminar el turno:",
        error.response?.data || error.message
      );
    }
  };

  const obtenerDiaTexto = (fecha) => {
    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    return dias[getDay(new Date(fecha))];
  };

  const eliminarTurnosDesdeFecha = async () => {
    if (!turnoSeleccionado) return;

    try {
      const token = localStorage.getItem("token");
      const fechaISO = format(new Date(turnoSeleccionado.fecha), "yyyy-MM-dd");
      const diaTexto = obtenerDiaTexto(turnoSeleccionado.fecha);

      await axiosDeleteFallback(
        `/eliminarDesdeFecha/${fechaISO}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            sede: turnoSeleccionado.sede,
            hora: turnoSeleccionado.hora,
            dia: diaTexto,
          },
        }
      );
      console.log("Eliminar turno con ID:", turnoSeleccionado._id);

      cerrarDialogoYRecargar();
    } catch (error) {
      console.error(
        "Error al eliminar turnos desde esta fecha:",
        error.response?.data || error.message
      );
    }
  };

  const cerrarDialogoYRecargar = () => {
    setDialogOpen(false);
    setTurnoSeleccionado(null);
    if (user) cargarTurnos(user);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    let rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dayStr = format(day, "yyyy-MM-dd");
        const turnosDelDia = turnos.filter(
          (t) => format(parseISO(t.fecha), "yyyy-MM-dd") === dayStr
        );

        days.push(
          <td
            key={dayStr}
            className={`border p-2 align-top h-28 ${
              !isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : ""
            }`}
          >
            <div className="font-bold">{format(day, "d")}</div>
            {turnosDelDia.map((turno) => (
              <div
                key={turno._id}
                className="mt-1 p-1 text-xs rounded bg-blue-100 hover:bg-blue-200 cursor-pointer"
              >
                <div>{turno.sede}</div>
                <div>{turno.hora}</div>
                <button
                  onClick={() => {
                    setTurnoSeleccionado(turno);
                    setDialogOpen(true);
                  }}
                  className="text-red-600 text-xs underline mt-1"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </td>
        );
        day = addDays(day, 1);
      }

      rows.push(<tr key={day.toISOString()}>{days}</tr>);
      days = [];
    }

    return <tbody>{rows}</tbody>;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-center mb-4">
        <img src="/Astros.png" alt="Astros Logo" className="h-16" />
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Calendario de Turnos
        </h2>

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            ← Mes anterior
          </button>
          <span className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Mes siguiente →
          </button>
        </div>

        <table className="w-full table-fixed border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="p-2">Lun</th>
              <th className="p-2">Mar</th>
              <th className="p-2">Mié</th>
              <th className="p-2">Jue</th>
              <th className="p-2">Vie</th>
              <th className="p-2">Sáb</th>
              <th className="p-2">Dom</th>
            </tr>
          </thead>
          {renderCalendar()}
        </table>
      </div>

      {dialogOpen && turnoSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-center mb-2">
              ¿Eliminar este turno o todos desde esta fecha?
            </h3>
            <div className="text-center text-gray-700 text-sm mb-4">
              <p>
                <strong>Día:</strong>{" "}
                {format(parseISO(turnoSeleccionado.fecha), "dd/MM/yyyy")}
              </p>
              <p>
                <strong>Sede:</strong> {turnoSeleccionado.sede}
              </p>
              <p>
                <strong>Hora:</strong> {turnoSeleccionado.hora}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={eliminarTurno}
              >
                Eliminar solo este turno
              </button>
              <button
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800"
                onClick={eliminarTurnosDesdeFecha}
              >
                Eliminar desde esta fecha
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}