import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { trackid: string } }
) {
  try {
    const { trackid } = params;

    const { data, error } = await supabase
      .from("email_logs")
      .update({
        clicked_at: new Date().toISOString(),
        clicked_status: true,
      })
      .eq("trackid", trackid)
      .select();

    if (error) {
      console.error("Update Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Track ID not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;

    return NextResponse.redirect(`${baseUrl}/email/track/${trackid}`);
  } catch (err) {
    console.error("Unexpected Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
