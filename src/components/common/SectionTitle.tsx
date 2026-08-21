import React from "react";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  badge,
  title,
  subtitle,
  align = "center",
  className = "",
}) => {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-12 md:mb-16 ${alignmentClasses[align]} ${className}`}>
      {badge && <span className="badge mb-4">{badge}</span>}
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
