import clsx from "clsx";
import { Marker } from "./Marker"; 
import React from "react";

interface ButtonProps {
  /** Optional icon image URL */
  icon?: string;
  /** Optional React Icon component */
  Icon?: React.ElementType;
  /** Inner text or children elements */
  children?: React.ReactNode;
  /** Optional link href (if provided, renders as <a>) */
  href?: string;
  /** Tailwind or custom container classes */
  containerClassName?: string;
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Optional fill color for marker */
  markerFill?: string;
}

/**
 * A gradient-styled button component supporting icons and optional link behavior.
 */
const Button: React.FC<ButtonProps> = ({
  icon,
  Icon,
  children,
  href,
  containerClassName,
  onClick,
  markerFill,
}) => {
  const Inner: React.FC = () => (
    <span
      className="relative flex items-center min-h-[40px] px-3 rounded-md bg-gradient-primary text-primary-foreground hover:border-yellow-400 hover:border-2 group-hover:opacity-90 transition-all duration-300 overflow-hidden"
    >
      {/* Marker */}
      <span className="absolute -left-[1px]">
        <Marker fill={markerFill || "hsl(var(--primary))"} />
      </span>

      {/* Render either image icon or React Icon */}
      {icon && typeof icon === "string" && (
        <img
          src={icon}
          alt="icon"
          className="h-5 w-5 mr-3 object-contain z-10"
        />
      )}
      {Icon && <Icon className="h-5 w-5 mr-3 text-primary-foreground z-10" />}

      {/* Button Text */}
      <span className="relative z-10 font-sans font-semibold text-primary-foreground hover:text-yellow-400 uppercase">
        {children}
      </span>
    </span>
  );

  const baseClasses =
    "relative p-0.5 bg-card rounded-md shadow-soft group transition-all duration-500 hover:shadow-strong animate-pulse-soft";

  if (href) {
    return (
      <a
        className={clsx(baseClasses, containerClassName)}
        href={href}
        aria-label={typeof children === "string" ? children : undefined}
      >
        <Inner />
      </a>
    );
  }

  return (
    <button
      className={clsx(baseClasses, containerClassName)}
      onClick={onClick}
      aria-label={typeof children === "string" ? children : undefined}
    >
      <Inner />
    </button>
  );
};

export default Button;
