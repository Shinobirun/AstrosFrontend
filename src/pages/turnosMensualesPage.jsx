import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from "date-fns";
import es from "date-fns/locale/es";

const TurnosMensualesPage = () => {
  const { userId } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMensuales = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Sin token");
        setCargando(false);
        return;
      }

      try {
        const perfilReq = axios.get(
          `https://astrosfrontend.onrender.com/api/users/usuario/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const turnosReq = axios.get(
          `https://astrosfrontend.onrender.com/api/users/turnosMensuales/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const [perfilRes, turnosRes] = await Promise.all([perfilReq, turnosReq]);
        setUsuario(perfilRes.data);
        // Parsear fecha de cada turno a Date
        const parsed = turnosRes.data.map(t => ({
          ...t,
          fecha: parseISO(t.fecha),
        }));
        setTurnos(parsed);
      } catch (err) {
        console.error("Error al obtener datos:", err.response?.data || err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchMensuales();
  }, [userId]);

  const liberar = async (turnoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://astrosfrontend.onrender.com/api/turnos/liberar",
        { turnoId, userId, tipo: "mensual" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTurnos(prev => prev.filter(t => t._id !== turnoId));
    } catch (err) {
      console.error("Error al liberar:", err.response?.data || err.message);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // domingo
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;

        // Obtener turnos del día
        const turnosDelDia = turnos.filter(t => isSameDay(t.fecha, cloneDay));

        const isToday = isSameDay(day, new Date());
        const inCurrentMonth = isSameMonth(day, monthStart);

        const dayClass = `${
          isToday
            ? "border-2 border-green-600"
            : inCurrentMonth
            ? "border"
            : "border bg-gray-100 text-gray-400"
        } p-2 h-32 align-top overflow-y-auto text-sm bg-white text-black`;

        days.push(
          <div className={dayClass} key={day}>
            <div className="font-bold text-xs text-gray-700">{formattedDate}</div>
            {turnosDelDia.map((t, idx) => (
              <div key={idx} className="mt-1 p-1 text-xs rounded bg-blue-100 hover:bg-blue-200">
                <div>{t.sede}</div>
                <div>{t.nivel}</div>
                <div className="text-xs">{t.hora}</div>
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
      days = [];
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            ← Mes anterior
          </button>
          <span className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </span>
          <button
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
          >
            Mes siguiente →
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-200 text-center font-semibold text-sm text-gray-700 mb-1">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(dayName => (
            <div key={dayName} className="p-2 border">
              {dayName}
            </div>
          ))}
        </div>

        {rows}
      </div>
    );
  };

  if (cargando) return <p className="p-4">Cargando…</p>;
  if (!usuario) return <p className="p-4">Usuario no encontrado.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/Astros.png" alt="Astros logo" className="h-20" />
      </div>

      {/* Navegación */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          ← Volver al Dashboard
        </button>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          ← Volver
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Turnos Mensuales de {usuario.firstName} {usuario.lastName}
      </h2>

      {turnos.length === 0 ? (
        <p>No hay turnos mensuales asignados.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {turnos.map((t) => (
              <div
                key={t._id}
                className="bg-white p-4 rounded shadow flex flex-col justify-between"
              >
                <div>
                  <p><strong>Fecha:</strong> {format(t.fecha, "dd/MM/yyyy")}</p>
                  <p><strong>Sede:</strong> {t.sede}</p>
                  <p><strong>Nivel:</strong> {t.nivel}</p>
                  <p><strong>Día:</strong> {t.dia}</p>
                  <p><strong>Hora:</strong> {t.hora}</p>
                </div>
                <button
                  onClick={() => liberar(t._id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                >
                  Liberar turno
                </button>
              </div>
            ))}
          </div>

          {/* Calendario mensual con navegación */}
          {renderCalendar()}
        </>
      )}
    </div>
  );
};

export default TurnosMensualesPage;
