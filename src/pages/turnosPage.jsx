import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [groupedTurnos, setGroupedTurnos] = useState({});
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [filtroDia, setFiltroDia] = useState("Todos");
  const [tipoTurno, setTipoTurno] = useState("Mensuales");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTurnos();
  }, [tipoTurno]);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        tipoTurno === "Mensuales"
          ? "http://localhost:5000/api/turnos/todos"
          : "http://localhost:5000/api/turnosSemanales/todoSema";

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener los turnos:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (turnos.length) groupTurnosByDay(turnos);
    else setGroupedTurnos({});
  }, [turnos]);

  const groupTurnosByDay = (turnos) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const grouped = {};
    days.forEach((day) => {
      grouped[day] = turnos
        .filter((t) => t.dia === day && t.cuposDisponibles > 0)
        .sort((a, b) => {
          const toMin = (h) => {
            const [H, M] = (h || "00:00").split(":").map(Number);
            return H * 60 + M;
          };
          return toMin(a.hora) - toMin(b.hora);
        });
    });
    setGroupedTurnos(grouped);
  };

  const toggleSelectTurno = (turnoId) =>
    setSelectedTurnos((prev) =>
      prev.includes(turnoId) ? prev.filter((id) => id !== turnoId) : [...prev, turnoId]
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Calendario de Turnos
      </h2>

      {/* Selectores */}
      <div className="flex justify-center mb-4 gap-4">
        <select
          className="p-2 border rounded-lg"
          value={tipoTurno}
          onChange={(e) => setTipoTurno(e.target.value)}
        >
          <option value="Mensuales">Turnos Mensuales</option>
          <option value="Semanales">Turnos Semanales</option>
        </select>
        <select
          className="p-2 border rounded-lg"
          value={filtroDia}
          onChange={(e) => setFiltroDia(e.target.value)}
        >
          <option value="Todos">Semana Completa</option>
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b">
              {(filtroDia === "Todos"
                ? ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
                : [filtroDia]
              ).map((day) => (
                <th key={day} className="text-center py-2 px-4 font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {(filtroDia === "Todos"
                ? ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
                : [filtroDia]
              ).map((day) => (
                <td key={day} className="py-2 px-4 border-b align-top">
                  {groupedTurnos[day]?.length > 0 ? (
                    <ul>
                      {groupedTurnos[day].map((t) => (
                        <li
                          key={t._id}
                          className={`mb-2 p-4 border rounded-lg cursor-pointer ${
                            selectedTurnos.includes(t._id)
                              ? "bg-blue-200 border-blue-500"
                              : "bg-white border-gray-300"
                          }`}
                          onClick={() => toggleSelectTurno(t._id)}
                        >
                          <span className="font-semibold">{t.nivel}</span> - {t.hora} -{" "}
                          <span className="italic text-blue-600">{t.sede}</span>
                          <div className="text-sm text-gray-600">
                            Cupos: {t.cuposDisponibles}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No hay turnos</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Botón para volver */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default TurnosPage;
