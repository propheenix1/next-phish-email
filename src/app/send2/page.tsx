// app/send2/page.tsx
import { getAuthSession } from '../../../utils/auth-utils';
import { redirect } from 'next/navigation';
import SendMultiEmailPage from '../components/SendMultiEmailPage';

export default async function Send2Page() {
    const session = await getAuthSession();

    if (!session) {
        redirect('/login-secret');
    }
    return (
       <SendMultiEmailPage />
    );
}