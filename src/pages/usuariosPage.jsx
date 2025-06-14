import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token disponible");

        const { data } = await axios.get(
          "https://astrosfrontend.onrender.com/api/users/usuarios",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Ordenar alfabéticamente por firstName, luego lastName
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

    fetchUsuarios();
  }, []);

  const verTurnosMensuales = (userId) => navigate(`/turnosMensuales/${userId}`);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Helmet>
        <title>Usuarios | Panel de Administración</title>
        <meta name="description" content="Listado de usuarios y acceso a sus turnos." />
      </Helmet>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Lista de Usuarios
      </h2>

      <div className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg">
        {usuarios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usuarios.map((user, index) => (
              <div
                key={user._id}
                className="p-3 rounded-md border bg-gray-50 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="font-semibold">
                    {index + 1}. {user.firstName} {user.lastName}{" "}
                    <span className="text-sm text-gray-600">({user.username})</span>
                  </span>
                  <p className="text-sm text-gray-600">Email: {user.email || "—"}</p>
                  <p className="text-sm text-gray-600">Teléfono: {user.telefono || "—"}</p>
                  <p className="text-sm font-medium text-gray-800">Rol: {user.role}</p>
                  <p className="text-sm text-gray-600">
                    Creado: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Últ. Modif.:{" "}
                    {user.updatedAt
                      ? new Date(user.updatedAt).toLocaleDateString()
                      : "No disponible"}
                  </p>
                  <p className="mt-2 text-sm">
                    Créditos: <strong>{user.creditos?.length || 0}</strong>
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => verTurnosMensuales(user._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                  >
                    Turnos Mensuales
                  </button>
                  <button
                    onClick={() => navigate(`/editarUsuarios/${user._id}`)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay usuarios registrados.</p>
        )}
      </div>

      {/* Volver al Dashboard */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="
            w-full max-w-xs
            py-2 px-4
            rounded-lg
            bg-green-600 hover:bg-green-700
            text-white font-medium text-center
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
            transition-colors duration-300
          "
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default UsuariosPage;
