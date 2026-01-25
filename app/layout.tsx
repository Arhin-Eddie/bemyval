import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { HeartBackground } from "@/components/HeartBackground";
import { UserMenu } from "@/components/UserMenu";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Valentine - Mischievous Invitations",
    template: "%s | Valentine",
  },
  description: "Beautiful, playful, and secure invitations with a mischievous twist. Perfect for your special someone.",
  openGraph: {
    title: "Valentine - Mischievous Invitations",
    description: "Beautiful, playful, and secure invitations for your special someone.",
    url: "https://valentine.app",
    siteName: "Valentine",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentine - Mischievous Invitations",
    description: "Invitations with a mischievous twist.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <HeartBackground />
        <UserMenu />
        {children}
      </body>
    </html>
  );
}
