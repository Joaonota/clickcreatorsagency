import React, { useEffect, useState } from "react";
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { contactConfig } from "../config/contact";
import { SocialLinks } from "../components/common/SocialLinks";
import { Button } from "../components/common/Button";

export const Contact: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "marketing-digital",
    message: "",
  });

  useEffect(() => {
    document.title = "Contactos | Click Creators Agency";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Olá Click Creators! O meu nome é ${formData.name || "visitante"} e gostaria de falar sobre o serviço de ${formData.service}.`
  )}`;

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-white/10">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Fale Connosco</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Pronto para transformar <br />
            <span className="gradient-text">a sua presença digital?</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Estamos prontos para ouvir a sua ideia, responder às suas dúvidas e criar uma estratégia sob medida para a sua marca.
          </p>
        </div>
      </section>

      {/* CONTACT INFO & FORM SECTION */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT COLUMN: DIRECT CONTACT CARDS */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* WhatsApp Card */}
              <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    WhatsApp Direto
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">Conversa Instantânea</h3>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
                    Atendimento rápido e direto com os nossos estrategistas de conteúdo.
                  </p>
                  <Button href={whatsappUrl} variant="whatsapp" size="md">
                    Iniciar Conversa no WhatsApp
                  </Button>
                </div>
              </div>

              {/* Email & Phone Cards */}
              <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">E-mail</span>
                  <a href={`mailto:${contactConfig.email}`} className="text-sm font-bold text-white hover:text-purple-400">
                    {contactConfig.email}
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Telefone</span>
                  <a href={`tel:${contactConfig.phone}`} className="text-sm font-bold text-white hover:text-cyan-400">
                    {contactConfig.phone}
                  </a>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">Escritório & Estúdio</span>
                  <span className="text-sm font-bold text-white">{contactConfig.address}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-6 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Redes Sociais</span>
                <SocialLinks showLabels />
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:col-span-7">
              <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-2">Envie-nos uma mensagem</h3>
                <p className="text-slate-300 text-sm mb-8">
                  Preencha o formulário abaixo para agendarmos uma reunião de briefing sem compromisso.
                </p>

                {formSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-xl font-bold text-white">Mensagem recebida com sucesso!</h4>
                    <p className="text-sm text-slate-300 max-w-md">
                      Obrigado pelo seu contacto. A nossa equipa responderá em menos de 24 horas úteis.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-semibold text-purple-400 hover:underline mt-2"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                          E-mail Profissional *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu.email@empresa.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+351 912 345 678"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-purple-500 outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                          Serviço Pretendido
                        </label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                        >
                          <option value="marketing-digital">Marketing Digital</option>
                          <option value="producao-audiovisual">Produção Audiovisual</option>
                          <option value="gestao-redes-sociais">Gestão de Redes Sociais</option>
                          <option value="branding">Branding & Identidade Visual</option>
                          <option value="creators">Campanha com Creators</option>
                          <option value="outro">Outro assunto</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">
                        Detalhes da sua Ideia ou Projeto *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Conte-nos um pouco sobre a sua marca, objetivos e orçamento estimado..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-purple-500 outline-none transition-colors resize-none"
                      />
                    </div>

                    <Button type="submit" variant="primary" size="lg" icon={<Send size={18} />}>
                      Enviar Mensagem
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* MAP VISUAL PLACEHOLDER */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-white/10 h-72 relative bg-slate-950 shadow-2xl flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"
              alt="Mapa de Localização Porto"
              className="w-full h-full object-cover opacity-40 filter grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute z-10 glass-card p-6 rounded-2xl border border-purple-500/30 text-center flex flex-col items-center">
              <MapPin size={28} className="text-purple-400 mb-2 animate-bounce" />
              <h4 className="font-bold text-white text-lg">Click Creators Agency HQ</h4>
              <p className="text-xs text-slate-300">{contactConfig.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
