import type { Metadata } from "next";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { ChatProvider } from "@/contexts/ChatContext";

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
    <html lang="en">
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
              <ChatProvider>
                <NavbarWrapper />
                <main>
                  {children}
                </main>
              </ChatProvider>
              <FooterWrapper />
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
