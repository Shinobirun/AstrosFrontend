import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Astros Fulgor</h1>
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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