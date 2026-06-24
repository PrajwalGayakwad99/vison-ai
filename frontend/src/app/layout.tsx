import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AuthControls from "../components/shared/AuthControls";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vision AI",
  description: "AI-powered visual workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="vision-ai-header">
            <div className="header-inner">
              <span className="logo">Vision AI</span>
              <AuthControls />
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}

