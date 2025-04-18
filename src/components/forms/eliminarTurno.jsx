import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroDia, setFiltroDia] = useState("Todos");
  const navigate = useNavigate();

  const diasSemana = {
    "Lunes": 1,
    "Martes": 2,
    "Miércoles": 3,
    "Jueves": 4,
    "Viernes": 5,
    "Sábado": 6,
    "Domingo": 7
  };

  const cargarTurnos = () => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/turnos/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const turnosOrdenados = response.data.sort((a, b) => {
          const diaA = diasSemana[a.dia] || 8;
          const diaB = diasSemana[b.dia] || 8;
          const horaA = a.hora;
          const horaB = b.hora;
          return diaA - diaB || horaA.localeCompare(horaB);
        });
        setTurnos(turnosOrdenados);
      })
      .catch((error) =>
        console.error("Error cargando turnos:", error.response?.data || error.message)
      );
  };

  useEffect(() => {
    cargarTurnos();
  }, []);

  const eliminarTurno = async () => {
    if (!turnoSeleccionado) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      await axios.delete(`http://localhost:5000/api/turnos/${turnoSeleccionado._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDialogOpen(false);
      cargarTurnos();
    } catch (error) {
      console.error("Error al eliminar el turno:", error.response?.data || error.message);
    }
  };

  const turnosFiltrados = filtroDia === "Todos"
    ? turnos
    : turnos.filter(turno => turno.dia === filtroDia);

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Lista de Turnos</h2>

        {/* Filtro por día */}
        <div className="mb-4 text-center">
          <label className="mr-2 font-semibold">Filtrar por día:</label>
          <select
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="Todos">Todos</option>
            {Object.keys(diasSemana).map((dia) => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
        </div>

        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Día</th>
              <th className="border p-2">Sede</th>
              <th className="border p-2">Hora</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.map((turno) => (
              <tr key={turno._id} className="hover:bg-gray-100">
                <td className="border p-2 text-center">{turno.dia}</td>
                <td className="border p-2 text-center">{turno.sede}</td>
                <td className="border p-2 text-center">{turno.hora}</td>
                <td className="border p-2 text-center">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => {
                      setTurnoSeleccionado(turno);
                      setDialogOpen(true);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-center">¿Eliminar este turno?</h3>
            <p className="text-center text-gray-600">Día: {turnoSeleccionado?.dia}</p>
            <p className="text-center text-gray-600">Sede: {turnoSeleccionado?.sede}</p>
            <p className="text-center text-gray-600">Hora: {turnoSeleccionado?.hora}</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={eliminarTurno}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
