import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const ImpactNumbers: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="hairline-t hairline-b" aria-label={t.impact.numbers.map((n) => `${n.value} ${n.label}`).join(", ")}>
      <div className="container">
        <div className="stats-band">
          {t.impact.numbers.map((item, i) => {
            const hasPlus = item.value.endsWith("+");
            const digits = hasPlus ? item.value.slice(0, -1) : item.value;
            return (
              <Reveal
                key={item.id}
                delay={(i % 4) as 0 | 1 | 2 | 3}
                className="stat"
              >
                <span className="stat-tick" aria-hidden="true" />
                <p className="stat-num">
                  {digits}
                  {hasPlus && <span className="stat-plus">+</span>}
                </p>
                <p className="stat-label">{item.label}</p>
                {item.sublabel && <p className="stat-sublabel">{item.sublabel}</p>}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
