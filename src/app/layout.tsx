import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Phishing Email Webapp",
  description: "Phishing Email Webapp",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>
        {children} {/* ✅ TaskMenu อยู่แค่ใน (taskbar) แล้ว ไม่ต้องใส่ที่นี่ */}
      </body>
    </html>
  );
}
