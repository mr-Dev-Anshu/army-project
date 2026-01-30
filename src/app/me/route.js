import { getCurrentUser } from '@/lib/getCurrentUser';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}