import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Annai School - Excellence in Education",
  description: "A premier educational institution committed to nurturing young minds and building future leaders through quality education and holistic development.",
  keywords: "school, education, admission, academics, students, learning",
  authors: [{ name: "Annai School" }],
  openGraph: {
    title: "Annai School - Excellence in Education",
    description: "A premier educational institution committed to nurturing young minds and building future leaders.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
