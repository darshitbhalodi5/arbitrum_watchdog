import type { Metadata } from "next";
import { primaryFont, secondaryFont } from './fonts'
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Truence",
  description: "Introducing the Integrity of DAO Funds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${primaryFont.variable} ${secondaryFont.variable} antialiased`}>
      <body className="font-secondary bg-[#0A0B0C]">
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#2C2D31',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#4ECDC4',
                  secondary: '#2C2D31',
                },
              },
              error: {
                iconTheme: {
                  primary: '#FF6B6B',
                  secondary: '#2C2D31',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
