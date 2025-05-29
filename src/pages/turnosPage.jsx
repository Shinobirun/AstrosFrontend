import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [groupedTurnos, setGroupedTurnos] = useState({});
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [filtroDia, setFiltroDia] = useState("Todos");
  const [tipoTurno, setTipoTurno] = useState("Mensuales");
  const [modalVisible, setModalVisible] = useState(false);
  const [jugadoresDelTurno, setJugadoresDelTurno] = useState([]);
  const [loadingJugadores, setLoadingJugadores] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTurnos();
  }, [tipoTurno]);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const endpoint =
        tipoTurno === "Mensuales"
          ? "https://astrosfrontend.onrender.com/api/turnos/todos"
          : "https://astrosfrontend.onrender.com/api/turnosSemanales/todoSema";

      const { data } = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTurnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Error al obtener los turnos:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error al cargar jugadores:",
        error.response?.data || error.message
      );
      setJugadoresDelTurno([]);
    } finally {
      setLoadingJugadores(false);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setJugadoresDelTurno([]);
  };

  const diasMostrar =
    filtroDia === "Todos"
      ? ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
      : [filtroDia];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-center mb-6">
        <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Calendario de Turnos
      </h2>

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
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map(
            (d) => (
              <option key={d} value={d}>
                {d}
              </option>
            )
          )}
        </select>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="border-b">
              {diasMostrar.map((day) => (
                <th key={day} className="text-center py-2 px-4 font-semibold">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {diasMostrar.map((day) => (
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
                          <div>
                            <span className="font-semibold">{t.nivel}</span> - {t.hora} -{" "}
                            <span className="italic text-blue-600">{t.sede}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Cupos: {t.cuposDisponibles}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              mostrarJugadores(t);
                            }}
                            className="mt-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Mostrar jugadores
                          </button>
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

      <div className="mt-6 text-center">
       {/* Botón para volver al dashboard */}
      <button
        onClick={() => navigate('/dashboard')} // 👈 Redirecciona al dashboard
        className="mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Volver al Dashboard
      </button>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Jugadores del Turno</h3>

            {loadingJugadores ? (
              <p>Cargando jugadores...</p>
            ) : jugadoresDelTurno.length > 0 ? (
              <ul className="space-y-2">
                {jugadoresDelTurno.map((j, i) => (
                  <li key={i} className="text-gray-800">
                    {j.firstName} {j.lastName} -{" "}
                    <span className="text-sm text-gray-600">{j.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No hay jugadores registrados.</p>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosPage;
