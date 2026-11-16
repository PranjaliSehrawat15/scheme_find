import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { SplashProvider } from "@/components/ui/splash-provider";
import { PageTransition } from "@/components/ui/page-transition";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SchemeFind — AI-Powered Welfare Scheme Discovery Engine",
  description:
    "Tell us about yourself once. SchemeFind reasons over official eligibility rules to match you with central and state government schemes — no bureaucracy, no missed benefits.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var raw = localStorage.getItem('schemefind_settings');
                  if (raw) {
                    var s = JSON.parse(raw);
                    if (s && s.darkMode) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                    if (s && s.compactView) {
                      document.documentElement.classList.add('compact-mode');
                    } else {
                      document.documentElement.classList.remove('compact-mode');
                    }
                  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-warm-paper font-body text-ink-navy antialiased transition-colors duration-200">
        <ThemeProvider>
          <SplashProvider>
            <AuthProvider>
              <PageTransition>{children}</PageTransition>
              <CustomCursor />
            </AuthProvider>
          </SplashProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
