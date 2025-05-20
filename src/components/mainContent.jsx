import React from "react";

function MainContent() {
  return (
    <main className="flex-grow bg-gray-600 p-8">
      <div className="container mx-auto text-center">
        {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src="/Astros.png" alt="Astros logo" className="h-60" />
      </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-100">¡Bienvenido a Astros!</h2>
        <p className="text-lg text-gray-100">
          Liberá, cambiá o tomá turnos en segundos. Así se juega en equipo!
        </p>
      </div>
    </main>
  );
}

export default MainContent;
