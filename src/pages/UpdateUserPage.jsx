import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");           // <-- nuevo estado
  const [activo, setActivo] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // 1) Cargar usuario
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: users } = await axios.get(
          "http://localhost:5000/api/users/usuarios",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const user = users.find((u) => u._id === userId);
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
        console.error(err);
        setMessage({ type: "error", text: "Error al cargar usuario." });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // 2) Guardar cambios generales (incluye contraseña si se ingresó)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      // Armamos el body dinámicamente: solo incluimos password si no está vacío
      const body = {
        id: userId,
        username,
        first_name: firstName,
        last_name: lastName,
        role,
        activo,
      };
      if (password.trim()) {
        body.password = password.trim();
      }

      await axios.put(
        "http://localhost:5000/api/users/profile",
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Usuario actualizado correctamente." });
      setPassword(""); // limpiamos el input de contraseña
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Error al actualizar usuario." });
    } finally {
      setSaving(false);
    }
  };

  // 3) Toggle Activo/Inactivo
  const handleToggleActivo = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:5000/api/users/deactivate",
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActivo(data.activo);
      setMessage({ type: "success", text: data.message });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "No se pudo cambiar el estado." });
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
        {/* Usuario */}
        <div>
          <label className="block text-sm mb-1">Usuario</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm mb-1">Apellido</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm mb-1">Rol</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Admin</option>
            <option>Profesor</option>
            <option>Violeta</option>
            <option>Azul</option>
            <option>Blanco</option>
          </select>
        </div>

        {/* Contraseña nueva (opcional) */}
        <div>
          <label className="block text-sm mb-1">Nueva contraseña</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Dejar en blanco para no cambiar"
          />
        </div>

        {/* Botones Guardar/Cancelar */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`px-4 py-2 text-white rounded ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Guardando…" : "Guardar Cambios"}
          </button>
        </div>
      </form>

      {/* Toggle Activo/Inactivo */}
      <div className="mt-6">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={activo}
            readOnly
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>{activo ? "Usuario Activo" : "Usuario Inactivo"}</span>
        </label>
        <button
          onClick={handleToggleActivo}
          disabled={saving}
          className={`ml-4 px-4 py-2 text-white rounded ${
            saving
              ? "bg-gray-400"
              : activo
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving
            ? "Procesando…"
            : activo
            ? "Desactivar Usuario"
            : "Reactivar Usuario"}
        </button>
      </div>
    </div>
  );
};

export default UpdateUserPage;
