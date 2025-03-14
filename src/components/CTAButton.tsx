import React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface CTAButtonProps extends 
  React.PropsWithChildren<{
    href: string;
    className?: string;
  }>,
  VariantProps<typeof buttonVariants> {
}

export function CTAButton({ 
  href, 
  children, 
  className = "", 
  variant = "default",
  size = "default"
}: CTAButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
} 