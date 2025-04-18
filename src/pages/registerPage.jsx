import React from "react";
import RegisterForm from "../components/forms/registerForm";

function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4 text-center">
        <h1 className="text-xl font-bold">Astros Fulgor - Registro</h1>
      </header>
      <main className="flex-grow">
        <RegisterForm />
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2025 Astros Fulgor. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default RegisterPage;
