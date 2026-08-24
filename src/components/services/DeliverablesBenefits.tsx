import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

type Delay = 0 | 1 | 2 | 3 | 4 | 5;

const splitTitle = (title: string): { num: string; label: string } => {
  const match = title.match(/^(\d{2})\s*—\s*(.+)$/);
  if (match) return { num: match[1], label: match[2] };
  return { num: "", label: title };
};

export const DeliverablesBenefits: React.FC<{ deliverables: string[]; benefits: string[] }> = ({
  deliverables,
  benefits,
}) => {
  const { t } = useTranslation();
  const del = splitTitle(t.services.deliverablesTitle);
  const ben = splitTitle(t.services.benefitsTitle);

  return (
    <section className="section-y">
      <div className="container db-grid">

        <div className="db-col">
          <Reveal>
            <header className="db-head">
              {del.num && <span className="db-num" aria-hidden="true">{del.num}</span>}
              <h2 className="db-title">{del.label}</h2>
            </header>
          </Reveal>
          <ul className="db-list">
            {deliverables.map((item, i) => (
              <Reveal as="li" key={item} delay={(Math.min(i, 4)) as Delay} className="db-item">
                <span className="db-plus" aria-hidden="true">+</span>
                <span className="db-text">{item}</span>
                <span className="db-arrow" aria-hidden="true">→</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="db-col db-col-benefits">
          <Reveal>
            <header className="db-head">
              {ben.num && <span className="db-num" aria-hidden="true">{ben.num}</span>}
              <h2 className="db-title">{ben.label}</h2>
            </header>
          </Reveal>
          <ul className="db-ben-list">
            {benefits.map((item, i) => (
              <Reveal as="li" key={item} delay={(2 + i) as Delay} className="db-benefit">
                <span className="db-ben-symbol" aria-hidden="true">↳</span>
                <span>{item}</span>
              </Reveal>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
};
