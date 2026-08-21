import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/common/WhatsAppButton";

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on every route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-purple-600 selection:text-white">
      <Header />
      <main className="flex-grow pt-[80px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
