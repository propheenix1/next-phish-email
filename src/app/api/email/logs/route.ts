import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// API สำหรับดึงข้อมูล email_logs
export async function GET() {
  try {
    const { data, error } = await supabase.from("email_logs").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
