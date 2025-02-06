"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { GoTriangleDown } from "react-icons/go";
import { useRouter, useParams } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const params = useParams();
  const trackid = params?.trackid as string;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackid) {
      alert("Track ID ไม่ถูกต้อง");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/email/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackid }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        alert(`เกิดข้อผิดพลาด: ${result?.error || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"}`);
        return;
      }

      alert(result?.message || "✅ อัปเดตสำเร็จ!");
      router.push(`/email/track/${trackid}`);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-3/4 max-w-7xl h-96 rounded-3xl overflow-hidden mb-4">
        <div className="flex h-full">
          <div className="w-1/2 h-full p-9 bg-white">
            <div className="text-2xl font-bold mb-4">
              <FcGoogle className="w-[48px] h-[48px]" />
            </div>
            <div className="text-[36px] font-semibold mb-2">Sign in</div>
            <div className="text-gray-600 mb-6">
              with your Google Account. This account will be available to other Google apps in the browser.
            </div>
          </div>
          <div className="w-1/2 h-full p-9 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="mt-10">
                <input
                  type="email"
                  placeholder="Email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-5 w-full h-[50px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[50px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-10">
                <Link href="#" className="text-blue-600 hover:underline">
                  Forgot email?
                </Link>
              </div>
              <div className="text-gray-600 mb-6">
                Not your computer? Use Guest mode to sign in privately. {" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  Learn more about using Guest mode
                </Link>
              </div>
              <div className="flex justify-end gap-10 rounded-lg">
                <Link href="#" className="text-blue-600 hover:underline">
                  Create account
                </Link>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Next"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="w-3/4 max-w-7xl flex justify-between text-sm text-gray-600">
        <div className="flex gap-4">
          <Link href="#" className="hover:underline flex row-auto gap-10">
            English (United States) <GoTriangleDown className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="hover:underline">Help</Link>
          <Link href="#" className="hover:underline">Privacy</Link>
          <Link href="#" className="hover:underline">Terms</Link>
        </div>
      </div>
    </div>
  );
}
