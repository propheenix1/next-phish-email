
import { NextResponse } from 'next/server';
import { supabase } from "../../lib/supabaseClient";

export async function POST(request: Request) {
  try {
    const { secretID } = await request.json();

    if (!secretID) {
      return NextResponse.json(
        { error: 'Secret User Name is required' },
        { status: 400 }
      );
    }

    // ตรวจสอบ Secret User Name จาก Supabase
    const { data, error } = await supabase
      .from('db_secret')
      .select('id')
      .eq('id', secretID)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid Secret User Name' },
        { status: 404 }
      );
    }

    // หากข้อมูลถูกต้อง
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('Error checking secret username:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}