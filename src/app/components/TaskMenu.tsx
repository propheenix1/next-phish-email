"use client";

import Link from "next/link";
import { FaPaperPlane, FaFileExcel, FaThLarge, FaUserCircle } from 'react-icons/fa';
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Session } from "next-auth"; // ✅ Import Session

interface TaskMenuProps {
  session: Session | null; // ✅ ใช้ Session แทน any
}

export default function TaskMenu({ session }: TaskMenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  return (
    <div className="fixed bottom-0 left-0 p-4">
      <div className="flex flex-col space-y-4">
        {isLoggedIn ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 flex items-center justify-center"
          >
            <FaUserCircle className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-purple-900 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200 flex items-center justify-center"
          >
            <FaUserCircle className="w-6 h-6" />
          </button>
        )}

        <Link
          href="/"
          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-200 flex items-center justify-center"
        >
          <FaThLarge className="w-6 h-6" />
        </Link>

        <Link
          href="/send"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 flex items-center justify-center"
        >
          <FaPaperPlane className="w-6 h-6" />
        </Link>

        <Link
          href="/send2"
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 flex items-center justify-center"
        >
          <FaFileExcel className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
