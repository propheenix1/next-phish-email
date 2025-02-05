import { NextResponse } from "next/server";
import { supabase } from '../../../lib/supabaseClient';
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { trackid } = await req.json();

    const { error } = await supabase
      .from("email_logs")
      .update({ 
        clicked_summit: new Date().toISOString(),
      })
      .eq("trackid", trackid);

    if (error) {
      console.error("Update Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "อัปเดตสำเร็จ!" }, { status: 200 });
  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}