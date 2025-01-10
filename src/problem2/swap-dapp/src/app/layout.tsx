import "reflect-metadata";

import { ReactNode } from "react";
import { Nunito } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

const nunito = Nunito({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata = {
  title: "Swap Dapp",
  description: "Swap Dapp",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${nunito.variable} bg-background text-foreground`}>
        {/* Global Top Loader */}
        <NextTopLoader
          color="#10b981"
          height={2}
          zIndex={999}
          showSpinner={false}
        />

        {/* Global Toast Notifications */}
        <ToastContainer position="bottom-right" autoClose={5000} theme="dark" />

        {/* Theme Provider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Sub-layout structure */}
          <div className="flex h-screen flex-col">
            <Header /> {/* Global Header */}
            <main className="flex-1">{children}</main> {/* Dynamic Content */}
            <Footer /> {/* Global Footer */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
