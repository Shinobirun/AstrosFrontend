import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MisTurnos() {
  const [turnosSemanales, setTurnosSemanales] = useState([]);
  const [turnosMensuales, setTurnosMensuales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('semanal');

  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('https://astrosfrontend.onrender.com/api/turnosSemanales/misTurnos', config);
        setTurnosSemanales(data.turnosSemanales || []);
        setTurnosMensuales(data.turnosMensuales || []);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los turnos');
        setLoading(false);
      }
    };
    fetchTurnos();
  }, []);

  const ordenarTurnos = (turnos) => {
    return [...turnos].sort((a, b) => {
      const diaA = diasOrden.indexOf(a.dia);
      const diaB = diasOrden.indexOf(b.dia);

      if (diaA !== diaB) return diaA - diaB;

      const [horaA, minA] = a.hora.split(':').map(Number);
      const [horaB, minB] = b.hora.split(':').map(Number);

      return horaA !== horaB ? horaA - horaB : minA - minB;
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Cargando turnos...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );

  const turnosAMostrar = filtro === 'semanal' ? turnosSemanales : turnosMensuales;
  const turnosOrdenados = ordenarTurnos(turnosAMostrar);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Mis Turnos {filtro === 'semanal' ? 'Semanales' : 'Mensuales'}</h2>

      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFiltro('semanal')}
          disabled={filtro === 'semanal'}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none
            ${filtro === 'semanal'
              ? 'bg-blue-600 text-white cursor-default shadow-lg'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'}`}
        >
          Semanales
        </button>
        <button
          onClick={() => setFiltro('mensual')}
          disabled={filtro === 'mensual'}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none
            ${filtro === 'mensual'
              ? 'bg-blue-600 text-white cursor-default shadow-lg'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'}`}
        >
          Mensuales
        </button>
      </div>

      {turnosOrdenados.length === 0 ? (
        <p className="text-gray-500 text-lg">No tenés turnos {filtro} asignados.</p>
      ) : (
        <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
          {turnosOrdenados.map((turno) => (
            <li key={turno._id || turno.id} className="border-b border-gray-200 pb-3 last:border-0">
              <p className="font-medium text-gray-800">{turno.fecha} - {turno.hora}</p>
              <p className="text-gray-600">{turno.descripcion}</p>
              <p className="text-gray-600"><span className="font-semibold">Sede:</span> {turno.sede}</p>
              <p className="text-gray-600"><span className="font-semibold">Día:</span> {turno.dia}</p>
              <p className="text-gray-600"><span className="font-semibold">Cupos:</span> {turno.cupos}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisTurnos;
