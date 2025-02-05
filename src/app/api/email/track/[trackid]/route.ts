import { NextResponse } from "next/server";
<<<<<<< HEAD
import { supabase } from "../../../../lib/supabaseClient";
=======
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
>>>>>>> ddefd0d082c76d6e4ed2f8b569b4bc3bdd2f73b0

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
