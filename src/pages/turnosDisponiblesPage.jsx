import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TurnosDisponiblesPage = () => {
  const { nivel } = useParams();
  const [turnos, setTurnos] = useState([]);
  const [groupedTurnos, setGroupedTurnos] = useState({});
  const [selectedTurno, setSelectedTurno] = useState(null);

  useEffect(() => {
    fetchTurnos();
  }, [nivel]);

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/turnos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filteredTurnos = [];
      if (nivel === "Principiante") {
        filteredTurnos = response.data.filter((turno) => turno.nivel === "Principiantes");
      } else if (nivel === "Intermedio") {
        filteredTurnos = response.data.filter(
          (turno) => turno.nivel === "Principiantes" || turno.nivel === "Intermedios"
        );
      } else if (nivel === "Avanzado") {
        filteredTurnos = response.data.filter(
          (turno) => turno.nivel === "Intermedios" || turno.nivel === "Avanzados"
        );
      }

      setTurnos(filteredTurnos);
      groupTurnosByDay(filteredTurnos);
    } catch (error) {
      console.error("Error al obtener los turnos disponibles:", error);
    }
  };

  const groupTurnosByDay = (turnos) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    let grouped = {};

    days.forEach((day) => {
      grouped[day] = turnos
        .filter((turno) => turno.dia === day)
        .sort((a, b) => {
          const convertToMinutes = (time) => {
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
          };

          return convertToMinutes(a.hora) - convertToMinutes(b.hora);
        });
    });

    setGroupedTurnos(grouped);
  };

  const handleTomarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/turnos/tomar",
        { turnoId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Turno tomado con éxito");
      fetchTurnos(); // Recargar los turnos después de tomar uno
    } catch (error) {
      console.error("Error al tomar el turno:", error);
      alert("No se pudo tomar el turno");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Turnos Disponibles ({nivel})
      </h2>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white p-4 shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <th key={day} className="text-center py-2 px-4 font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                <td key={day} className="py-2 px-4 border-b">
                  {groupedTurnos[day] && groupedTurnos[day].length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {groupedTurnos[day].map((turno) => (
                        <div
                          key={turno._id}
                          className={`cursor-pointer p-3 rounded-md border shadow-sm ${
                            selectedTurno === turno._id ? "bg-blue-200 border-blue-500" : "bg-gray-50"
                          }`}
                          onClick={() => setSelectedTurno(turno._id)}
                        >
                          <span className="font-semibold">{turno.nivel}</span> - {turno.hora}
                          <div className="text-sm text-gray-600">
                            {turno.sede} - Cupos: {turno.cuposDisponibles}
                          </div>
                          <button
                            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                            onClick={() => handleTomarTurno(turno._id)}
                          >
                            Tomar Turno
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No hay turnos</p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TurnosDisponiblesPage;
