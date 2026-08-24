import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const Manifesto: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-y relative overflow-hidden">
      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky vertical label */}
        <div className="hidden lg:block lg:col-span-1">
          <span className="vertical-label">{t.manifesto.label}</span>
        </div>

        <div className="lg:col-span-7">
          <h2 className="display-xl leading-[0.9]">
            <span className="block">{t.manifesto.titleLines[0]}</span>
            <span className="block text-outline">{t.manifesto.titleLines[1]}</span>
            <span className="block">
              {t.manifesto.titleLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h2>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end gap-8">
          <Reveal>
            <p className="lede">{t.manifesto.lede}</p>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-sm muted leading-relaxed">{t.manifesto.body}</p>
          </Reveal>
          <Reveal delay={3}>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-display text-5xl text-[var(--primary)]">↳</span>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--text-soft)]">
                {t.manifesto.highlight}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
