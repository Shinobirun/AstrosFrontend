import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.get("https://astrosfrontend.onrender.com/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch {
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

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800"></h2>

        <div className="text-center space-y-2 mb-6">
          <p className="text-lg font-semibold text-gray-800">
            Bienvenido, {user.firstName} {user.lastName}!
          </p>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Rol: {user.role}</p>
        </div>

        <div className="space-y-3">
          {isAdminOrProf && (
            <>
              {/* Gestión de usuarios */}
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
             

              {/* Gestión de turnos */}
              <button
                onClick={() => navigate("/crearTurno")}
                className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300`}
              >
                Crear Turno
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

              {/* Créditos */}
              <button
                onClick={() => navigate("/crear-credito")}
                className={`${btnBase} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300`}
              >
                Crear Crédito
              </button>

              {/* Asignar turnos */}
              <button
                onClick={() => navigate("/asignarTurno")}
                className={`${btnBase} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300`}
              >
                Asignar Turno Mensual
              </button>
              <button
                onClick={() => navigate("/asignarTurSemanal")}
                className={`${btnBase} bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-300`}
              >
                Asignar Turno Semanal
              </button>
            </>
          )}

          {isStudent && (
  <>
          <button
            onClick={() => navigate(`/turnos-Disponibles/${user.role}`)}
            className={`${btnBase} bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-300`}
          >
            Mis Turnos
          </button>

          <button
            onClick={() => navigate('/turnosSemanales')}
            className={`${btnBase} bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-red-300`}
          >
            Turnos disponibles
          </button>
        </>
      )}

          
          
          {/* Cerrar sesión */}
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
