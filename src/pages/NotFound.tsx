import React, { useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "../components/common/Button";

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = "Página Não Encontrada | Click Creators Agency";
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10 text-center flex flex-col items-center max-w-xl">
        <span className="badge mb-6 flex items-center gap-1.5">
          <Sparkles size={14} className="text-lime-400" />
          <span>Erro 404</span>
        </span>

        <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-white mb-4 gradient-text">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Página não encontrada
        </h2>

        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8">
          O conteúdo que está a tentar aceder não existe, foi alterado de endereço ou está temporariamente indisponível.
        </p>

        <Button to="/" variant="primary" size="lg" icon={<ArrowLeft size={18} />} iconPosition="left">
          Voltar à Página Inicial
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
