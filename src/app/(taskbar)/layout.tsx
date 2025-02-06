//(taskbar)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth"; // ✅ Import authOptions ให้ถูก path
import TaskMenu from "../components/TaskMenu";

export default async function TaskbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // ✅ ดึง session มาใช้

  return (
    <div>
      <TaskMenu session={session} /> {/* ✅ ส่ง session ไปให้ TaskMenu */}
      <main>{children}</main>
    </div>
  );
}
