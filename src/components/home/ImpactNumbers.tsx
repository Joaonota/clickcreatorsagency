import React from "react";
import { Reveal } from "../../hooks/useReveal";
import { impactNumbers } from "../../data/impact";

export const ImpactNumbers: React.FC = () => {
  return (
    <section className="relative hairline-t hairline-b">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border-x border-[var(--border)]">
          {impactNumbers.map((item, i) => (
            <Reveal
              key={item.id}
              delay={(i % 4) as 0 | 1 | 2 | 3}
              className="flex flex-col justify-between gap-8 py-10 lg:py-16 px-6 sm:px-10 bg-[#0a0a0c]"
            >
              <span className="display-lg text-[var(--primary)] leading-none">{item.value}</span>
              <span className="flex flex-col">
                <span className="font-display text-xl lg:text-2xl uppercase tracking-wide">
                  {item.label}
                </span>
                {item.sublabel && (
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.24em] muted mt-1">
                    {item.sublabel}
                  </span>
                )}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
