import React, { useEffect, useState } from "react";
import { contactConfig } from "../config/contact";
import { socialLinks } from "../config/social";
import { Reveal } from "../hooks/useReveal";

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
    `Olá Click Creators! O meu nome é ${formData.name || "visitante"} e gostaria de falar sobre ${formData.service}.`
  )}`;

  const channels = [
    {
      label: "WhatsApp",
      value: contactConfig.whatsappFormatted,
      href: whatsappUrl,
      external: true,
    },
    { label: "Email", value: contactConfig.email, href: `mailto:${contactConfig.email}` },
    { label: "Instagram", value: "@clickcreatorsagency", href: socialLinks.instagram, external: true },
    { label: "TikTok", value: "@clickcreatorsagency", href: socialLinks.tiktok, external: true },
  ];

  const inputClass =
    "field placeholder:text-zinc-600";

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">Contact</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">LET'S</span>
            <span className="block text-outline">CREATE</span>
            <span className="block">SOMETHING</span>
            <span className="block">
              GREAT<span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
        </div>
      </section>

      {/* Channels + form */}
      <section className="pb-24 lg:pb-32">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Channels */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <Reveal>
              <p className="eyebrow eyebrow-bare mb-2 text-white/40 flex items-center gap-3">
                <span className="pulse-dot" aria-hidden="true" />
                Disponíveis para novos projetos
              </p>
            </Reveal>

            <ul className="flex flex-col">
              {channels.map((ch, i) => (
                <Reveal as="li" key={ch.label} delay={(i % 4) as 0 | 1 | 2 | 3}>
                  <a
                    href={ch.href}
                    {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group hairline-t py-6 flex flex-col gap-1.5"
                  >
                    <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.26em] text-zinc-500 group-hover:text-[var(--primary)] transition-colors">
                      {ch.label}
                    </span>
                    <span className="flex items-center justify-between gap-4 font-display text-xl sm:text-2xl uppercase tracking-wide group-hover:text-[var(--primary)] transition-colors break-all">
                      {ch.value}
                      <span aria-hidden="true" className="text-base shrink-0">↗</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={2}>
              <div className="hairline-t pt-6">
                <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.26em] text-zinc-500 mb-2">
                  Estúdio
                </p>
                <p className="text-sm muted leading-relaxed">{contactConfig.address}</p>
                <p className="text-xs muted mt-2">{contactConfig.workingHours}</p>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal delay={1}>
              <p className="index-num mb-8">Start a Project →</p>

              {formSubmitted ? (
                <div className="hairline-t pt-12 pb-8 flex flex-col gap-4">
                  <p className="font-display text-4xl uppercase text-[var(--primary)]">
                    Mensagem recebida.
                  </p>
                  <p className="muted text-sm max-w-md leading-relaxed">
                    Obrigado pelo seu contacto, {formData.name.split(" ")[0] || "obrigado"}. A
                    nossa equipa responderá em menos de 24 horas úteis.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="arrow-link mt-4 self-start"
                  >
                    <span>Enviar outra mensagem</span>
                    <span className="arrow-line" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-9">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
                    <label className="block">
                      <span className="field-label">Nome *</span>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="O seu nome"
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="field-label">Email *</span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nome@empresa.com"
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="field-label">Telefone / WhatsApp</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+351 912 345 678"
                        className={inputClass}
                      />
                    </label>

                    <label className="block">
                      <span className="field-label">Serviço</span>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className={`${inputClass} bg-transparent [&>option]:bg-[#111114]`}
                      >
                        <option value="marketing-digital">Marketing Digital</option>
                        <option value="producao-audiovisual">Produção Audiovisual</option>
                        <option value="gestao-redes-sociais">Gestão de Redes Sociais</option>
                        <option value="branding">Branding & Identidade Visual</option>
                        <option value="creators">Campanha com Creators</option>
                        <option value="outro">Outro assunto</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="field-label">A sua ideia *</span>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Conte-nos sobre a sua marca, objetivos e orçamento estimado..."
                      className={`${inputClass} min-h-[120px]`}
                    />
                  </label>

                  <button type="submit" className="btn btn-primary btn-lg self-start mt-2">
                    <span>Send Message →</span>
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
