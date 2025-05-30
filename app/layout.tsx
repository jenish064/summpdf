import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SummPDF",
  description: "Summarize your PDFs with the power of AI!",
  icons: {
    icon: "./icon.ico",
  },
  openGraph: {
    images: [{ url: "/opengraph-image.jpg" }],
  },
  metadataBase: new URL("https://summ-pdf.vercel.app"),
  alternates: {
    canonical: "https://summ-pdf.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`font-sans ${fontSans.variable}
antialiased`}
        >
          <div
            className="relative flex min-h-screen
flex-col"
          >
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />I
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
