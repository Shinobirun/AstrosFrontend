import React, { useEffect, useState } from 'react';
import axios from 'axios';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function PlantillaTurnoUsuarioPage() {
  const [plantillas, setPlantillas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [form, setForm] = useState({ usuario: '', dia: '', hora: '', sede: '', nivel: '' });

  const fetchPlantillas = async () => {
    try {
      const res = await axios.get('/api/plantilla-turnos-usuario');
      setPlantillas(res.data);
    } catch (error) {
      console.error("Error al obtener plantillas", error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token disponible");

      const { data } = await axios.get(
        "https://astrosfrontend.onrender.com/api/users/usuarios",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Ordenar por nombre completo
      const ordenados = data.sort((a, b) => {
        const nombreA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nombreB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nombreA.localeCompare(nombreB);
      });

      setUsuarios(ordenados);
    } catch (err) {
      console.error("Error al obtener usuarios:", err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await axios.post('/api/plantilla-turnos-usuario', form);
      await fetchPlantillas();
    } catch (error) {
      console.error("Error al crear plantilla", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/plantilla-turnos-usuario/${id}`);
      await fetchPlantillas();
    } catch (error) {
      console.error("Error al eliminar plantilla", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPlantillas();
  }, []);

  const plantillasFiltradas = plantillas.filter(p =>
    p.activo && (filtroUsuario === '' || p.usuario?._id === filtroUsuario || p.usuario === filtroUsuario)
  );

  return (
    <div className="p-4 space-y-6">
      {/* CREAR */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Crear Turno Semanal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            name="usuario"
            value={form.usuario}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar usuario</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName} ({u.username})
              </option>
            ))}
          </select>
          <select
            name="dia"
            value={form.dia}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Día</option>
            {diasSemana.map((dia) => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
          <input
            name="hora"
            placeholder="HH:mm"
            value={form.hora}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="sede"
            placeholder="Sede"
            value={form.sede}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="nivel"
            placeholder="Nivel"
            value={form.nivel}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCreate}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </div>

      {/* FILTRO + LISTADO */}
      <div className="bg-white shadow rounded p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Turnos Semanales Activos</h2>
          <select
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="border p-2 rounded mt-2 md:mt-0"
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName} ({u.username})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {plantillasFiltradas.map((plantilla) => (
            <div
              key={plantilla._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p><strong>{plantilla.dia}</strong> - {plantilla.hora} - {plantilla.sede} - {plantilla.nivel}</p>
                <p className="text-sm text-gray-500">
                  Usuario: {plantilla.usuario?.firstName} {plantilla.usuario?.lastName} ({plantilla.usuario?.username || plantilla.usuario})
                </p>
              </div>
              <button
                onClick={() => handleDelete(plantilla._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
