import React, { useEffect, useState } from "react";
import { CTASection } from "../components/common/CTASection";
import { TeamGrid } from "../components/team/TeamGrid";
import { PartnersShowcase } from "../components/partners/PartnersShowcase";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import type { TeamMember } from "../data/team";
import type { Partner } from "../data/partners";

const values = [
  {
    num: "01",
    title: "Criatividade",
    desc: "Pensamos fora da caixa para gerar conceitos visuais únicos e inesquecíveis.",
  },
  {
    num: "02",
    title: "Estratégia",
    desc: "Cada frame e palavra possui um objetivo de negócio mensurável por trás.",
  },
  {
    num: "03",
    title: "Autenticidade",
    desc: "Criamos histórias humanas e reais que geram identificação imediata.",
  },
  {
    num: "04",
    title: "Profissionalismo",
    desc: "Entrega rigorosa nos prazos com padrões de qualidade audiovisual exigentes.",
  },
  {
    num: "05",
    title: "Colaboração",
    desc: "Trabalhamos lado a lado com clientes e creators como uma só equipa.",
  },
  {
    num: "06",
    title: "Inovação",
    desc: "Adotamos continuamente novas ferramentas, formatos e tendências do mercado.",
  },
];

export const About: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    document.title = "Sobre Nós | Click Creators Agency";
    Promise.all([apiService.getTeam(), apiService.getPartners()]).then(([tData, pData]) => {
      setTeam(tData);
      setPartners(pData);
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">The Agency</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">IDEAS BECOME</span>
            <span className="block text-outline">INFLUENCE</span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              Somos uma agência criativa movida por cultura digital, storytelling e
              resultados. Transformamos ideias audaciosas em presença digital marcante.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story — editorial split */}
      <section className="section-y hairline-t">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-8">A Nossa História</p>
            </Reveal>
            <Reveal delay={1}>
              <p className="lede mb-8 max-w-2xl">
                Fundada por profissionais apaixonados por comunicação visual e marketing
                estratégico, a Click Creators Agency nasceu com o propósito de aproximar
                marcas e consumidores através de histórias reais e esteticamente impecáveis.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <p className="muted text-sm leading-relaxed max-w-xl">
                Compreendemos que o ambiente digital de hoje exige mais do que presença
                constante — exige relevância, autenticidade e qualidade audiovisual que
                capture o olhar nos primeiros segundos. É aí que entramos.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] mt-14">
              <Reveal className="bg-[#0a0a0c] p-8 lg:p-10">
                <p className="index-num mb-4">Mission</p>
                <p className="text-sm leading-relaxed text-white/85">
                  Transformar ideias em comunicação criativa e estratégica, produzindo
                  conteúdos de altíssimo valor que impulsionam negócios e conectam marcas
                  aos seus públicos.
                </p>
              </Reveal>
              <Reveal delay={1} className="bg-[#0a0a0c] p-8 lg:p-10">
                <p className="index-num mb-4">Vision</p>
                <p className="text-sm leading-relaxed text-white/85">
                  Ser a agência criativa de referência no ecossistema de marketing digital,
                  audiovisual e gestão de creators — inspirando inovação e excelência.
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal className="reveal-clip lg:col-span-5 lg:mt-16">
            <div className="media-frame aspect-[3/4]">
              <img
                src="/img/filmmaker-fotografo.jpeg"
                alt="Equipa Click Creators em produção"
                loading="lazy"
              />
            </div>
            <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.24em] muted mt-3">
              Bastidores — Produção Click Creators
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-[var(--surface)] hairline-t hairline-b">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">Princípios</p>
            <h2 className="display-lg mb-14">OUR VALUES</h2>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
            {values.map((v, i) => (
              <Reveal as="li" key={v.num} delay={(i % 3) as 0 | 1 | 2} className="hairline-t py-7 flex flex-col gap-2.5">
                <span className="font-display text-lg text-[var(--primary)]">{v.num}</span>
                <h3 className="font-display text-2xl uppercase tracking-wide">{v.title}</h3>
                <p className="text-xs muted leading-relaxed max-w-xs">{v.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <TeamGrid members={team} />

      {/* Partners */}
      <PartnersShowcase partners={partners} />

      <CTASection />
    </div>
  );
};
