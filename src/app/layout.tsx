import type { Metadata } from "next";
import "./globals.css";  // se você tiver globals.css, senão ignore ou crie vazio

export const metadata: Metadata = {
  title: "Rizz Gemini",
  description: "Wingman com IA powered by Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
