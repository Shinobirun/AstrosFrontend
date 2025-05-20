import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const CreateCreditPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [venceEn, setVenceEn] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // 1) Cargar usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(res.data);
        if (res.data.length) setUsuarioId(res.data[0]._id);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setMessage({ type: "error", text: "No se pudieron cargar los usuarios." });
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsuarios();
  }, []);

  // 2) Manejar envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/creditos",
        { usuario: usuarioId, venceEn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Crédito creado correctamente." });
      setVenceEn("");
    } catch (err) {
      console.error("Error al crear crédito:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error al crear el crédito.",
      });
    } finally {
      setCreating(false);
    }
  };

  if (loadingUsers) return <p className="p-6 text-center">Cargando usuarios…</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <Helmet>
        <title>Crear Crédito | Astros</title>
      </Helmet>
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/Astros.png" alt="Astros Logo" className="h-16 w-auto" />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">Crear Crédito</h1>

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
          {/* Select usuario */}
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
              required
            >
              {usuarios.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} {u.lastName} ({u.username})
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de vencimiento */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
            <input
              type="date"
              value={venceEn}
              onChange={(e) => setVenceEn(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si lo dejas vacío, se usará el vencimiento por defecto.
            </p>
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
            >
              ← Volver al Dashboard
            </button>
            <button
              type="submit"
              disabled={creating}
              className={`px-4 py-2 rounded text-white ${
                creating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {creating ? "Creando…" : "Crear Crédito"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCreditPage;
