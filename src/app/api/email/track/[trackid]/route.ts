import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ trackid: string }> }
) {
  try {
    const { trackid } = await params; // ✅ รอให้ params ถูก resolved ก่อนใช้งาน

    const { error } = await supabase
      .from("email_logs")
      .update({
        clicked_at: new Date().toISOString(),
        clicked_status: true,
      })
      .eq("trackid", trackid);

    if (error) {
      console.error("Update Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.redirect(`http://localhost:3000/email/track/${trackid}`);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
