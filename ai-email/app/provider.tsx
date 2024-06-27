"use client";
import { SessionProvider } from "next-auth/react";
import { Children } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
