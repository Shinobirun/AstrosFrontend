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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    obtenerUsuarios();
    obtenerTurnosDisponibles();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/usuarios", { headers });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const obtenerTurnosDisponibles = async (dia = "") => {
    try {
      const url = dia
        ? `http://localhost:5000/api/turnos/todos?dia=${encodeURIComponent(dia)}`
        : "http://localhost:5000/api/turnos/todos";
      const res = await axios.get(url, { headers });
      const dias = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
      const ordenados = res.data.sort((a, b) => {
        const i = dias.indexOf(a.dia), j = dias.indexOf(b.dia);
        if (i === j) return a.hora.localeCompare(b.hora);
        return i - j;
      });
      setTurnos(ordenados);
    } catch (err) {
      console.error("Error al obtener turnos", err);
    }
  };

  const obtenerCreditosUsuario = async (usuarioId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/creditos/usuario/${usuarioId}`,
        { headers }
      );
      return res.data;
    } catch {
      return [];
    }
  };

  const eliminarCreditoMasAntiguo = async (usuarioId) => {
    const creditos = await obtenerCreditosUsuario(usuarioId);
    if (creditos.length) {
      await axios.delete(
        `http://localhost:5000/api/creditos/${creditos[0]._id}`,
        { headers }
      );
    }
  };

  const asignarTurno = async (turnoId) => {
    setCargandoTurno(turnoId);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/turnos/asignar",
        { turnoId, userId: usuarioSeleccionado._id },
        { headers }
      );
      setMensaje({ tipo: "exito", texto: res.data.message });
      await eliminarCreditoMasAntiguo(usuarioSeleccionado._id);
      setConfirmarOtro(true);
      obtenerTurnosDisponibles(diaFiltro);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || "Error al asignar turno",
      });
    } finally {
      setCargandoTurno(null);
    }
  };

  const resetear = () => {
    setUsuarioSeleccionado(null);
    setTurnos([]);
    setMensaje(null);
    setConfirmarOtro(false);
    setDiaFiltro("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Astros.png" alt="Astros" className="h-24" />
        </div>

        

        <h1 className="text-2xl font-bold mb-4 text-center">Asignar Turno Mensual</h1>

        {mensaje && (
          <div
            className={`p-2 mb-4 rounded ${
              mensaje.tipo === "exito" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {!usuarioSeleccionado && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-center">
              Seleccioná un usuario:
            </h2>
            <ul className="space-y-2">
              {usuarios.map((user) => (
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
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Dashboard
            </button>
          </div>
        )}

        {usuarioSeleccionado && !confirmarOtro && (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Turnos disponibles para:<br/>
              <span className="font-bold">
                {usuarioSeleccionado.firstName} {usuarioSeleccionado.lastName}
              </span>
            </h2>
            {/* Botón Dashboard */}
        
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {turnos.map((turno) => (
                <div
                  key={turno._id}
                  className="border p-4 rounded shadow-md bg-white flex flex-col justify-between"
                >
                  <div>
                    <p><strong>Sede:</strong> {turno.sede}</p>
                    <p><strong>Nivel:</strong> {turno.nivel}</p>
                    <p><strong>Día:</strong> {turno.dia}</p>
                    <p><strong>Hora:</strong> {turno.hora}</p>
                    <p>
                      <strong>Cupos disp.:</strong>{" "}
                      {turno.cuposDisponibles - turno.ocupadoPor.length}
                    </p>
                  </div>
                  <button
                    onClick={() => asignarTurno(turno._id)}
                    disabled={cargandoTurno === turno._id}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded disabled:bg-gray-400"
                  >
                    {cargandoTurno === turno._id
                      ? "Asignando..."
                      : "Asignar Turno"}
                  </button>
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
