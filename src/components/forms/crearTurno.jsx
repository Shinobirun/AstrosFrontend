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
    fecha: "",
    cuposDisponibles: 10,
    repetirDosMeses: false,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : name === "cuposDisponibles"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Si se modifica la fecha, actualiza el campo "dia"
    if (name === "fecha") {
      const localDate = new Date(value + "T00:00:00");
      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const diaSemana = dias[localDate.getDay()];
      setFormData((prev) => ({
        ...prev,
        dia: diaSemana,
      }));
    }
  };

  const generarFechas = (fechaInicial, repetir) => {
    const fechas = [];
    const fecha = new Date(fechaInicial);
    if (!repetir) {
      fechas.push(new Date(fecha));
    } else {
      for (let i = 0; i < 8; i++) {
        fechas.push(new Date(fecha));
        fecha.setDate(fecha.getDate() + 7);
      }
    }
    return fechas;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.fecha || !formData.hora) {
    setError("La fecha y hora son obligatorias.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const fechaISO = new Date(formData.fecha).toISOString();

    const nuevoTurno = {
      sede: formData.sede,
      nivel: formData.nivel,
      hora: formData.hora,
      fecha: fechaISO,
      cuposDisponibles: formData.cuposDisponibles,
      repetirDosMeses: formData.repetirDosMeses || false,
    };

    const response = await axios.post(
      "https://astrosfrontend.onrender.com/api/turnos",
      nuevoTurno,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(response.data);
    navigate("/turnos");
  } catch (err) {
    setError("Error al crear el turno. Verifica los datos.");
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

          {/* Día (solo lectura, se actualiza automáticamente) */}
          <label className="block">
            <span className="text-gray-700">Día:</span>
            <input
              type="text"
              name="dia"
              value={formData.dia}
              readOnly
              className="block w-full mt-1 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </label>

          {/* Fecha */}
          <label className="block">
            <span className="text-gray-700">Fecha del primer turno:</span>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="block w-full mt-1 border-gray-300 rounded-md"
            />
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

          {/* Repetir */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="repetirDosMeses"
              checked={formData.repetirDosMeses}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-gray-700">Repetir este turno cada semana por 2 meses</span>
          </label>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Crear Turno
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

export default CrearTurno;
