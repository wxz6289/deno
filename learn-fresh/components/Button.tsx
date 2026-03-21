import type { ComponentChildren } from "preact";

export interface ButtonProps {
  id?: string;
  href?: string;
  class?: string;
  className?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  disabled?: boolean;
}

export function Button({ href, class: cls, className, ...props }: ButtonProps) {
  const base =
    "inline-block px-4 py-2 m-2 rounded-md shadow-sm transition-colors focus:outline-none";
  const variant = cls ?? className ?? "";
  const classes = `${base} ${variant}`.trim();
  if (href) {
    return (
      <a
        href={href}
        {...props}
        class={classes}
      />
    );
  }
  return (
    <button
      {...props}
      class={classes}
    />
  );
}
