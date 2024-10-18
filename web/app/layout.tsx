import type { Metadata } from "next";
import "./globals.css";
import { MapProvider } from "@/context/map_context";
import { AuthProvider } from "@/context/auth_context";

export const metadata: Metadata = {
  title: "THEME MAP",
  description: "USER MAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <MapProvider>
          <body
          >
            {children}
          </body>
        </MapProvider>
      </AuthProvider>
    </html>
  );
}
