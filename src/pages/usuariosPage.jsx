import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [creditCounts, setCreditCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuariosYCreditos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.error("No hay token disponible.");

        // 1) Traer usuarios
        const resUsers = await axios.get(
          "http://localhost:5000/api/users/usuarios",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsuarios(resUsers.data);

        // 2) Por cada usuario, traer sus créditos
        const promCreds = resUsers.data.map((u) =>
          axios
            .get(`http://localhost:5000/api/creditos/usuario/${u._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => ({ userId: u._id, count: r.data.length }))
            .catch(() => ({ userId: u._id, count: 0 }))
        );
        const resultados = await Promise.all(promCreds);

        // 3) Agrupar en un objeto { [userId]: count }
        const counts = {};
        resultados.forEach(({ userId, count }) => {
          counts[userId] = count;
        });
        setCreditCounts(counts);
      } catch (error) {
        console.error("Error al obtener datos:", error.response?.data || error.message);
      }
    };

    fetchUsuariosYCreditos();
  }, []);

  // Ahora navegamos a rutas separadas:
  const verTurnosMensuales = (userId) => {
    navigate(`/turnosMensuales/${userId}`);
  };
  const verTurnosSemanales = (userId) => {
    navigate(`/turnosSemanales/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Helmet>
        <title>Usuarios | Panel de Administración</title>
        <meta name="description" content="Listado de usuarios y acceso a sus turnos." />
      </Helmet>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Lista de Usuarios</h2>
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
                    {index + 1}. {user.firstName} {user.lastName}
                  </span>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm font-medium text-gray-800">Nivel: {user.role}</p>
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
                    Créditos: <strong>{creditCounts[user._id] || 0}</strong>
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => verTurnosMensuales(user._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                  >
                    Turnos Mensuales
                  </button>
                  <button
                    onClick={() => verTurnosSemanales(user._id)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                  >
                    Turnos Semanales
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
