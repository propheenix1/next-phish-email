// components/SignOutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login-secret' });
    };

    return (
        <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
            Sign Out
        </button>
    );
}