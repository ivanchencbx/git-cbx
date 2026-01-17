import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as proposed
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "cbx.life - 慈贝瑆.生活",
    description: "Unified AI Platform for Life.",
};

import { AuthProvider } from "./auth-context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
