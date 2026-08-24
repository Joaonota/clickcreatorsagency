import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const PillarNarrative: React.FC = () => {
  const { t } = useTranslation();

  const pillars = [
    { k: t.partners.narrativeWork, v: t.partners.narrativeWorkDesc },
    { k: t.partners.narrativePartners, v: t.partners.narrativePartnersDesc },
    { k: t.partners.narrativeCreators, v: t.partners.narrativeCreatorsDesc },
  ];

  return (
    <ol className="pillars" aria-label={`${t.partners.narrativeWork}, ${t.partners.narrativePartners}, ${t.partners.narrativeCreators}`}>
      {pillars.map((item, i) => (
        <Reveal as="li" key={item.k} delay={(i * 1) as 0 | 1 | 2}>
          <span className="pillars-num" aria-hidden="true">{`0${i + 1}`}</span>
          <p className="pillars-title">{item.k}</p>
          <p className="pillars-desc">{item.v}</p>
          <span className="pillars-rule" aria-hidden="true" />
        </Reveal>
      ))}
    </ol>
  );
};
