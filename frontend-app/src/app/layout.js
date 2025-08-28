"use client";

import { CssBaseline } from "@mui/material";
import ThemeCustomization from "./themes";
import { AuthProvider } from "./provider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ThemeCustomization>
          <AuthProvider>
            <CssBaseline />
            {children}
          </AuthProvider>
        </ThemeCustomization>
      </body>
    </html>
  );
}
