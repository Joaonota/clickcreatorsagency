import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "Página Não Encontrada | Click Creators Agency";
  }, []);

  return (
    <div className="min-h-[80svh] flex items-center py-24">
      <div className="container">
        <p className="eyebrow mb-8">Erro 404</p>
        <h1 className="display-hero text-outline">404</h1>
        <p className="lede mt-8 max-w-md">
          O conteúdo que procura não existe, foi movido ou está temporariamente
          indisponível.
        </p>
        <Link to="/" className="btn btn-primary btn-lg mt-10 self-start">
          <span>← Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
