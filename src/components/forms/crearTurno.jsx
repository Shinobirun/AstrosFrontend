import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CrearTurno = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede: "Palermo",
    nivel: "Blanco",
    dia: "Lunes",
    hora: "",
    cuposDisponibles: 10,
    ocupadoPor: [],
    activo: true,
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
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://astrosfrontend.onrender.com/api/turnos/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/turnos");
    } catch {
      setError("Error al crear el turno. Verifica los datos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Crear Turno
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
              {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d) => (
                <option key={d} value={d}>{d}</option>
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

          {/* Botón Crear */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Crear Turno
          </button>
        </form>

        {/* Volver al Dashboard */}
        <div className="mt-4 text-center">
           {/* Botón para volver al dashboard */}
          
            <button
              onClick={() => navigate('/dashboard')}
              className="
              block         /* para que respete el margin auto */
              mx-auto       /* centra horizontalmente */
              w-full
              h-10
              mt-2
              py-2 px-4
              rounded-lg
              bg-green-600 hover:bg-green-700
              text-white font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              transition-colors duration-300
            "
            >
              Volver al Dashboard
            </button>
        </div>
        
      </div>
     
    </div>
  );
};

export default CrearTurno;
