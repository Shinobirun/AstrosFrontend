import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [turnos, setTurnos] = useState([]);
  const [creditos, setCreditos] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error.response?.data || error.message);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    const fetchTurnos = async () => {
      if (!selectedUser) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/users/usuario/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTurnos(response.data);
      } catch (error) {
        console.error("Error al obtener los turnos:", error.response?.data || error.message);
      }
    };

    const fetchCreditos = async () => {
      if (!selectedUser) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token disponible.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/creditos/usuario/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCreditos(response.data);
      } catch (error) {
        console.error("Error al obtener los créditos:", error.response?.data || error.message);
      }
    };

    fetchTurnos();
    fetchCreditos();
  }, [selectedUser]);

  const liberarTurno = async (turnoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/turnos/liberar`,
        { turnoId, userId: selectedUser._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTurnos((prevTurnos) =>
        prevTurnos.map((turno) =>
          turno._id === turnoId
            ? { ...turno, ocupadoPor: turno.ocupadoPor.filter((uid) => uid !== selectedUser._id) }
            : turno
        )
      );

      console.log("Turno liberado correctamente");

      const creditoResponse = await axios.post(
        `http://localhost:5000/api/creditos`,
        { usuario: selectedUser._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Crédito creado:", creditoResponse.data);
  
      // 4. Actualizar créditos en frontend
      setCreditos((prevCreditos) => [...prevCreditos, creditoResponse.data.credito]);
  
    } catch (error) {
      console.error("Error al liberar el turno:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* METADATOS DE LA PÁGINA */}
      <Helmet>
        <title>Usuarios | Panel de Administración</title>
        <meta name="description" content="Listado de usuarios registrados, turnos asignados y créditos disponibles." />
      </Helmet>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Lista de Usuarios</h2>
      <div className="max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg">
        {usuarios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usuarios.map((user, index) => (
              <div
                key={user._id}
                className={`cursor-pointer p-3 rounded-md border shadow-sm ${
                  selectedUser?._id === user._id ? "bg-blue-200 border-blue-500" : "bg-gray-50"
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <span className="font-semibold">
                  {index + 1}. {user.firstName} {user.lastName}
                </span>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm font-medium text-gray-800">Nivel: {user.role}</p>
                <p className="text-sm text-gray-600">Creado: {new Date(user.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">
                  Última Modificación: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "No disponible"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No hay usuarios registrados.</p>
        )}
      </div>

      {selectedUser && (
        <>
          <div className="mt-6 max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Turnos Asignados</h3>
            {turnos.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {turnos.filter((turno) => turno.activo).map((turno, index) => (
                  <li key={index} className="p-3 rounded-md border bg-gray-50 shadow-sm">
                    <p className="font-semibold">
                      {turno.sede} - {turno.nivel}
                    </p>
                    <p className="text-sm text-gray-600">Día: {turno.dia}</p>
                    <p className="text-sm text-gray-600">Hora: {turno.hora}</p>
                    <p className="text-sm text-gray-600">Cupos Disponibles: {turno.cuposDisponibles}</p>
                    <button className="mt-2 text-red-600" onClick={() => liberarTurno(turno._id)}>
                      Liberar Turno
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-600">No hay turnos activos asignados.</p>
            )}
          </div>

          <div className="mt-6 max-w-4xl mx-auto bg-white p-4 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800">Créditos del Usuario</h3>
            {creditos.length > 0 ? (
              <table className="w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Crédito</th>
                    <th className="border p-2">Fecha de Vencimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {creditos.map((credito, index) => (
                    <tr key={credito._id} className="text-center">
                      <td className="border p-2">Crédito {index + 1}</td>
                      <td className="border p-2">{dayjs(credito.venceEn).format("DD/MM/YYYY")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No hay créditos disponibles.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UsuariosPage;
