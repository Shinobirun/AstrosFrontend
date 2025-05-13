import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TurnosMensualesPage = () => {
  const { userId } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);
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
        // 1) Perfil
        const perfilReq = axios.get(
          `http://localhost:5000/api/users/usuario/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // 2) Turnos mensuales
        const turnosReq = axios.get(
          `http://localhost:5000/api/users/turnosMensuales/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const [perfilRes, turnosRes] = await Promise.all([perfilReq, turnosReq]);
        setUsuario(perfilRes.data);
        setTurnos(turnosRes.data);
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
        "http://localhost:5000/api/turnos/liberar",
        { turnoId, userId, tipo: "mensual" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Eliminamos el turno liberado del estado
      setTurnos((prev) => prev.filter((t) => t._id !== turnoId));
    } catch (err) {
      console.error("Error al liberar:", err.response?.data || err.message);
    }
  };

  if (cargando) return <p className="p-4">Cargando…</p>;
  if (!usuario) return <p className="p-4">Usuario no encontrado.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Turnos Mensuales de {usuario.firstName} {usuario.lastName}
      </h2>

      {turnos.length === 0 ? (
        <p>No hay turnos mensuales asignados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {turnos.map((t) => (
            <div
              key={t._id}
              className="bg-white p-4 rounded shadow flex flex-col justify-between"
            >
              <div>
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
      )}
    </div>
  );
};

export default TurnosMensualesPage;
