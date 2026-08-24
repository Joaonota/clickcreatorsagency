import React from "react";
import { Link } from "react-router-dom";
import type { Creator } from "../../data/creators";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const CreatorCard: React.FC<{ creator: Creator; aspect?: string }> = ({
  creator,
  aspect = "aspect-[3/4]",
}) => {
  const { t } = useTranslation();

  return (
    <Link to={`/creators/${creator.slug}`} className="creator-card">
      <div className={`media-frame ${aspect} h-full`}>
        <img src={creator.image} alt={creator.name} loading="lazy" className="creator-photo" />
      </div>
      <div className="creator-overlay">
        <span className="creator-cat mb-2">{creator.category}</span>
        <h3 className="creator-name">{creator.name}</h3>
        <span className="creator-user">{creator.username}</span>
        <div className="creator-socials">
          {creator.followers.instagram && (
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white/80">
              IG {creator.followers.instagram}
            </span>
          )}
          {creator.followers.tiktok && (
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white/80">
              TK {creator.followers.tiktok}
            </span>
          )}
          {creator.followers.youtube && (
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white/80">
              YT {creator.followers.youtube}
            </span>
          )}
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[var(--primary)] ml-auto">
            {t.creators.viewProfile} →
          </span>
        </div>
      </div>
    </Link>
  );
};

export const CreatorGrid: React.FC<{ creators: Creator[] }> = ({ creators }) => {
  const { t } = useTranslation();

  return (
    <section className="section-y bg-[var(--surface)] hairline-t hairline-b overflow-hidden">
      <div className="container">
        <SectionHeader
          index={t.creators.index}
          eyebrow={t.creators.eyebrow}
          titleLines={t.creators.titleLines}
          description={t.creators.description}
          linkTo="/creators"
          linkLabel={t.creators.linkLabel}
        />
      </div>

      {/* Mobile: horizontal rail / Desktop: editorial grid */}
      <div className="container h-scroll-rail lg:grid-cols-12 gap-5 lg:gap-6">
        {creators.map((creator, i) => {
          const spans = [
            "lg:col-span-4",
            "lg:col-span-3 lg:-mt-10",
            "lg:col-span-5 lg:mt-14",
            "lg:col-span-3",
            "lg:col-span-4 lg:mt-8",
            "lg:col-span-5 lg:-mt-6",
          ];
          const aspects = [
            "aspect-[3/4]",
            "aspect-[3/4] lg:aspect-[3/4.6]",
            "aspect-square lg:aspect-[4/3.4]",
            "aspect-[3/4]",
            "aspect-[3/4] lg:aspect-[3/4.4]",
            "aspect-square lg:aspect-[4/3.6]",
          ];
          return (
            <Reveal
              key={creator.id}
              delay={(i % 3) as 0 | 1 | 2}
              className={spans[i % spans.length]}
            >
              <CreatorCard creator={creator} aspect={aspects[i % aspects.length]} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};
