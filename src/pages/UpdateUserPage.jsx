import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUserPage = () => {
  const { userId } = useParams();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = res.data.find((u) => u._id === userId);
        if (!user) {
          setMessage({ type: "error", text: "Usuario no encontrado." });
        } else {
          setUsername(user.username);
          setFirstName(user.firstName);
          setLastName(user.lastName);
          setRole(user.role);
          setActivo(user.activo);
        }
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        setMessage({ type: "error", text: "No se pudo cargar el usuario." });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          id: userId,
          username,
          first_name: firstName,
          last_name: lastName,
          role,
          activo, // enviamos el estado activo actualizado
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage({ type: "success", text: "Usuario actualizado correctamente." });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error al actualizar usuario.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Cargando usuario…</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar Usuario</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="Admin">Admin</option>
            <option value="Profesor">Profesor</option>
            <option value="Violeta">Violeta</option>
            <option value="Azul">Azul</option>
            <option value="Blanco">Blanco</option>
          </select>
        </div>

        {/* Checkbox para activar/desactivar usuario */}
        <div>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Activo</span>
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 rounded text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Guardando…" : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserPage;

