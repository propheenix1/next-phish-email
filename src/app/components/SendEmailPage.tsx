// components/SendEmailPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SendEmailPage() {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();

       if (!email || !subject || !message) {
         setErrorMessage("Please fill in all fields.");
         return;
       }

       setLoading(true);
       setSuccessMessage(null);
       setErrorMessage(null);

       try {
         const res = await fetch("/api/email", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ email, subject, message }),
         });

         const data = await res.json();

         if (res.ok) {
           setSuccessMessage("✅ Email sent successfully!");
            setTimeout(() => {
               router.push("/");
             }, 1000); 
           
         } else {
           setErrorMessage(data.error || "❌ Failed to send email.");
         }
       } catch (error) {
        console.log(error)
         setErrorMessage("❌ An unexpected error occurred.");
       } finally {
         setLoading(false);
       }
    };

   return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
         <h1 className="text-2xl font-semibold text-center mb-4">Send Phishing Email</h1>
         <form onSubmit={handleSubmit} className="space-y-4">
           {/* Email Input */}
           <div>
             <label className="block text-sm font-medium text-gray-700">Email</label>
             <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter recipient's email"
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
             className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed"
           >
             {loading ? "Sending..." : "Send Email"}
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
         </form>
       </div>
     </div>
   );
}