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
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
};

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
              <main className="min-h-screen bg-[var(--tg-theme-bg-color)]">
                {children}
              </main>
            </AppRoot>
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
