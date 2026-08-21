import React from "react";
import { Link } from "react-router-dom";
import { useReveal, Reveal } from "../../hooks/useReveal";

const MaskedLine: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const ref = useReveal();
  return (
    <span ref={ref} className="line-mask" style={{ transitionDelay: `${delay * 0.09}s` }}>
      <span>{text}</span>
    </span>
  );
};

interface SectionHeaderProps {
  index?: string;
  eyebrow?: string;
  titleLines: string[];
  description?: string;
  linkTo?: string;
  linkLabel?: string;
  lightOnDark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  eyebrow,
  titleLines,
  description,
  linkTo,
  linkLabel = "Ver tudo",
}) => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-14 lg:mb-20">
      <div className="max-w-3xl">
        {(index || eyebrow) && (
          <Reveal>
            <p className="eyebrow mb-5">
              {index && <span className="text-[var(--text-faint)]">{index}</span>}
              {eyebrow}
            </p>
          </Reveal>
        )}
        <h2 className="display-lg">
          {titleLines.map((line, i) => (
            <MaskedLine key={i} text={line} delay={i} />
          ))}
        </h2>
        {description && (
          <Reveal delay={2}>
            <p className="lede mt-6 max-w-xl">{description}</p>
          </Reveal>
        )}
      </div>

      {linkTo && (
        <Reveal delay={3} className="shrink-0">
          <Link to={linkTo} className="arrow-link">
            <span>{linkLabel}</span>
            <span className="arrow-line" aria-hidden="true" />
          </Link>
        </Reveal>
      )}
    </div>
  );
};
