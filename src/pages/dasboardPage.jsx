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
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Dashboard</h2>
        {user ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Bienvenido, {user.firstName} {user.lastName}!
            </p>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Rol: {user.role}</p>

            <div className="mt-6 space-y-4">
              {/* Si el usuario es administrador o profesor */}
              {["Admin", "Profesor"].includes(user.role) && (
                <>
                  <button
                    onClick={() => navigate("/turnos")}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    Ver todos los turnos
                  </button>
                  <button
                    onClick={() => navigate("/usuarios")}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    Ver todos los usuarios
                  </button>
                  <button
                    onClick={() => navigate("/crearTurno")}
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Crear Turno
                  </button>
                  <button
                    onClick={() => navigate("/eliminarTurno")}
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    Eliminar Turno
                  </button>
                  <button
                    onClick={() => navigate("/crear-credito")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Crear Crédito
                  </button>

                  {/* Botón para asignar turnos Mensuales*/}
                  <button
                    onClick={() => {
                      navigate("/asignarTurno");
                      console.log("Navegando a asignar turno");
                    }}
                    className="w-full bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    Asignar Turno Mensual
                  </button>
                
                  {/* Botón para asignar turnos semanales */}
                  <button
                  onClick={() => {
                    navigate("/asignarTurSemanal");
                    console.log("Navegando a asignar turno");
                  }}
                  className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  Asignar Turno Semanal
                </button>
            </>
              )}

              {/* Si el usuario es Avanzado, Intermedio o Principiante */}
              {["Violeta", "Azul", "Principiante"].includes(user.role) && (
                <button
                  onClick={() => navigate(`/turnos-disponibles/${user.role}`)}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  Turnos disponibles
                </button>
              )}

              {/* Editar Usuario - Disponible para todos los usuarios */}
              <button
                onClick={() => navigate("/editarUsuarios")}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Editar Usuario
              </button>

              {/* Botón para cerrar sesión */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
