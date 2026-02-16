import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import AuthSessionProvider from "@/providers/AuthSessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DocuMind AI App",
  description: "Talk to your documents instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <StoreProvider>
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
