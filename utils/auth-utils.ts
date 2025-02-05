// lib/auth-utils.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '../src/app/lib/auth';

export async function getAuthSession() {
  return await getServerSession(authOptions);
}