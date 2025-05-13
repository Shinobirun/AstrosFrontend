import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/homePage";
import RegisterPage from "./pages/registerPage";
import LoginForm from "./components/forms/loguinForm";
import Dashboard from "./pages/dasboardPage";
import TurnosPage from "./pages/turnosPage"; 
import UsuariosPage from "./pages/usuariosPage";
import TurnosDisponiblesPage from "./pages/turnosDisponiblesPage";
import PerfilPage from "./pages/perfilPage";
import CrearTurno from "./components/forms/crearTurno.jsx";
import EliminarTurno from "./components/forms/eliminarTurno.jsx";
import AsignarTurno from "./components/forms/asignarTurno.jsx";
import AsignarTurSema from "./components/forms/asignarTurSemanal.jsx";
import TurnosMensualesPage from "./pages/turnosMensualesPage.jsx";
import TurnosSemanalesPage from "./pages/turnosSemanalesPage.jsx";


// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // Si no hay token, redirige a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si hay token, muestra el componente protegido
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/turnos" element={<ProtectedRoute element={<TurnosPage />} />} />
        <Route path="/usuarios" element={<ProtectedRoute element={<UsuariosPage />} />} />
        <Route path="/turnos-disponibles/:nivel" element={<ProtectedRoute element={<TurnosDisponiblesPage />} />} />
        <Route path="/perfil" element={<ProtectedRoute element={<PerfilPage />} />} />
        <Route path="/crearTurno" element={<ProtectedRoute element={<CrearTurno />} />} />
        <Route path="/eliminarTurno" element={<ProtectedRoute element={<EliminarTurno />} />} />
        <Route path="/asignarTurno" element={<ProtectedRoute element={<AsignarTurno />} />} />
        <Route path="/asignarTurSemanal" element={<ProtectedRoute element={<AsignarTurSema />} />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/turnosMensuales/:userId" element={<TurnosMensualesPage />} />
        <Route path="/turnosSemanales/:userId" element={<TurnosSemanalesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
