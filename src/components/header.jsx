import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-sky-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo a la izquierda */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Astros.png" alt="Astros Fulgor" className="h-8 w-auto" />
          <span className="text-xl font-bold"></span>
        </Link>

        {/* Navegación */}
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Loguearse
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Registrarse
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
