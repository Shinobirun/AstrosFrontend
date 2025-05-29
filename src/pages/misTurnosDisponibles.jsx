// src/pages/TurnosSemanalesDisponibles.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MisTurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://astrosfrontend.onrender.com/api/turnosSemanales/disponibles',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTurnos(response.data);
    } catch (err) {
      setError('Error al cargar los turnos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  const tomarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://astrosfrontend.onrender.com/api/turnosSemanales/tomar/${turnoId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje('Turno tomado con éxito');
      fetchTurnos();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setMensaje(err.response.data.message);
      } else {
        setMensaje('Error al tomar el turno');
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando turnos...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Turnos Disponibles</h2>

        {mensaje && (
          <div className="mb-4 text-center text-blue-700 font-semibold">{mensaje}</div>
        )}

        {turnos.length === 0 ? (
          <p className="text-center">No hay turnos disponibles</p>
        ) : (
          <ul className="space-y-4">
  {turnos.map((turno) => (
    <li
      key={turno._id}
      className="p-4 border rounded shadow bg-gray-50 text-center"
    >
      <p><strong>Sede:</strong> {turno.sede}</p>
      <p><strong>Nivel:</strong> {turno.nivel}</p>
      <p><strong>Día:</strong> {turno.dia}</p>
      <p><strong>Hora:</strong> {turno.hora}</p>
      <p><strong>Cupos disponibles:</strong> {turno.cuposDisponibles - turno.ocupadoPor.length}</p>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => tomarTurno(turno._id)}
      >
        Tomar Turno
      </button>
    </li>
  ))}
</ul>
        )}
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-8 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        ⬅ Volver al Dashboard
      </button>
    </div>
  );
};

export default MisTurnosDisponibles;
