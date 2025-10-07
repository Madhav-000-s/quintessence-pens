import { CSSProperties, ElementType, ReactNode } from "react";
import clsx from "clsx";

type BoundedProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Bounded({
  as: Comp = "section",
  className,
  children,
  ...restProps
}: BoundedProps) {
  return (
    <Comp
      className={clsx(
        "px-6 py-4",
        className,
      )}
      {...restProps}
    >
      <div className="mx-auto w-full">{children}</div>
    </Comp>
  );
}
