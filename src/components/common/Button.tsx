import React from "react";
import { Link } from "react-router-dom";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "glass" | "whatsapp";
  size?: "sm" | "md" | "lg";
  to?: string;
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  to,
  href,
  icon,
  iconPosition = "right",
  fullWidth = false,
  children,
  className = "",
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-lime-400 hover:bg-lime-300 text-slate-950 font-extrabold shadow-lg shadow-lime-500/20 border border-lime-300";
      case "secondary":
        return "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-bold";
      case "outline":
        return "bg-transparent hover:bg-lime-400 text-lime-400 hover:text-slate-950 font-bold border border-lime-400/50 hover:border-lime-400";
      case "glass":
        return "bg-white/5 hover:bg-white/10 text-white backdrop-blur-md border border-white/10 hover:border-white/20 font-bold";
      case "whatsapp":
        return "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-900/30 border border-emerald-400";
      default:
        return "";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-3.5 py-1.5 text-xs rounded-lg gap-1.5";
      case "md":
        return "px-5 py-2.5 text-sm rounded-xl gap-2";
      case "lg":
        return "px-7 py-3.5 text-base rounded-2xl gap-2.5";
    }
  };

  const baseClasses = `inline-flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${getVariantStyles()} ${getSizeStyles()} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {content}
    </button>
  );
};
