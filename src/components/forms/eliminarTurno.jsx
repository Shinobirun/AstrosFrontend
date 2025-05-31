import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  parseISO,
} from "date-fns";

export default function TurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://astrosfrontend.onrender.com/api/turnos/todos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTurnos(res.data))
      .catch((err) =>
        console.error("Error cargando turnos:", err.response?.data || err.message)
      );
  };

  const eliminarTurno = async () => {
    if (!turnoSeleccionado) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://astrosfrontend.onrender.com/api/turnos/${turnoSeleccionado._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDialogOpen(false);
      setTurnoSeleccionado(null);
      cargarTurnos();
    } catch (error) {
      console.error("Error al eliminar el turno:", error.response?.data || error.message);
    }
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
          <td key={dayStr} className={`border p-2 align-top h-28 ${!isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : ""}`}>
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

      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }

    return <tbody>{rows}</tbody>;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/Astros.png" alt="Astros Logo" className="h-16" />
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Calendario de Turnos</h2>

        {/* Navegación */}
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

        {/* Tabla del calendario */}
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

      {/* Modal de confirmación */}
      {dialogOpen && turnoSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-center mb-2">¿Eliminar este turno?</h3>
            <div className="text-center text-gray-700 text-sm mb-4">
              <p><strong>Día:</strong> {format(parseISO(turnoSeleccionado.fecha), "dd/MM/yyyy")}</p>
              <p><strong>Sede:</strong> {turnoSeleccionado.sede}</p>
              <p><strong>Hora:</strong> {turnoSeleccionado.hora}</p>
            </div>
            <div className="flex justify-around">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => {
                  setDialogOpen(false);
                  setTurnoSeleccionado(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={eliminarTurno}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volver al Dashboard */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}
