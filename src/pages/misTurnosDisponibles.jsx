import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'https://astrosfrontend.onrender.com';

const MisTurnosDisponibles = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // 1) Cargar turnos según rol
  const fetchTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(
        `${API}/api/turnos/segunRol`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTurnos(data);
    } catch (err) {
      console.error('Error al cargar turnos:', err);
      setError('Error al cargar los turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  // 2) Tomar turno (incluye consumo de crédito en back)
  const tomarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/api/turnos/asignarAlumno`,
        { turnoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Turno tomado correctamente');
      setModalVisible(true);
      fetchTurnos();
    } catch (err) {
      console.error('Error al tomar turno:', err.response || err);
      const msg = err.response?.data?.message || 'Error al tomar el turno';
      setMensaje(msg);
      setModalVisible(true);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando turnos...</p>;
  if (error)   return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4 relative">
      {/* Botón fijo en esquina superior izquierda */}
      <button
        onClick={() => navigate('/dashboard')}
        className="absolute top-4 left-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        ⬅ Volver al Dashboard
      </button>

      <div className="w-full max-w-2xl bg-white p-6 rounded shadow mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Turnos Disponibles
        </h2>

        {turnos.length === 0 ? (
          <p className="text-center">No hay turnos disponibles</p>
        ) : (
          <ul className="space-y-4">
            {turnos.map(turno => (
              <li
                key={turno._id}
                className="p-4 border rounded shadow bg-gray-50 text-center"
              >
                <p><strong>Sede:</strong> {turno.sede}</p>
                <p><strong>Nivel:</strong> {turno.nivel}</p>
                <p><strong>Día:</strong> {turno.dia}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(turno.fecha).toLocaleDateString('es-AR')}
                </p>
                <p>
                  <strong>Cupos disponibles:</strong>{' '}
                  {turno.cuposDisponibles - turno.ocupadoPor.length}
                </p>
                <button
                  onClick={() => tomarTurno(turno._id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Tomar Turno
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de mensaje */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <p className="mb-4 text-gray-800">{mensaje}</p>
            <button
              onClick={() => setModalVisible(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisTurnosDisponibles;
