// components/SendEmailPage.tsx
"use client";

import { useState } from "react";

export default function SendMultiEmailPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!file) {
      setErrorMessage("Please upload an Excel file.");
      return;
    }
  
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    setDuplicateEmails([]);
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("message", message);
  
    try {
      const res = await fetch("/api/email/bulk", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (res.ok) {
        if (data.duplicates && data.duplicates.length > 0) {
            setDuplicateEmails(data.duplicates);
            setErrorMessage("❌ Duplicate emails found. Please resolve them before sending.");
        } else {
            setSuccessMessage("✅ Emails sent successfully!");
        }
      } else {
        setErrorMessage(data.error || "❌ Failed to send emails.");
      }
    } catch (error) {
      setErrorMessage("❌ An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Send Bulk Phishing Emails</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Excel File</label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          {/* Subject Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
              rows={4}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Emails"
              )}
          </button>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {errorMessage}
            </div>
          )}
          {/* Duplicate Emails Warning */}
          {duplicateEmails.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
              <p className="font-semibold">⚠️ The following emails were skipped (duplicates):</p>
              <ul className="list-disc list-inside mt-2">
                {duplicateEmails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
         )}
        </form>
      </div>
    </div>
  );
}