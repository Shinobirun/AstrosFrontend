import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parseISO,
} from "date-fns";
import es from "date-fns/locale/es";

const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadoresDelTurno, setJugadoresDelTurno] = useState([]);
  const [loadingJugadores, setLoadingJugadores] = useState(false);
  const [modalTurnosDelDia, setModalTurnosDelDia] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [turnosDelDia, setTurnosDelDia] = useState([]);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://astrosfrontend.onrender.com/api/turnos/todos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTurnos(data.map((t) => ({ ...t, fecha: parseISO(t.fecha) })));
    } catch (error) {
      console.error("Error al obtener los turnos:", error.message);
    }
  };

  const mostrarJugadores = async (turno) => {
    if (!turno.ocupadoPor || turno.ocupadoPor.length === 0) {
      setJugadoresDelTurno([]);
      setModalVisible(true);
      return;
    }

    setLoadingJugadores(true);
    setModalVisible(true);

    try {
      const token = localStorage.getItem("token");
      const jugadoresData = await Promise.all(
        turno.ocupadoPor.map(async (userId) => {
          const { data } = await axios.get(
            `https://astrosfrontend.onrender.com/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return {
            firstName: data.first_name || data.firstName || "N/A",
            lastName: data.last_name || data.lastName || "N/A",
            role: data.role || data.rol || "N/A",
          };
        })
      );
      setJugadoresDelTurno(jugadoresData);
    } catch (error) {
      console.error("Error al cargar jugadores:", error.message);
      setJugadoresDelTurno([]);
    } finally {
      setLoadingJugadores(false);
    }
  };

  const abrirModalDelDia = (dia) => {
    const turnosDia = turnos.filter((t) => isSameDay(dia, t.fecha));
    setFechaSeleccionada(dia);
    setTurnosDelDia(turnosDia);
    setModalTurnosDelDia(true);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
      >
        ← Mes anterior
      </button>
      <span className="text-xl font-semibold">
        {format(currentMonth, "MMMM yyyy", { locale: es })}
      </span>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
      >
        Mes siguiente →
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    let day = startDate;

    while (day <= endDate) {
      const formattedDate = format(day, "d");
      const cloneDay = day;
      const turnosDelDia = turnos.filter((t) => isSameDay(day, t.fecha));

      days.push(
        <div
          className={`border p-2 h-32 align-top overflow-y-auto text-sm cursor-pointer ${
            !isSameMonth(day, currentMonth) ? "bg-gray-100 text-gray-400" : "bg-white text-black"
          } ${isSameDay(day, date) ? "border-4 border-green-600" : ""}`}
          key={day}
          onClick={() => abrirModalDelDia(cloneDay)}
        >
          <div className="font-bold text-xs text-gray-700">{formattedDate}</div>
          {turnosDelDia.slice(0, 3).map((turno, i) => (
            <div key={i} className="bg-blue-100 mt-1 p-1 rounded text-xs truncate">
              {turno.hora} - {turno.nivel}
            </div>
          ))}
          {turnosDelDia.length > 3 && (
            <div className="text-xs text-blue-600 mt-1">+ más</div>
          )}
        </div>
      );
      day = addDays(day, 1);
    }

    const rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(
        <div className="grid grid-cols-7 gap-px" key={i}>
          {days.slice(i, i + 7)}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4">Calendario de Turnos</h2>

      {renderHeader()}

      <div className="grid grid-cols-7 bg-gray-200 text-center font-semibold text-sm text-gray-700">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="p-2 border">
            {day}
          </div>
        ))}
      </div>

      {renderDays()}

      {/* Modal de jugadores */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Jugadores del Turno</h3>
            {loadingJugadores ? (
              <p>Cargando jugadores...</p>
            ) : jugadoresDelTurno.length > 0 ? (
              <ul className="space-y-1">
                {jugadoresDelTurno.map((j, i) => (
                  <li key={i} className="text-gray-800">
                    {j.firstName} {j.lastName} ({j.role})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay jugadores registrados</p>
            )}
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de turnos del día */}
      {modalTurnosDelDia && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-2">
              Turnos del {format(fechaSeleccionada, "PPP", { locale: es })}
            </h3>
            {turnosDelDia.length > 0 ? (
              <ul className="space-y-2">
                {turnosDelDia.map((turno) => (
                  <li
                    key={turno._id}
                    onClick={() => mostrarJugadores(turno)}
                    className="p-2 bg-blue-200 rounded hover:bg-blue-300 cursor-pointer"
                  >
                    {turno.hora} - {turno.nivel} - {turno.sede}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay turnos para este día.</p>
            )}
            <button
              onClick={() => setModalTurnosDelDia(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosPage;
