import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus AI Sprint | Build Your First AI Project in 60 Minutes",
  description:
    "Free online workshop for final-year engineering students to build, deploy, and explain a working AI project in 60 minutes. Join the campus competition.",
  keywords: ["AI workshop", "engineering students", "FastAPI", "placement prep", "coding project", "campus ambassador"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
