import type { Metadata } from "next";
import { inter, jetbrainsMono } from "./fonts";
import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/redux/provider/ReduxProvider";

export const metadata: Metadata = {
  title: "AlexGarrett Admin",
  description: "Premium Admin Control Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
