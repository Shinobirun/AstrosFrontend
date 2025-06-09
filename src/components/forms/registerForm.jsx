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
    telefono: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordIsValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!passwordIsValid(formData.password)) {
      setShowPasswordRules(true);
      return;
    }

    try {
      await axios.post("https://astrosfrontend.onrender.com/api/users/register", formData);
      setSuccessMessage("Usuario registrado con éxito");
    } catch (err) {
      setError(err.response?.data.message || "Error al registrar el usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 relative">
        {/* Modal */}
        {showPasswordRules && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-bold mb-2">Requisitos de la contraseña</h3>
              <ul className="text-sm list-disc list-inside text-gray-700 mb-4">
                <li>Mínimo 8 caracteres</li>
                <li>Una mayúscula</li>
                <li>Una minúscula</li>
                <li>Un número</li>
                <li>Un símbolo (ej: !, @, #, etc.)</li>
              </ul>
              <button
                onClick={() => setShowPasswordRules(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Logo y título */}
        <div className="flex justify-center mb-4">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Registro
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su nombre de usuario"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (opcional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Confirme su contraseña"
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su nombre"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su apellido"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="Ingrese su teléfono"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-500"
            >
              <option value="Blanco">Blanco</option>
              <option value="Azul">Azul</option>
              <option value="Violeta">Violeta</option>
              <option value="Profesor">Profesor</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>

          {/* Mensajes de error o éxito */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}

          {/* Botón de Registro */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Registrarse
          </button>
        </form>

        {/* Volver al Dashboard */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-2 px-4 rounded bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;