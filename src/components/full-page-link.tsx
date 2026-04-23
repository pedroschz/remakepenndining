import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"a"> & { href: string };

/**
 * Same API as next/link for simple cases, but uses a native anchor so the
 * browser performs a full document load (no App Router client transition).
 */
export default function Link({ href, children, ...rest }: Props) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
