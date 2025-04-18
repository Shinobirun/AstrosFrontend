import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede: "Palermo",
    nivel: "Principiantes",
    dia: "Lunes",
    hora: "",
    cuposDisponibles: 10, // Se agregó este campo
    ocupadoPor: [], // Inicialmente vacío
    activo: true,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "cuposDisponibles" ? Number(value) : value, // Convierte cuposDisponibles a número
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/turnos", formData, {
        headers: { Authorization: `Bearer ${token}` }, // Token para autenticación
      });
      navigate("/turnos"); // Redirige a la lista de turnos
    } catch (err) {
      setError("Error al crear el turno. Verifica los datos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Turno</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sede */}
          <label className="block">
            <span className="text-gray-700">Sede:</span>
            <select
              name="sede"
              value={formData.sede}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md"
            >
              <option value="Palermo">Palermo</option>
              <option value="Fulgor">Fulgor</option>
            </select>
          </label>

          {/* Nivel */}
          <label className="block">
            <span className="text-gray-700">Nivel:</span>
            <select
              name="nivel"
              value={formData.nivel}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md"
            >
              <option value="Principiantes">Principiantes</option>
              <option value="Intermedios">Intermedios</option>
              <option value="Avanzados">Avanzados</option>
            </select>
          </label>

          {/* Día */}
          <label className="block">
            <span className="text-gray-700">Día:</span>
            <select
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md"
            >
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>
          </label>

          {/* Hora */}
          <label className="block">
            <span className="text-gray-700">Hora:</span>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              className="block w-full mt-1 border-gray-300 rounded-md"
            />
          </label>

          {/* Cupos Disponibles */}
          <label className="block">
            <span className="text-gray-700">Cupos Disponibles:</span>
            <input
              type="number"
              name="cuposDisponibles"
              value={formData.cuposDisponibles}
              onChange={handleChange}
              min="1"
              required
              className="block w-full mt-1 border-gray-300 rounded-md"
            />
          </label>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Crear Turno
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearTurno;
