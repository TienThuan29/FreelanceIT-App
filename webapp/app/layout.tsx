import type { Metadata } from "next";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { Inter, JetBrains_Mono } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
// import { ChatProvider } from "@/contexts/ChatContext";

const sans = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  display: 'swap',
  variable: '--font-sans',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400','500','600'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: "FreelanceIT",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body suppressHydrationWarning={true}>
      <Toaster position="top-right" />
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0069d1',
              },
            }}
          >
              <AuthProvider>
                <NavbarWrapper />
                <main>
                  {children}
                </main>
                <FooterWrapper />
              </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
