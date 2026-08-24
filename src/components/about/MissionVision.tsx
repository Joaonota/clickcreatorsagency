import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const MissionVision: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-y hairline-t mv-section" aria-label={`${t.about.missionTitle} & ${t.about.visionTitle}`}>
      <div className="container">
        <div className="mv-grid">
          <Reveal as="div" className="mv-item-wrap">
            <article className="mv-item">
              <div className="mv-head">
                <span className="mv-num" aria-hidden="true">01</span>
                <h2 className="mv-title">{t.about.missionTitle}</h2>
                <span className="mv-rule" aria-hidden="true" />
              </div>
              <p className="mv-text">{t.about.missionText}</p>
            </article>
          </Reveal>

          <Reveal as="div" delay={1} className="mv-item-wrap">
            <article className="mv-item">
              <div className="mv-head">
                <span className="mv-num" aria-hidden="true">02</span>
                <h2 className="mv-title">{t.about.visionTitle}</h2>
                <span className="mv-rule" aria-hidden="true" />
              </div>
              <p className="mv-text">{t.about.visionText}</p>
            </article>
          </Reveal>
        </div>

        <Reveal as="div" delay={2}>
          <div className="mv-brandmark" aria-hidden="true">
            <span className="pulse-dot" />
            <span className="mv-brandmark-label">Click Creators</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
