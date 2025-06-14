import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearTurnoMensual = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede: "Palermo",
    nivel: "Blanco",
    dia: "Lunes",
    hora: "",
    cuposDisponibles: 10,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "cuposDisponibles" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.hora || !formData.dia) {
      setError("La hora y el día son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://astrosfrontend.onrender.com/api/plantilla", // tu ruta POST
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Turno mensual creado:", response.data);
      navigate("/turnos");
    } catch (err) {
      setError("Error al crear el turno mensual.");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear Turno Mensual
        </h2>
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
              <option value="Blanco">Blanco</option>
              <option value="Azul">Azul</option>
              <option value="Violeta">Violeta</option>
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
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
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

          {/* Cupos */}
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

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Crear Plantilla de Turno
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="block mx-auto w-full h-10 mt-2 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearTurnoMensual;

