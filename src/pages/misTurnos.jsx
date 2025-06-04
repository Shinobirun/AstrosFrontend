import { useEffect, useState } from 'react';
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
  parseISO
} from 'date-fns';
import es from 'date-fns/locale/es';

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Carga de turnos asignados
  const obtenerTurnos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');

      const res = await fetch('https://astrosfrontend.onrender.com/api/turnos/misTurnos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const text = await res.text();
      if (!res.ok) {
        console.error('Respuesta del servidor:', text);
        throw new Error(`Error ${res.status}: ${text}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('No se pudo parsear como JSON:', text);
        throw new Error('La respuesta del servidor no es JSON válido.');
      }

      // Convertir fechas a objetos Date
      setTurnos(data.map((t) => ({ ...t, fecha: parseISO(t.fecha) })));
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
      setMensaje('No se pudieron cargar los turnos.');
    } finally {
      setLoading(false);
    }
  };

  // Liberar un turno
  const liberarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token disponible');

      const res = await fetch('https://astrosfrontend.onrender.com/api/turnos/liberar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ turnoId }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('La respuesta del servidor no es JSON válido.');
      }

      if (res.ok) {
        setTurnos((prev) => prev.filter((t) => t._id !== turnoId));
        setMensaje('Turno liberado correctamente.');
      } else {
        setMensaje(data.message || 'Error al liberar el turno.');
      }
    } catch (error) {
      console.error('Error liberando turno:', error);
      setMensaje('Error del servidor al liberar turno.');
    }
  };

  useEffect(() => {
    obtenerTurnos();
  }, []);

  // Navegación del calendario
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Render de encabezado del calendario
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2">
      <button
        onClick={prevMonth}
        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
      >
        ← Mes anterior
      </button>
      <span className="text-lg font-semibold">
        {format(currentMonth, 'MMMM yyyy', { locale: es })}
      </span>
      <button
        onClick={nextMonth}
        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
      >
        Mes siguiente →
      </button>
    </div>
  );

  // Render de la cabecera de días de la semana
  const renderDays = () => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return (
      <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-700 mb-1">
        {days.map((day) => (
          <div key={day} className="p-1 border">
            {day}
          </div>
        ))}
      </div>
    );
  };

  // Render de las celdas del calendario, ocultando turnos previos al día actual
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const week = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(cloneDay, 'd');

        // Determinar si es día anterior a “hoy”
        const dayStart = new Date(cloneDay);
        dayStart.setHours(0, 0, 0, 0);
        const isBeforeToday = dayStart < today;

        // Filtrar turnos de ese día (solo si no es anterior a hoy)
        const turnosDelDia = isBeforeToday
          ? []
          : turnos.filter((t) => isSameDay(cloneDay, t.fecha));

        week.push(
          <div
            key={cloneDay.toString()}
            className={`
              border p-1 h-24 text-xs overflow-y-auto cursor-default ${
              !isSameMonth(cloneDay, currentMonth)
                ? 'bg-gray-100 text-gray-400'
                : isBeforeToday
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-white text-black'
            } ${isSameDay(cloneDay, today) ? 'border-2 border-green-600' : ''}
            `}
          >
            <div className={`font-bold mb-1 ${isBeforeToday ? 'text-gray-400' : ''}`}>
              {formattedDate}
            </div>
            {turnosDelDia.map((turno, idx) => (
              <div
                key={idx}
                className="bg-blue-100 text-xs rounded px-1 mb-0.5 truncate"
                title={`${turno.hora} - ${turno.nivel} - ${turno.sede}`}
              >
                {turno.hora}
              </div>
            ))}
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-px" key={day.toString()}>
          {week}
        </div>
      );
    }

    return <div>{rows}</div>;
  };

  if (loading) return <div className="p-4">Cargando turnos…</div>;

  return (
    <div className="p-4">
      {mensaje && <p className="mb-4 text-red-600">{mensaje}</p>}

      {turnos.length === 0 ? (
        <p>No tenés turnos asignados.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {turnos.map((turno) => (
            <li
              key={turno._id}
              className="border rounded-lg p-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p><strong>Sede:</strong> {turno.sede}</p>
                <p><strong>Nivel:</strong> {turno.nivel}</p>
                <p><strong>Día:</strong> {turno.dia}</p>
                <p><strong>Fecha:</strong> {format(turno.fecha, 'dd/MM/yyyy')}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
              </div>
              <button
                onClick={() => liberarTurno(turno._id)}
                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Liberar
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Calendario: solo desde hoy en adelante */}
      <div className="bg-white p-4 rounded-lg shadow">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default MisTurnos;
