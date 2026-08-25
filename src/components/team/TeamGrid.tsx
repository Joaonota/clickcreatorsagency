import React from "react";
import type { TeamMember } from "../../data/team";
import { SectionHeader } from "../common/SectionHeader";
import { SocialIcon } from "../common/SocialIcon";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="team-card aspect-[3/4]">
    <img src={member.image} alt={member.name} loading="lazy" className="team-photo" />
    <div className="team-info">
      <h3 className="tm-name">{member.name}</h3>
      <p className="tm-role mt-1.5">{member.role}</p>
      <div className="flex gap-4 mt-3">
        {member.socials.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram de ${member.name}`}
            className="text-white/60 hover:text-[var(--primary)] transition-colors"
          >
            <SocialIcon name="instagram" size={16} />
          </a>
        )}
        {member.socials.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`LinkedIn de ${member.name}`}
            className="text-white/60 hover:text-[var(--primary)] transition-colors"
          >
            <SocialIcon name="linkedin" size={16} />
          </a>
        )}
      </div>
    </div>
  </div>
);

export const TeamGrid: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  const { t } = useTranslation();

  return (
    <section className="section-y bg-[var(--surface)] hairline-t hairline-b">
      <div className="container">
        <SectionHeader
          index={t.team.index}
          eyebrow={t.team.eyebrow}
          titleLines={t.team.titleLines}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={(i % 4) as 0 | 1 | 2 | 3} className={i % 2 === 1 ? "lg:mt-12" : ""}>
              <TeamCard member={m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
