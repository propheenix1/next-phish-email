import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import "./globals.css";

import TaskMenu from "./components/TaskMenu";

// ใช้ Kanit เท่านั้น
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Phishing Email Webapp",
  description: "Phishing Email Webapp",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions); // ดึง session ฝั่งเซิร์ฟเวอร์

  return (
    <html lang="en">
      <body className={`${kanit.variable} antialiased`}>
        {children}
        <TaskMenu session={session} /> {/* ส่ง session ไปที่ TaskMenu */}
      </body>
    </html>
  );
}
