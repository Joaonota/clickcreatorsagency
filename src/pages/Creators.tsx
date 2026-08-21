import React, { useEffect, useState } from "react";
import { CreatorCard } from "../components/creators/CreatorGrid";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import type { Creator } from "../data/creators";

export const CreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);

  useEffect(() => {
    document.title = "Our Creators | Click Creators Agency";
    apiService.getCreators().then(setCreators);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">Our Creators</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">FACES OF</span>
            <span className="block text-outline">INFLUENCE</span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              Pessoas, histórias, comunidades e influência. Gerimos carreiras,
              construímos audiências e conectamos creators às marcas certas.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Editorial grid */}
      <section className="pb-24 lg:pb-32">
        <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {creators.map((creator, i) => (
            <Reveal key={creator.id} delay={(i % 3) as 0 | 1 | 2} className={i % 3 === 1 ? "lg:mt-14" : i % 3 === 2 ? "lg:mt-7" : ""}>
              <CreatorCard creator={creator} aspect="aspect-[3/4]" />
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection titleLines={["WANT THIS", "FACE ON", "YOUR BRAND?"]} />
    </div>
  );
};
