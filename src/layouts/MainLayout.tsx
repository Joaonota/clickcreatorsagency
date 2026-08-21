import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/common/WhatsAppButton";

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--color-text)] grain">
      <Header />
      <main key={pathname} className="flex-grow page-enter">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
