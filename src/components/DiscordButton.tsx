import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Zap } from "lucide-react";
import { useSiteData } from "@/lib/site-data";

type DiscordButtonProps = {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  icon?: "zap" | "arrow" | "arrow-up-right";
  className?: string;
  children: React.ReactNode;
  pulse?: boolean;
  onClick?: () => void;
};

export function DiscordButton({
  size = "md",
  variant = "solid",
  icon = "zap",
  className,
  children,
  pulse = true,
  onClick,
}: DiscordButtonProps) {
  const sizeClasses = {
    sm: "rounded-xl px-4 py-2 text-xs",
    md: "rounded-2xl px-6 py-3 text-sm",
    lg: "rounded-2xl px-8 py-4 text-base",
  };

  const iconSize = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-5 w-5",
  };

  const Icon = {
    zap: Zap,
    arrow: ArrowRight,
    "arrow-up-right": ArrowUpRight,
  }[icon];

  const isSolid = variant === "solid";
  const { discordInvite } = useSiteData();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick();
    // Preview iframe'de bazı tarayıcılar target="_blank" navigasyonunu engelleyebilir.
    // window.open ile açık bir sekme açmak bu durumu çözer.
    e.preventDefault();
    window.open(discordInvite, "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={discordInvite}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden font-extrabold transition-all duration-200",
        sizeClasses[size],
        isSolid
          ? "text-gold-foreground shadow-[var(--shadow-glow-gold)] hover:scale-[1.04] hover:brightness-110 active:scale-[0.98]"
          : "border border-gold/40 text-gold hover:bg-gold hover:text-gold-foreground active:scale-[0.98]",
        pulse && isSolid && "animate-pulse-glow",
        className,
      )}
      style={isSolid ? { backgroundImage: "var(--gradient-gold)" } : undefined}
    >
      {pulse && isSolid && (
        <span className="pointer-events-none absolute inset-0 rounded-inherit">
          <span className="absolute inset-0 rounded-inherit border border-gold/30 animate-pulse-ring" />
        </span>
      )}

      {isSolid && (
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer-pass bg-background/25 blur-md" />
      )}

      <span className="relative z-10 flex items-center gap-2">
        {children}
        <Icon
          className={cn(
            iconSize[size],
            icon === "zap" && "transition-transform group-hover:rotate-12 group-hover:scale-110",
            icon === "arrow" && "transition-transform group-hover:translate-x-1 animate-float-arrow",
            icon === "arrow-up-right" &&
              "transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
          )}
        />
      </span>
    </a>
  );
}
