import axios from 'axios';

// Crear una instancia de axios con la URL base
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener todos los usuarios
export const getAllUsers = async () => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de la solicitud
    },
  };

  const { data } = await API.get('/users', config);
  return data;
};

// Función para desactivar un usuario
export const deactivateUser = async (userId) => {
  const token = localStorage.getItem('token'); // Obtener el token del localStorage

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de la solicitud
    },
  };

  const { data } = await API.put(`/users/${userId}/deactivate`, {}, config);
  return data;
};

export default { getAllUsers, deactivateUser };
