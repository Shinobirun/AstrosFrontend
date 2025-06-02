import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AsignarTurnos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [cargandoTurno, setCargandoTurno] = useState(null);
  const [confirmarOtro, setConfirmarOtro] = useState(false);
  const [diaFiltro, setDiaFiltro] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");
  const [asignando, setAsignando] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    obtenerUsuarios();
    obtenerTurnosDisponibles();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("https://astrosfrontend.onrender.com/api/users/usuarios", { headers });
      const ordenados = res.data.sort((a, b) => {
        const nombreA = (a.firstName + a.lastName).toLowerCase();
        const nombreB = (b.firstName + b.lastName).toLowerCase();
        return nombreA.localeCompare(nombreB);
      });
      setUsuarios(ordenados);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const obtenerTurnosDisponibles = async (dia = "") => {
    try {
      const url = dia
        ? `https://astrosfrontend.onrender.com/api/turnos/todos?dia=${encodeURIComponent(dia)}`
        : "https://astrosfrontend.onrender.com/api/turnos/todos";
      const res = await axios.get(url, { headers });

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const filtrados = res.data.filter((t) => {
        const fechaTurno = new Date(t.fecha);
        fechaTurno.setHours(0, 0, 0, 0);
        return fechaTurno >= hoy;
      });

      const ordenados = filtrados.sort((a, b) => {
        const fechaA = new Date(a.fecha);
        const fechaB = new Date(b.fecha);

        if (fechaA.getTime() !== fechaB.getTime()) {
          return fechaA - fechaB;
        }

        const [horaA, minA] = a.hora.split(":").map(Number);
        const [horaB, minB] = b.hora.split(":").map(Number);

        if (horaA !== horaB) return horaA - horaB;
        return minA - minB;
      });

      setTurnos(ordenados);
    } catch (err) {
      console.error("Error al obtener turnos", err);
    }
  };

  const asignarTurno = async (turnoId) => {
    if (asignando) return;
    setAsignando(true);
    setCargandoTurno(turnoId);
    try {
      const res = await axios.post(
        "https://astrosfrontend.onrender.com/api/turnos/asignar",
        { turnoId, userId: usuarioSeleccionado._id },
        { headers }
      );
      setMensaje({ tipo: "exito", texto: res.data.message });
      setConfirmarOtro(true);
      obtenerTurnosDisponibles(diaFiltro);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al asignar turno",
      });
    } finally {
      setCargandoTurno(null);
      setAsignando(false);
    }
  };

  const resetear = () => {
    setUsuarioSeleccionado(null);
    setTurnos([]);
    setMensaje(null);
    setConfirmarOtro(false);
    setDiaFiltro("");
  };

  const usuariosFiltrados = rolFiltro === "Todos"
    ? usuarios
    : usuarios.filter((u) => u.rol === rolFiltro);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <img src="/Astros.png" alt="Astros" className="h-24" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Asignar Turno</h1>

        {mensaje && (
          <div className={`p-2 mb-4 rounded ${mensaje.tipo === "exito" ? "bg-green-200" : "bg-red-200"}`}>
            {mensaje.texto}
          </div>
        )}

        {!usuarioSeleccionado && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-center">Seleccioná un usuario:</h2>

            <div className="flex justify-center mb-4">
              <select
                value={rolFiltro}
                onChange={(e) => setRolFiltro(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="Todos">Todos</option>
                <option value="Admin">Admin</option>
                <option value="Profesor">Profesor</option>
                <option value="Violeta">Violeta</option>
                <option value="Azul">Azul</option>
                <option value="Blanco">Blanco</option>
              </select>
            </div>

            <ul className="space-y-2">
              {usuariosFiltrados.map((user) => (
                <li key={user._id} className="flex justify-center">
                  <button
                    onClick={() => {
                      setUsuarioSeleccionado(user);
                      obtenerTurnosDisponibles();
                    }}
                    className="w-64 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {user.firstName} {user.lastName} ({user.username})
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 text-blue-600 hover:underline block text-center"
            >
              ← Volver al Dashboard
            </button>
          </div>
        )}

        {usuarioSeleccionado && !confirmarOtro && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Turnos disponibles para:<br />
              <span className="font-bold">
                {usuarioSeleccionado.firstName} {usuarioSeleccionado.lastName}
              </span>
            </h2>

            {/* Selector de fecha */}
            <div className="mb-4 text-center">
              <label className="mr-2 font-medium">Filtrar por día:</label>
              <input
                type="date"
                value={diaFiltro}
                onChange={(e) => {
                  setDiaFiltro(e.target.value);
                  obtenerTurnosDisponibles(e.target.value);
                }}
                className="border p-2 rounded"
                min={new Date().toISOString().split("T")[0]}
                max={(() => {
                  const maxDate = new Date();
                  maxDate.setMonth(maxDate.getMonth() + 1);
                  return maxDate.toISOString().split("T")[0];
                })()}
              />
              {diaFiltro && (
                <button
                  className="ml-4 bg-gray-300 px-3 py-1 rounded"
                  onClick={() => {
                    setDiaFiltro("");
                    obtenerTurnosDisponibles();
                  }}
                >
                  Limpiar filtro
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {turnos.map((turno) => (
                <div
                  key={turno._id}
                  className="border p-4 rounded shadow-md bg-white flex flex-col justify-between"
                >
                  <div>
                    <p><strong>Fecha:</strong> {new Date(turno.fecha).toLocaleDateString()}</p>
                    <p><strong>Sede:</strong> {turno.sede}</p>
                    <p><strong>Nivel:</strong> {turno.nivel}</p>
                    <p><strong>Día:</strong> {turno.dia}</p>
                    <p><strong>Hora:</strong> {turno.hora}</p>
                    <p>
                      <strong>Cupos disp.:</strong> {turno.cuposDisponibles - turno.ocupadoPor.length}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => asignarTurno(turno._id)}
                      disabled={cargandoTurno === turno._id}
                      className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 rounded disabled:bg-gray-400"
                    >
                      {cargandoTurno === turno._id ? "Asignando..." : "Asignar Mensual"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {confirmarOtro && (
          <div className="mt-6 text-center">
            <p className="mb-4">¿Querés asignar otro turno?</p>
            <button
              onClick={resetear}
              className="mr-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Sí, asignar otro
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              No, volver al Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AsignarTurnos;
