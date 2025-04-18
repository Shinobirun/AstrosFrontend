import React, { useEffect, useState } from "react";
import axios from "axios";

const AsignarTurnos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [cargandoTurno, setCargandoTurno] = useState(null);
  const [confirmarOtro, setConfirmarOtro] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    obtenerUsuarios();
    obtenerTurnosDisponibles();
  }, []);

  const obtenerUsuarios = async () => {
    console.log("Obteniendo usuarios...");
    try {
      const res = await axios.get("http://localhost:5000/api/users/usuarios", { headers });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const obtenerTurnosDisponibles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/turnos/todos", { headers });
      setTurnos(res.data);
    } catch (err) {
      console.error("Error al obtener turnos", err);
    }
  };

  const obtenerCreditosUsuario = async (usuarioId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/creditos/usuario/${usuarioId}`, { headers });
      return res.data; // Suponiendo que la respuesta es un arreglo de créditos
    } catch (error) {
      console.error("Error al obtener créditos", error);
      return [];
    }
  };

  const eliminarCreditoMasAntiguo = async (usuarioId) => {
    try {
      const creditos = await obtenerCreditosUsuario(usuarioId);
      if (creditos.length > 0) {
        // Suponemos que el crédito más antiguo es el primero en el arreglo
        const creditoMasAntiguo = creditos[0];
        await axios.delete(`http://localhost:5000/api/creditos/${creditoMasAntiguo._id}`, { headers });
        console.log("Crédito eliminado", creditoMasAntiguo._id);
      }
    } catch (error) {
      console.error("Error al eliminar crédito", error);
    }
  };

  const asignarTurno = async (turnoId) => {
    setCargandoTurno(turnoId);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/turnos/asignar",
        {
          turnoId,
          userId: usuarioSeleccionado._id,
        },
        { headers }
      );
      setMensaje({ tipo: "exito", texto: res.data.message });

      // Llamar a la función para eliminar el crédito más antiguo
      await eliminarCreditoMasAntiguo(usuarioSeleccionado._id);

      setConfirmarOtro(true);
      obtenerTurnosDisponibles();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.response?.data?.message || "Error al asignar turno" });
    }
    setCargandoTurno(null);
  };

  const resetear = () => {
    setUsuarioSeleccionado(null);
    setTurnos([]);
    setMensaje(null);
    setConfirmarOtro(false);
  };

  const irAlDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asignar Turno</h1>

      {mensaje && (
        <div className={`p-2 mb-4 rounded ${mensaje.tipo === "exito" ? "bg-green-200" : "bg-red-200"}`}>
          {mensaje.texto}
        </div>
      )}

      {!usuarioSeleccionado && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Seleccioná un usuario:</h2>
          <ul className="space-y-2">
            {usuarios.map((user) => (
              <li key={user._id}>
                <button
                  onClick={() => {
                    setUsuarioSeleccionado(user);
                    obtenerTurnosDisponibles();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {user.firstName} {user.lastName} ({user.username})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {usuarioSeleccionado && !confirmarOtro && (
        <>
          <h2 className="text-lg font-semibold mb-2">
            Turnos disponibles para: {usuarioSeleccionado.firstName} {usuarioSeleccionado.lastName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {turnos.map((turno) => (
              <div key={turno._id} className="border p-4 rounded shadow-md">
                <p><strong>Sede:</strong> {turno.sede}</p>
                <p><strong>Nivel:</strong> {turno.nivel}</p>
                <p><strong>Día:</strong> {turno.dia}</p>
                <p><strong>Hora:</strong> {turno.hora}</p>
                <p><strong>Cupos disponibles:</strong> {turno.cuposDisponibles - turno.ocupadoPor.length}</p>
                <button
                  onClick={() => asignarTurno(turno._id)}
                  disabled={cargandoTurno === turno._id}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
                >
                  {cargandoTurno === turno._id ? "Asignando..." : "Asignar Turno"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {confirmarOtro && (
        <div className="mt-6">
          <p className="mb-4">¿Querés asignar otro turno?</p>
          <button
            onClick={resetear}
            className="mr-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Sí, asignar otro
          </button>
          <button
            onClick={irAlDashboard}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            No, volver al Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default AsignarTurnos;
