import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

const PhotoPlaceholder: React.FC<{ label: string; src?: string; image?: string }> = ({
  label,
  src,
  image,
}) => (
  <div
    className={`ht-photo${src ? " ht-photo-logo" : ""}${image ? " ht-photo-image" : ""}`}
    role="img"
    aria-label={
      src
        ? `Logótipo da Click Creators — ${label}`
        : image
          ? `${label} — Click Creators`
          : `Fotografia a adicionar — ${label}`
    }
  >
    {src ? (
      <>
        <span className="ht-logo-wrap">
          <img src={src} alt="" loading="lazy" />
        </span>
        <span className="ht-photo-label">
          {label}
        </span>
      </>
    ) : image ? (
      <>
        <img src={image} alt="" loading="lazy" className="ht-photo-img" />
        <span className="ht-photo-cap">{label}</span>
      </>
    ) : (
      <>
        <span className="ht-photo-plus" aria-hidden="true">
          +
        </span>
        <span className="ht-photo-label">
          {`FOTO A ADICIONAR`}
          <em>{label}</em>
        </span>
      </>
    )}
  </div>
);

export const HistoryTimeline: React.FC = () => {
  const { t } = useTranslation();
  const a = t.about;

  return (
    <section id="historia" className="section-y hairline-t ht-section" aria-labelledby="historia-title">
      <div className="container">
        {/* ── Abertura editorial ─────────────────────────── */}
        <Reveal>
          <p className="eyebrow mb-8">{a.historyEyebrow}</p>
          <h2 id="historia-title" className="display-md max-w-4xl">
            {a.historyHeading}
          </h2>
        </Reveal>

        <div className="ht-intro">
          {a.historyHeadlineLines.map((line, i) => (
            <Reveal key={line} delay={(i % 3) as 0 | 1 | 2}>
              <p className="ht-kicker">{line}</p>
            </Reveal>
          ))}
        </div>

        <div className="ht-intro-body">
          {a.historyIntro.map((p, i) => (
            <Reveal key={p} delay={(i % 3) as 0 | 1 | 2}>
              <p>{p}</p>
            </Reveal>
          ))}
          <Reveal>
            <p className="ht-outro">{a.historyIntroOutro}</p>
          </Reveal>
        </div>

        {/* ── Timeline ───────────────────────────────────── */}
        <div className="ht-list-wrap">
          <span className="ht-rail" aria-hidden="true" />
          <ol className="ht-list">
            {a.historyItems.map((item, i) => {
              const side = i % 2 === 0 ? "ht-left" : "ht-right";
              return (
                <Reveal
                  as="li"
                  key={item.num}
                  className={`ht-item ${side}${item.milestone ? " ht-milestone" : ""}`}
                >
                  <span className="ht-dot" aria-hidden="true" />
                  <span className="ht-seg" aria-hidden="true" />
                  <div className="ht-card">
                    <span className="ht-num" aria-hidden="true">
                      {item.num} /
                    </span>
                    <h3 className={item.milestone ? "ht-title ht-title-xl" : "ht-title"}>
                      {item.title}
                    </h3>
                    <p className="ht-tagline">{item.tagline}</p>
                    <div className="ht-body">
                      {item.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                    {item.photoLabel && (
                      <PhotoPlaceholder
                        label={item.photoLabel}
                        src={item.milestone ? "/logo/logo.PNG" : undefined}
                      />
                    )}
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* ── HOJE ───────────────────────────────────────── */}
        <Reveal className="ht-today">
          <span className="ht-dot ht-dot-today" aria-hidden="true" />
          <h3 className="display-lg ht-today-title">{a.historyTodayTitle}</h3>
          <p className="ht-tagline ht-today-tagline">{a.historyTodayTagline}</p>
          <p className="ht-today-body">{a.historyTodayBody}</p>
          <p className="ht-today-note">{a.historyTodayNote}</p>
          <PhotoPlaceholder label={a.historyTodayPhotoLabel} image="/img/Default_img.jpeg" />
          <span className="ht-continue" aria-hidden="true">
            <span className="ht-continue-arrow">→</span>
          </span>
        </Reveal>

        {/* ── Frase de impacto ───────────────────────────── */}
        <div className="ht-quote-wrap">
          <Reveal>
            <blockquote className="ht-quote">
              {a.historyQuoteLines.map((line, i) => (
                <span key={line} className={i === a.historyQuoteLines.length - 1 ? "ht-quote-accent" : ""}>
                  {line}
                </span>
              ))}
            </blockquote>
          </Reveal>
          <Reveal delay={1}>
            <p className="ht-final">
              {a.historyFinalPre}
              <span className="text-[var(--primary)]">{a.historyFinalHighlight}</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
