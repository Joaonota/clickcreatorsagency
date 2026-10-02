import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const AgencyIntro: React.FC = () => {
  const { t } = useTranslation();
  const a = t.about;

  return (
    <>
      {/* ── Intro / Quem Somos ── */}
      <section className="section-y hairline-t" aria-label={a.agencyIntroEyebrow}>
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{a.agencyIntroEyebrow}</p>
            <h2 className="display-lg max-w-5xl">{a.agencyIntroTitle}</h2>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mt-8 max-w-5xl">
            {a.agencyIntroBody.map((p, i) => (
              <Reveal key={p} delay={(i % 2) as 0 | 1}>
                <p className={i === 0 ? "lede text-[var(--foreground)]" : "lede"}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── O Que Somos ── */}
      <section className="section-y bg-[var(--surface)] hairline-t hairline-b" aria-label={a.whoWeAreTitle}>
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">01 — Click Creators Agency</p>
            <h2 className="display-md max-w-4xl">{a.whoWeAreTitle}</h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="lede mt-8 max-w-3xl">{a.whoWeAreLede}</p>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 mt-12">
            {a.whoWeAreItems.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 2) as 0 | 1}
                className="hairline-t py-7 flex flex-col gap-2.5"
              >
                <span className="font-display text-lg text-[var(--primary)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-2xl uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm muted leading-relaxed max-w-md">{item.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Por Que Nós ── */}
      <section className="section-y hairline-b" aria-label={a.whyUsTitle}>
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">02 — Porquê Click Creators</p>
            <h2 className="display-md max-w-4xl">{a.whyUsTitle}</h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="lede mt-8 max-w-3xl">{a.whyUsLede}</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 mt-12">
            {a.whyUsItems.map((item, i) => (
              <Reveal
                key={item.title}
                delay={(i % 3) as 0 | 1 | 2}
                className="hairline-t pt-6 flex flex-col gap-3"
              >
                <span className="font-display text-lg text-[var(--primary)]">
                  {String(i + 1).padStart(2, "0")} /
                </span>
                <h3 className="font-display text-xl uppercase tracking-wide">{item.title}</h3>
                <p className="text-xs muted leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visão ── */}
      <section
        className="section-y bg-[var(--surface)] hairline-b"
        aria-label={a.visionBlockEyebrow}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow mb-6">{a.visionBlockEyebrow}</p>
                <h2 className="display-md">{a.visionBlockTitle}</h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={1}>
                <p className="lede text-[var(--foreground)] text-xl lg:text-2xl leading-relaxed border-l-2 border-[var(--primary)] pl-6 lg:pl-8">
                  {a.visionBlockText}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
