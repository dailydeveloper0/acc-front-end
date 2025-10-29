import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "ACC Admin Dashboard",
  description: "Admin for AI Sales Support Voice Agent"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
