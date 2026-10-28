import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leo Pizzas",
  description: "Sistema de gestão e pedidos da Leo Pizzas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      {/* O body voltou ao normal, sem forçar cores no site inteiro */}
      <body className="min-h-full flex flex-col">
        {children}

        {/* Apenas o Toaster está customizado aqui */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
            },
            classNames: {
              success:
                "!bg-emerald-950/40 !border-emerald-500/30 !text-emerald-400",
              error: "!bg-red-950/40 !border-red-500/30 !text-red-400",
            },
          }}
        />
      </body>
    </html>
  );
}
