import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./layout.css";
import { ToastProvider } from "@/contexts/toast.context";
import { ErrorProvider } from "@/contexts/error-boundary";
import { InternalRouterProvider } from "@/contexts/router.context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Next.js Testing App",
  description: "development by ashi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <ErrorProvider>
            <InternalRouterProvider initialPath="/">
              {children}
            </InternalRouterProvider>
          </ErrorProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
