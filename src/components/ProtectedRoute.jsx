import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Componente para proteger las rutas
const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token'); // Verifica si el token está en el localStorage

  // Si hay un token, permite el acceso, de lo contrario redirige a login
  return (
    <Route
      {...rest}
      element={token ? element : <Navigate to="/login" />}
    />
  );
};

export default ProtectedRoute;
