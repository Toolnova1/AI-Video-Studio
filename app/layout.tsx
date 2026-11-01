import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Video Studio",
  description: "A personal workspace for planning and generating AI videos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}