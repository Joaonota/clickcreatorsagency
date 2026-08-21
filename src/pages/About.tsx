import React, { useEffect, useState } from "react";
import { Sparkles, Target, Eye, ShieldCheck, Heart, Zap, Users } from "lucide-react";
import { SectionTitle } from "../components/common/SectionTitle";
import { CTASection } from "../components/common/CTASection";
import { apiService } from "../services/api";
import type { TeamMember } from "../data/team";
import type { ClientBrand } from "../data/clients";

export const About: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<ClientBrand[]>([]);

  useEffect(() => {
    document.title = "Sobre Nós | Click Creators Agency";
    const loadData = async () => {
      const [tData, cData] = await Promise.all([
        apiService.getTeam(),
        apiService.getClients(),
      ]);
      setTeam(tData);
      setClients(cData);
    };
    loadData();
  }, []);

  const values = [
    { title: "Criatividade", desc: "Pensamos fora da caixa para gerar conceitos visuais únicos e inesquecíveis.", icon: <Sparkles className="text-lime-400" /> },
    { title: "Estratégia", desc: "Cada frame e palavra possui um objetivo de negócio mensurável por trás.", icon: <Target className="text-lime-400" /> },
    { title: "Autenticidade", desc: "Criamos histórias humanas e reais que geram identificação imediata.", icon: <Heart className="text-lime-400" /> },
    { title: "Profissionalismo", desc: "Entrega rigorosa nos prazos com padrões de qualidade audiovisual exigentes.", icon: <ShieldCheck className="text-lime-400" /> },
    { title: "Colaboração", desc: "Trabalhamos lado a lado com os clientes e criadores como uma só equipa.", icon: <Users className="text-lime-400" /> },
    { title: "Inovação", desc: "Adotamos continuamente novas ferramentas, formatos e tendências do mercado.", icon: <Zap className="text-lime-400" /> },
  ];

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-zinc-800">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Conheça a Agência</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Uma equipa movida a <br />
            <span className="gradient-text">paixão e resultados.</span>
          </h1>
          <p className="text-base md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
            Somos uma agência de marketing digital e produção audiovisual focada em transformar ideias audaciosas em presença digital marcante.
          </p>
        </div>
      </section>

      {/* QUEM SOMOS SECTION */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Quem Somos</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                A história por trás da <br />
                <span className="gradient-text">Click Creators</span>
              </h2>
              <p className="text-zinc-300 text-base leading-relaxed mb-6">
                Fundada por profissionais apaixonados por comunicação visual e marketing estratégico, a Click Creators Agency nasceu com o propósito de aproximar marcas e consumidores através de histórias reais e esteticamente impecáveis.
              </p>
              <p className="text-zinc-300 text-base leading-relaxed">
                Compreendemos que o ambiente digital de hoje exige mais do que presença constante — exige relevância, autenticidade e qualidade audiovisual que capture o olhar nos primeiros segundos.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 aspect-video shadow-2xl">
              <img
                src="/img/filmmaker-fotografo.jpeg"
                alt="Equipa Click Creators em produção"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSÃO E VISÃO */}
      <section className="section-padding bg-slate-950 border-t border-zinc-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-lime-400/20 bg-slate-900/60 flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">Nossa Missão</h3>
              <p className="text-zinc-300 text-base leading-relaxed">
                Transformar ideias em comunicação criativa e estratégica, produzindo conteúdos visuais de altíssimo valor que impulsionam o crescimento sustentável de negócios e conectam marcas aos seus públicos.
              </p>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-3xl border border-lime-400/20 bg-slate-900/60 flex flex-col gap-4">
              <div className="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
                <Eye size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white">Nossa Visão</h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Ser reconhecida nacional e internacionalmente como a agência criativa de referência no ecossistema de marketing digital, audiovisual e gestão de creators, inspirando inovação e excelência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOSSOS VALORES */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          <SectionTitle
            badge="Princípios"
            title="Nossos Valores"
            subtitle="Os pilares fundamentais que guiam cada projeto, reunião e produção da Click Creators Agency."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((item, idx) => (
              <div key={idx} className="glass-card p-6 md:p-8 rounded-3xl flex flex-col gap-4 border border-zinc-800 hover:border-lime-400/50">
                <div className="w-12 h-12 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPA SECTION */}
      <section className="section-padding bg-slate-950 border-t border-zinc-800">
        <div className="container">
          <SectionTitle
            badge="Talentos"
            title="Quem faz acontecer"
            subtitle="Conheça os profissionais por trás das estratégias, produções e conexões da Click Creators."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.id} className="glass-card p-6 rounded-3xl flex flex-col justify-between h-full border border-zinc-800 hover:border-lime-400/50">
                <div>
                  <div className="overflow-hidden rounded-2xl aspect-square mb-5 border border-zinc-800 bg-slate-900">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <span className="text-xs font-bold text-lime-400 block mb-3">{member.role}</span>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS LOGO SECTION */}
      <section className="section-padding bg-slate-900/40">
        <div className="container text-center">
          <span className="badge mb-4">Marcas Parceiras</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-10">
            Marcas que confiaram em nós
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {clients.map((c) => (
              <div key={c.id} className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border border-zinc-800 hover:border-lime-400/50">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-zinc-700 mb-2 p-1">
                  <img src={c.logo} alt={c.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-bold text-white">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};
