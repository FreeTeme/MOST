import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@telegram-apps/telegram-ui/dist/styles.css";
import { AppRoot } from "@telegram-apps/telegram-ui";
import TelegramProvider from "@/components/TelegramProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Influencer Platform",
  description: "Платформа для поиска инфлюенсеров",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <ThemeProvider>
          <TelegramProvider>
            <AppRoot>
              <main className="app-root min-h-[100dvh] bg-[var(--tg-theme-bg-color)]">
                {children}
              </main>
            </AppRoot>
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
