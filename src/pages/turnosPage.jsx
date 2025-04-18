import React, { useEffect, useState } from "react";
import axios from "axios";

const TurnosPage = () => {
  const [turnos, setTurnos] = useState([]);
  const [groupedTurnos, setGroupedTurnos] = useState({});
  const [selectedTurnos, setSelectedTurnos] = useState([]);
  const [filtroDia, setFiltroDia] = useState("Todos"); // Estado para el filtro

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token usado:", token);

        const response = await axios.get("http://localhost:5000/api/turnos/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Turnos recibidos:", response.data);

        if (Array.isArray(response.data)) {
          setTurnos(response.data);
        } else {
          console.error("La API no devolvió un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener los turnos:", error.response?.data || error.message);
      }
    };

    fetchTurnos();
  }, []);

  useEffect(() => {
    if (turnos.length > 0) {
      groupTurnosByDay(turnos);
    }
  }, [turnos]);

  // Agrupar turnos por día, solo mostrando los que tienen cupos disponibles
  const groupTurnosByDay = (turnos) => {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    let grouped = {};

    days.forEach((day) => {
      grouped[day] = turnos
        .filter((turno) => turno.dia === day && turno.cuposDisponibles > 0) // Solo turnos con cupos disponibles
        .sort((a, b) => {
          const convertToMinutes = (time) => {
            if (!time) return 0;
            const [hours, minutes] = time.split(":").map(Number);
            return hours * 60 + minutes;
          };
          return convertToMinutes(a.hora) - convertToMinutes(b.hora);
        });
    });

    console.log("Turnos agrupados y ordenados:", grouped);
    setGroupedTurnos(grouped);
  };

  const toggleSelectTurno = (turnoId) => {
    setSelectedTurnos((prevSelected) =>
      prevSelected.includes(turnoId)
        ? prevSelected.filter((id) => id !== turnoId)
        : [...prevSelected, turnoId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Calendario de Turnos</h2>

      {/* Filtro de días */}
      <div className="flex justify-center mb-4">
        <select
          className="p-2 border rounded-lg"
          value={filtroDia}
          onChange={(e) => setFiltroDia(e.target.value)}
        >
          <option value="Todos">Semana Completa</option>
          {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white p-4 shadow-md rounded-lg">
          <thead>
            <tr className="border-b">
              {filtroDia === "Todos"
                ? ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                    <th key={day} className="text-center py-2 px-4 font-semibold">{day}</th>
                  ))
                : [filtroDia].map((day) => (
                    <th key={day} className="text-center py-2 px-4 font-semibold">{day}</th>
                  ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {filtroDia === "Todos"
                ? ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((day) => (
                    <td key={day} className="py-2 px-4 border-b">
                      {groupedTurnos[day] && groupedTurnos[day].length > 0 ? (
                        <ul>
                          {groupedTurnos[day].map((turno) => (
                            <li
                              key={turno._id}
                              className={`mb-2 p-4 border rounded-lg cursor-pointer ${
                                selectedTurnos.includes(turno._id)
                                  ? "bg-blue-200 border-blue-500"
                                  : "bg-white border-gray-300"
                              }`}
                              onClick={() => toggleSelectTurno(turno._id)}
                            >
                              <span className="font-semibold">{turno.nivel}</span> - {turno.dia} a las {turno.hora} 
                              - <span className="italic text-blue-600">{turno.sede}</span>
                              <div className="text-sm text-gray-600">
                                Cupos disponibles: {turno.cuposDisponibles}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No hay turnos</p>
                      )}
                    </td>
                  ))
                : [filtroDia].map((day) => (
                    <td key={day} className="py-2 px-4 border-b">
                      {groupedTurnos[day] && groupedTurnos[day].length > 0 ? (
                        <ul>
                          {groupedTurnos[day].map((turno) => (
                            <li
                              key={turno._id}
                              className={`mb-2 p-4 border rounded-lg cursor-pointer ${
                                selectedTurnos.includes(turno._id)
                                  ? "bg-blue-200 border-blue-500"
                                  : "bg-white border-gray-300"
                              }`}
                              onClick={() => toggleSelectTurno(turno._id)}
                            >
                              <span className="font-semibold">{turno.nivel}</span> - {turno.dia} a las {turno.hora} 
                              - <span className="italic text-blue-600">{turno.sede}</span>
                              <div className="text-sm text-gray-600">
                                Cupos disponibles: {turno.cuposDisponibles}
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
    </div>
  );
};

export default TurnosPage;
