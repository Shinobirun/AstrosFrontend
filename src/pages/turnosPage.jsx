import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  parseISO,
} from "date-fns";
import es from "date-fns/locale/es";

const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadoresDelTurno, setJugadoresDelTurno] = useState([]);
  const [loadingJugadores, setLoadingJugadores] = useState(false);

  useEffect(() => {
    fetchTurnos();
  }, []);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://astrosfrontend.onrender.com/api/turnos/todos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  const renderCalendar = () => {
    const today = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // lunes
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const turnosDelDia = turnos.filter((t) => isSameDay(day, t.fecha));

        // Clase especial para el día de hoy
        const isToday = isSameDay(day, today);
        const dayClass = isToday
            ? "border-4 border-green-600 p-2 h-32 align-top overflow-y-auto text-sm bg-white text-black"
            : "border p-2 h-32 align-top overflow-y-auto text-sm bg-white text-black";

        days.push(
          <div className={dayClass} key={day}>
            <div className="font-bold text-xs text-gray-700">{formattedDate}</div>
            {turnosDelDia.map((turno) => (
              <div
                key={turno._id}
                className="bg-blue-200 mt-1 p-1 rounded cursor-pointer hover:bg-blue-300"
                onClick={() => mostrarJugadores(turno)}
              >
                {turno.hora} - {turno.nivel} - {turno.sede}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-px" key={day}>
          {days}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4">
        Calendario de Turnos - {format(currentMonth, "MMMM yyyy", { locale: es })}
      </h2>

      <div className="grid grid-cols-7 bg-gray-200 text-center font-semibold text-sm text-gray-700">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="p-2 border">
            {day}
          </div>
        ))}
      </div>

      {renderCalendar()}

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
    </div>
  );
};

export default TurnosPage;

