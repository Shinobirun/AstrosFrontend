import React from "react";
import Header from "../components/header";
import MainContent from "../components/mainContent";
import Footer from "../components/footer";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default HomePage;
