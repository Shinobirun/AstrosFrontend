import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [creditos, setCreditos] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        // Obtener perfil del usuario
        const { data } = await axios.get("https://astrosfrontend.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);

        // Obtener créditos del usuario por ID
        const resCreds = await axios.get(
          `https://astrosfrontend.onrender.com/api/creditos/usuario/${data._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const cantidad = Array.isArray(resCreds.data) ? resCreds.data.length : 0;
        setCreditos(cantidad);
        console.log(`Créditos reales para ${data.username}:`, cantidad);
      } catch (err) {
        console.error("Error al obtener datos:", err.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const isAdminOrProf = ["Admin", "Profesor"].includes(user.role);
  const isStudent = ["Violeta", "Azul", "Principiante"].includes(user.role);
  const btnBase = "w-full py-2 px-4 rounded focus:outline-none focus:ring-2 font-medium";

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>

        <div className="text-center space-y-2 mb-6">
          <p className="text-lg font-semibold text-gray-800">
            Bienvenido, {user.firstName} {user.lastName}!
          </p>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Rol: {user.role}</p>
          <p className="text-gray-600">
            Créditos: <strong>{creditos !== null ? creditos : "Cargando..."}</strong>
          </p>
        </div>

        <div className="space-y-3">
          {isAdminOrProf && (
            <>
              <button
                onClick={() => navigate("/register")}
                className={`${btnBase} bg-green-600 hover:bg-green-700 text-white focus:ring-green-300`}
              >
                Crear Usuario
              </button>
              <button
                onClick={() => navigate("/usuarios")}
                className={`${btnBase} bg-green-600 hover:bg-green-700 text-white focus:ring-green-300`}
              >
                Ver todos los usuarios
              </button>
              <button
                onClick={() => navigate("/crearTurno")}
                className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`}
              >
                Crear Turno único
              </button>
              <button
                onClick={() => navigate("/crearTurnoMensual")}
                className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`}
              >
                Crear Turno Mensual
              </button>
              <button
                onClick={() => navigate("/eliminarTurno")}
                className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`}
              >
                Eliminar Turno
              </button>
              <button
                onClick={() => navigate("/turnos")}
                className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`}
              >
                Ver todos los turnos
              </button>
              <button
                onClick={() => navigate("/crear-credito")}
                className={`${btnBase} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300`}
              >
                Crear Crédito
              </button>
              <button
                onClick={() => navigate("/asignarTurno")}
                className={`${btnBase} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300`}
              >
                Asignar Turno Individual
              </button>
              <button
                onClick={() => navigate("/asignarTurnoMensual")}
                className={`${btnBase} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300`}
              >
                Asignar turno mensual
              </button>
            </>
          )}

          {isStudent && (
            <> 
              <button
                onClick={() => navigate(`/misTurnos/`)}
                className={`${btnBase} bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-300`}
              >
                Mis Turnos
              </button>
              <button
                onClick={() => navigate("/misTurnosDisponibles")}
                className={`${btnBase} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-red-300`}
              >
                Turnos disponibles
              </button>
            </>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className={`${btnBase} bg-red-600 hover:bg-red-700 text-white focus:ring-red-300`}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;