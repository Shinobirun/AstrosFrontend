import React, { useEffect, useState } from "react";
import axios from "axios";

const PerfilPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-lg bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Perfil de Usuario</h2>
        {user ? (
          <div className="text-center">
            <p className="text-lg font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Nivel: {user.role}</p>
            <p className="text-lg font-bold text-green-700 mt-2">Créditos: {user.creditos ?? 0}</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default PerfilPage;
