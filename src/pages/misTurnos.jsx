import React, { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  parseISO,
} from 'date-fns';
import es from 'date-fns/locale/es';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'https://astrosfrontend.onrender.com';

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  const obtenerTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');

      const res = await axios.get(
        `${API}/api/turnos/misTurnos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const turnosFiltrados = data
        .map((t) => ({ ...t, fecha: parseISO(t.fecha) }))
        .filter((t) => t.fecha >= hoy);

      setTurnos(turnosFiltrados);
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
      setMensaje('No se pudieron cargar los turnos.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const liberarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');

      const res = await axios.put(
        `${API}/api/turnos/liberar`,
        { turnoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTurnos((prev) => prev.filter((t) => t._id !== turnoId));
      setMensaje('Turno liberado correctamente.');
      setModalVisible(true);
    } catch (error) {
      console.error('Error liberando turno:', error);
      setMensaje(error.response?.data?.message || 'Error al liberar el turno.');
      setModalVisible(true);
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <button onClick={prevMonth} className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">← Mes anterior</button>
      <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy', { locale: es })}</span>
      <button onClick={nextMonth} className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">Mes siguiente →</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return (
      <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-700 mb-1">
        {days.map((day) => (<div key={day} className="p-1 border">{day}</div>))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const rows = [];
    let day = startDate;
    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'd');
        const isBeforeToday = cloneDay < today;
        const turnosDelDia = isBeforeToday ? [] : turnos.filter((t) => isSameDay(cloneDay, t.fecha));

        week.push(
          <div key={cloneDay} className={`border p-1 h-24 text-xs overflow-y-auto cursor-default ${!isSameMonth(cloneDay, currentMonth) || isBeforeToday ? 'bg-gray-100 text-gray-400' : 'bg-white text-black'} ${isSameDay(cloneDay, today) ? 'border-2 border-green-600' : ''}`}>
            <div className="font-bold mb-1">{formattedDate}</div>
            {turnosDelDia.map((turno, idx) => (
              <div key={idx} className="bg-blue-100 text-xs rounded px-1 mb-0.5 truncate" title={`${turno.hora} - ${turno.nivel} - ${turno.sede}`}>
                {turno.hora}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="grid grid-cols-7 gap-px">{week}</div>);
    }
    return <div>{rows}</div>;
  };

  if (loading) return <div className="p-4">Cargando turnos…</div>;

  return (
    <div className="p-4">
      {/* Botón Volver Dashboard */}
      <button onClick={() => navigate('/dashboard')} className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        ⬅ Volver al Dashboard
      </button>

      {/* Modal de Mensaje */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <p className="mb-4 text-gray-800">{mensaje}</p>
            <button onClick={() => setModalVisible(false)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Turnos Asignados */}
      {turnos.length === 0 ? (
        <p>No tenés turnos asignados.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {turnos.map((turno) => (
            <li key={turno._id} className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center">
              <div>
                <p><strong>Sede:</strong> {turno.sede}</p>
                <p><strong>Nivel:</strong> {turno.nivel}</p>
                <p><strong>Día:</strong> {turno.dia}</p>
                <p><strong>Fecha:</strong> {format(turno.fecha, 'dd/MM/yyyy')}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
              </div>
              <button onClick={() => liberarTurno(turno._id)} className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Liberar
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Calendario */}
      <div className="bg-white p-4 rounded-lg shadow">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default MisTurnos;
