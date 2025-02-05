// app/page.tsx
import { getAuthSession } from '../../utils/auth-utils';
import { redirect } from 'next/navigation';
import Dashboard from './components/Dashboard';


export default async function HomePage() {
    const session = await getAuthSession();

    if (!session) {
        redirect('/login-secret');
    }

    return (
   
       <Dashboard />
    );
}