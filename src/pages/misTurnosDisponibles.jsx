// src/pages/TurnosSemanalesDisponibles.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MisTurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

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
        {}, // body vacío, el userId lo saca del token
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMensaje('Turno tomado con éxito');
      fetchTurnos(); // refrescar lista
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setMensaje(err.response.data.message);
      } else {
        setMensaje('Error al tomar el turno');
      }
    }
  };

  if (loading) return <p>Cargando turnos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Turnos Disponibles</h2>

      {mensaje && <div className="mb-4 text-blue-700">{mensaje}</div>}

      {turnos.length === 0 ? (
        <p>No hay turnos disponibles</p>
      ) : (
        <ul className="space-y-2">
          {turnos.map((turno) => (
            <li key={turno._id} className="p-4 border rounded shadow">
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
  );
};

export default MisTurnosDisponibles;
