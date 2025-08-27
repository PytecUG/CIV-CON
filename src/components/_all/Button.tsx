import clsx from "clsx";
import { Marker } from "./Marker.tsx";

const Button = ({
  icon,
  Icon,
  children,
  href,
  containerClassName,
  onClick,
  markerFill,
}) => {
  const Inner = () => (
    <>
      <span
        className="relative flex items-center min-h-[60px] px-4 rounded-md bg-gradient-primary text-primary-foreground  hover:border-yellow-400 hover:border-2 group-hover:opacity-90 transition-all duration-300 overflow-hidden"
      >
        <span className="absolute -left-[1px]">
          <Marker markerFill={markerFill || "hsl(var(--primary))"} />
        </span>

        {/* Render either image icon or React Icon */}
        {icon && typeof icon === "string" && (
          <img
            src={icon}
            alt="icon"
            className="size-10 mr-5 object-contain z-10"
          />
        )}
        {Icon && <Icon className="size-10 mr-5 text-primary-foreground z-10" />}

        <span className="relative z-2 font-sans font-semibold text-primary-foreground hover:text-yellow-400 uppercase">
          {children}
        </span>
      </span>
    </>
  );

  const baseClasses =
    "relative p-0.5 bg-card rounded-md shadow-soft group transition-all duration-500 hover:shadow-strong animate-pulse-soft";

  return href ? (
    <a
      className={clsx(baseClasses, containerClassName)}
      href={href}
      aria-label={children}
    >
      <Inner />
    </a>
  ) : (
    <button
      className={clsx(baseClasses, containerClassName)}
      onClick={onClick}
      aria-label={children}
    >
      <Inner />
    </button>
  );
};

export default Button;