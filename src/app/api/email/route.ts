import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the email already exists in Supabase
    const { data: existingEmail, error: fetchError } = await supabase
      .from("email_logs")
      .select("email")
      .eq("email", email)
      .single();

    if (fetchError) {
      console.error("Error fetching email:", fetchError.message);
      return NextResponse.json({ error: "Database query failed" }, { status: 500 });
    }

    if (existingEmail) {
      return NextResponse.json({ error: "Duplicate email found" }, { status: 400 });
    }

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const trackid = Math.random().toString(36).substring(7);
    const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/track/${trackid}`;

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `<p>${message}</p><p><a href="${trackingUrl}">คลิกที่นี่เพื่อติดตาม</a></p>`,
    };

    await transporter.sendMail(emailOptions);

    // Log the email in Supabase
    const { error: insertError } = await supabase
      .from("email_logs")
      .insert([{ email, trackid, status: "sent" }])
      .single();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError.message);
      return NextResponse.json({ error: "Failed to log email in database" }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
