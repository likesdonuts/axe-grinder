import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axe Grinder",
  description: "Create and randomly retrieve your axes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
