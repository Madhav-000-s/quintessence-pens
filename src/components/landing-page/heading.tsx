import clsx from "clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xl" | "lg" | "md" | "sm" | "xs" | "2xl";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties
  uppercase?: boolean;
};

export function Heading({
  as: Comp = "h1",
  className,
  children,
  size = "lg",
  uppercase = false,
  ...props
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-abril",
        uppercase && "uppercase",
        size === "2xl" && "text-6xl md:text-12xl",
        size === "xl" && "text-4xl md:text-8xl",
        size === "lg" && "text-4xl md:text-7xl",
        size === "md" && "text-3xl md:text-5xl",
        size === "sm" && "text-2xl md:text-4xl",
        size === "xs" && "text-lg md:text-xl",
        className
      )}
    {...props}
    >
      {children}
    </Comp>
  );
}
