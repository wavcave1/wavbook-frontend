import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
}

export function Button({
  className,
  variant = "primary",
  block = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "button",
        variant !== "primary" && `button-${variant}`,
        block && "button-block",
        className,
      )}
      {...props}
    />
  );
}
