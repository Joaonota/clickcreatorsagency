import React from "react";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";
import { socialLinks } from "../../config/social";
import { useTranslation } from "../../i18n";

const feed = [
  {
    id: "post-1",
    platform: "Instagram",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    url: socialLinks.instagram,
  },
  {
    id: "post-2",
    platform: "TikTok",
    image: "/img/filmmaker-fotografo.jpeg",
    url: socialLinks.tiktok,
  },
  {
    id: "post-3",
    platform: "Instagram",
    image: "/img/modelo.jpeg",
    url: socialLinks.instagram,
  },
  {
    id: "post-4",
    platform: "YouTube",
    image:
      "https://images.unsplash.com/photo-1579965342575-16428a7c8881?auto=format&fit=crop&w=800&q=80",
    url: socialLinks.youtube,
  },
];

export const SocialFeed: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="section-y">
      <div className="container">
        <SectionHeader
          index={t.socialFeed.index}
          eyebrow={t.socialFeed.eyebrow}
          titleLines={t.socialFeed.titleLines}
          description={t.socialFeed.description}
          linkTo={socialLinks.instagram}
          linkLabel="@clickcreatorsagency"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {feed.map((post, i) => (
            <Reveal key={post.id} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="social-tile"
                aria-label={`${t.socialFeed.viewOn} ${post.platform}`}
              >
                <img src={post.image} alt="" loading="lazy" />
                <span className="st-platform">{post.platform}</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
