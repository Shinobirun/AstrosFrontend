import React, { useEffect, useState } from 'react';
import { getAllUsers, deactivateUser } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Ajusta según cómo almacenes el token
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (err) {
        setError('Error al obtener los usuarios');
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Estado</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
            <th className="border border-gray-300 px-4 py-2">Créditos</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.first_name} {user.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {user.is_active ? 'Activo' : 'Inactivo'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.creditos && user.creditos.length > 0 ? (
                  <ul className="list-decimal pl-4">
                    {user.creditos.map((credito, index) => (
                      <li key={credito._id} className="text-sm">
                        <span className="font-semibold">Crédito {index + 1}:</span> <br />
                        <span className="text-gray-600">Creado:</span>{' '}
                        {new Date(credito.createdAt).toLocaleDateString()} <br />
                        <span className="text-gray-600">Vence:</span>{' '}
                        {new Date(credito.venceEn).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>Sin créditos</span>
                )}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDeactivate(user.id)}
                >
                  Desactivar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const handleDeactivate = async (userId) => {
  try {
    const token = localStorage.getItem('token'); // Ajusta según tu autenticación
    await deactivateUser(userId, token);
    alert('Usuario desactivado');
    window.location.reload();
  } catch (err) {
    alert('Error al desactivar el usuario');
  }
};

export default UserList;
