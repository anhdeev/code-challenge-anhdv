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
import { Web3ActionsProvider } from "@/contexts/Web3Context";
import { SwapProvider } from "@/contexts/SwapContext";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} bg-background text-foreground`}>
        {/* Global Top Loader */}
        <NextTopLoader
          color="#10b981"
          height={2}
          zIndex={999}
          showSpinner={false}
        />

        {/* Global Toast Notifications */}
        <ToastContainer position="bottom-right" autoClose={5000} />

        {/* Theme Provider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col">
            <Web3ActionsProvider>
              <SwapProvider>
                <Header /> {/* Global Header */}
                <main className="flex-1">{children}</main>{" "}
                {/* Dynamic Content */}
                <Footer /> {/* Global Footer */}
              </SwapProvider>
            </Web3ActionsProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
