"use client";

import { CssBaseline } from "@mui/material";
import ThemeCustomization from "./themes";
import { AuthProvider } from "./provider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <ThemeCustomization>
            <CssBaseline />
            {children}
          </ThemeCustomization>
        </AuthProvider>
      </body>
    </html>
  );
}
