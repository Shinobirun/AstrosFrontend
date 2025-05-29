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
  

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get("https://astrosfrontend.onrender.com/api/users/usuarios", { headers });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const obtenerTurnosDisponibles = async () => {
    try {
      const res = await axios.get("https://astrosfrontend.onrender.com/api/turnosSemanales/todoSema", { headers });
      setTurnos(res.data);
    } catch (err) {
      console.error("Error al obtener turnos", err);
    }
  };

  const obtenerCreditosUsuario = async (usuarioId) => {
    try {
      const res = await axios.get(`https://astrosfrontend.onrender.com/api/creditos/usuario/${usuarioId}`, { headers });
      return res.data;
    } catch (error) {
      console.error("Error al obtener créditos", error);
      return [];
    }
  };

  const eliminarCreditoMasAntiguo = async (usuarioId) => {
    try {
      const creditos = await obtenerCreditosUsuario(usuarioId);
      if (creditos.length > 0) {
        const creditoMasAntiguo = creditos[0];
        await axios.delete(`https://astrosfrontend.onrender.com/api/creditos/${creditoMasAntiguo._id}`, { headers });
      }
    } catch (error) {
      console.error("Error al eliminar crédito", error);
    }
  };

  const asignarTurno = async (turnoId) => {
    setCargandoTurno(turnoId);
    try {
      const res = await axios.post(
        "https://astrosfrontend.onrender.com/api/turnosSemanales/asignarSema",
        {
          turnoId,
          userId: usuarioSeleccionado._id,
        },
        { headers }
      );
      setMensaje({ tipo: "exito", texto: res.data.message });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Astros.png" alt="Astros" className="h-24" />
        </div>



    
      <h1 className="text-2xl font-bold mb-4 text-center">Asignar Turno Semanal</h1>

      {mensaje && (
        <div className={`p-2 mb-4 rounded ${mensaje.tipo === "exito" ? "bg-green-200" : "bg-red-200"}`}>
          {mensaje.texto}
        </div>
      )}

      {!usuarioSeleccionado && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-center">Seleccioná un usuario:</h2>
          <ul className="space-y-4">
  {usuarios.map((user) => (
    <li key={user._id} className="flex justify-center">
      <button
        onClick={() => {
          setUsuarioSeleccionado(user);
          obtenerTurnosDisponibles();
        }}
        className="
          w-48            /* ancho fijo para todos */
          text-center     /* centrado interno */
          bg-blue-500 hover:bg-blue-700
          text-white
          font-medium
          py-2
          rounded-lg
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300
        "
      >
        {user.firstName} {user.lastName}
        <br />
        <span className="text-sm">({user.username})</span>
      </button>
    </li>
  ))}
</ul>
          <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="
              block         /* para que respete el margin auto */
              mx-auto       /* centra horizontalmente */
              h-10
              mt-2
              py-2 px-4
              rounded-lg
              bg-green-600 hover:bg-green-700
              text-white font-medium
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              transition-colors duration-300"
            >
              ← Volver al Dashboard
            </button>
        </div>
      )}

      {usuarioSeleccionado && !confirmarOtro && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-center">
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
           <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 text-blue-600 hover:underline"
            >
              ← Dashboard
            </button>
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
    </div>
  );
};

export default AsignarTurnos;

