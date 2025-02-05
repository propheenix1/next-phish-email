import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

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
