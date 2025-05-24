import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "Blanco",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post("https://astrosfrontend.onrender.com/api/users/register", formData);
      setSuccessMessage("Usuario registrado con éxito");
      // NO redirigimos automáticamente
    } catch (err) {
      setError(err.response?.data.message || "Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Registro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su nombre de usuario"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirme su contraseña"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su nombre"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ingrese su apellido"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Blanco">Blanco</option>
              <option value="Azul">Azul</option>
              <option value="Violeta">Violeta</option>
              <option value="Profesor">Profesor</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm mt-2">{successMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </form>

        {/* Botón para volver al Dashboard */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
