import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from '../../lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { email, name, subject, message } = await req.json();

    if (!email || !name || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if the email already exists in Supabase
    const { data: existingEmail, error: fetchError } = await supabase
      .from("email_logs")
      .select("email, name")  // ดึงทั้ง email และ name จากฐานข้อมูล
      .eq("email", email)
      .maybeSingle(); 

    if (fetchError && fetchError.code !== "PGRST116") {
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL;

    const trackid = Math.random().toString(36).substring(7);
    const trackingUrl = `${baseUrl}/api/email/track/${trackid}`;

    // ใช้ชื่อจากฐานข้อมูลสำหรับ trackname
    const trackname = name;

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `<p>${message} เรียน คุณ${trackname}</p>\n
        \n
        <p>เนื่องจากมีความพยายามเข้าสู่ระบบที่ผิดปกติจากอุปกรณ์ที่ไม่รู้จัก ระบบของเราได้ทำการล็อกบัญชีของคุณชั่วคราวเพื่อความปลอดภัย กรุณายืนยันตัวตนของคุณโดยคลิกที่ลิงก์ด้านล่างเพื่อปลดล็อกบัญชี:</p> \n 
        <p><a href="${trackingUrl}">🔒 ยืนยันตัวตนของคุณ</a></p> \n 
        <p>หากคุณไม่ดำเนินการภายใน 24 ชั่วโมง บัญชีของคุณอาจถูกระงับชั่วคราวเพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต</p> \n
        \n
        \n
        <p>ขอแสดงความนับถือ,</p>\n
        <p>ฝ่ายสนับสนุนด้านความปลอดภัย</p> \n
        <p>National Vaccine Institute</p>`,
    };

    await transporter.sendMail(emailOptions);

    // Log the email in Supabase
    const { error: insertError } = await supabase
      .from("email_logs")
      .insert([{ email, name, trackid, status: "sent" }]);

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
