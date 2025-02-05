"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const params = useParams(); // ดึง params จาก URL
  const trackid = params.trackid as string;
  const [loading, setLoading] = useState(false);
  const [inputValues, setInputValues] = useState({
    additionalInfo1: "",
    additionalInfo2: "",
    additionalInfo3: "",
    additionalInfo4: "",
  });

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
      } catch (error) {
        result = null; // ป้องกัน Error ถ้า API ไม่คืนค่า JSON
      }

      if (!response.ok) {
        alert(`เกิดข้อผิดพลาด: ${result?.error || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"}`);
        setLoading(false);
        return;
      }

      alert(result?.message || "✅อัปเดตสำเร็จ!");

      // Reset input fields after successful submission
      setInputValues({
        additionalInfo1: "",
        additionalInfo2: "",
        additionalInfo3: "",
        additionalInfo4: "",
      });

      router.push(`http://localhost:3000/email/track/${trackid}`);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("❌เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          กรอกข้อมูลเพิ่มเติม
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Fields */}
          <div>
            <label htmlFor="additionalInfo1" className="block text-sm font-medium text-gray-700">
              ข้อมูลเพิ่มเติม 1 (ไม่บังคับ)
            </label>
            <input
              type="text"
              id="additionalInfo1"
              name="additionalInfo1"
              value={inputValues.additionalInfo1}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="กรอกข้อมูลเพิ่มเติม..."
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="additionalInfo2" className="block text-sm font-medium text-gray-700">
              ข้อมูลเพิ่มเติม 2 (ไม่บังคับ)
            </label>
            <input
              type="text"
              id="additionalInfo2"
              name="additionalInfo2"
              value={inputValues.additionalInfo2}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="กรอกข้อมูลเพิ่มเติม..."
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="additionalInfo3" className="block text-sm font-medium text-gray-700">
              ข้อมูลเพิ่มเติม 3 (ไม่บังคับ)
            </label>
            <input
              type="text"
              id="additionalInfo3"
              name="additionalInfo3"
              value={inputValues.additionalInfo3}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="กรอกข้อมูลเพิ่มเติม..."
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="additionalInfo4" className="block text-sm font-medium text-gray-700">
              ข้อมูลเพิ่มเติม 4 (ไม่บังคับ)
            </label>
            <input
              type="text"
              id="additionalInfo4"
              name="additionalInfo4"
              value={inputValues.additionalInfo4}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="กรอกข้อมูลเพิ่มเติม..."
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังบันทึก..." : "ยืนยัน"}
          </button>
        </form>
      </div>
    </div>
  );
}