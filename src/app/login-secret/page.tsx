// app/login-secret/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginSecretPage() {
    const router = useRouter();
    const [secretID, setSecretId] = useState('');
    const [secretPassword, setSecretPassword] = useState('');
    const [secretUserName, setSecretUserName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');


         // ใช้ signIn ของ NextAuth เพื่อตรวจสอบข้อมูลและสร้าง session
        const result = await signIn('credentials', {
             secretId: secretID,
             secretPassword: secretPassword,
             secretUserName: secretUserName,
             redirect: false, // ไม่ redirect ทันที
        });
        
        if (result?.error) {
            setError(result.error);
             return;
        }
        setSuccess('Login successful! Redirecting...');

        // รอ 1 วินาทีแล้ว redirect
        setTimeout(() => {
             router.push('/');
        }, 1000);

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login Secret</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            <div className="mb-4">
                <label htmlFor="secretId" className="block text-sm font-medium text-gray-700">
                Secret ID
                </label>
                <input
                type="text"
                id="secretId"
                value={secretID}
                onChange={(e) => setSecretId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="secretPassword" className="block text-sm font-medium text-gray-700">
                Secret Password
                </label>
                <input
                type="password"
                id="secretPassword"
                value={secretPassword}
                onChange={(e) => setSecretPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="secretUserName" className="block text-sm font-medium text-gray-700">
                Secret User Name
                </label>
                <input
                type="text"
                id="secretUserName"
                value={secretUserName}
                onChange={(e) => setSecretUserName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Submit
            </button>
            </form>
        </div>
    );
}