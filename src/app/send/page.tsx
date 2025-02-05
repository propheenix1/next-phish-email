// app/send/page.tsx
import { getAuthSession } from '../../../utils/auth-utils';
import { redirect } from 'next/navigation';
import SendEmailPage from '../components/SendEmailPage';

export default async function SendPage() {
    const session = await getAuthSession();

    if (!session) {
        redirect('/login-secret');
    }
    return (
        <SendEmailPage/>
    );
}