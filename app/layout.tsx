import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "../components/layout/Providers";
import PWAInstallPrompt from "../components/layout/PWAInstallPrompt";

export const metadata: Metadata = {
    title: "DreamWeave Tales",
    description: "AI Storybook Generator",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "DreamWeave",
    },
};

export const viewport: Viewport = {
    themeColor: "#7c3aed",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    {children}
                    <PWAInstallPrompt />
                </Providers>
            </body>
        </html>
    );
}
