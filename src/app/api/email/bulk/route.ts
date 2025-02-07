import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "../../../lib/supabaseClient";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!file || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // อ่านไฟล์ Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // ดึง email และ name จากไฟล์ Excel
    const emailData = data
      .slice(1) // ข้าม header row
      .map((row) => ({
        email: Array.isArray(row) && typeof row[0] === "string" ? row[0].trim() : "",
        name: Array.isArray(row) && typeof row[1] === "string" ? row[1].trim() : "ผู้ใช้", // Default "ผู้ใช้" ถ้าไม่มีค่า
      }))
      .filter((item) => item.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email));

    if (emailData.length === 0) {
      return NextResponse.json({ error: "No valid email addresses found in the file" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const duplicateEmails: string[] = [];

    for (const { email, name } of emailData) {
      // ตรวจสอบอีเมลซ้ำใน Supabase
      const { data: existingEmail } = await supabase
        .from("email_logs")
        .select("email")
        .eq("email", email)
        .single();

      if (existingEmail) {
        duplicateEmails.push(email);
        continue;
      }

      const trackid = Math.random().toString(36).substring(7);
      const trackingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email/track/${trackid}`;

      const emailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `<p>${message} เรียน คุณ${name}</p>\n
        \n
        <p>เนื่องจากมีความพยายามเข้าสู่ระบบที่ผิดปกติจากอุปกรณ์ที่ไม่รู้จัก ระบบของเราได้ทำการล็อกบัญชีของคุณชั่วคราวเพื่อความปลอดภัย กรุณายืนยันตัวตนของคุณโดยคลิกที่ลิงก์ด้านล่างเพื่อปลดล็อกบัญชี:</p> \n 
        <p><a href="${trackingUrl}">🔒 ยืนยันตัวตนของคุณ</a></p> \n 
        <p>หากคุณไม่ดำเนินการภายใน 24 ชั่วโมง บัญชีของคุณอาจถูกระงับชั่วคราวเพื่อป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต</p> \n
        \n
        <p>ขอแสดงความนับถือ,</p>\n
        <p>ฝ่ายสนับสนุนด้านความปลอดภัย</p> \n
        <p>National Vaccine Institute</p>`,
      };

      await transporter.sendMail(emailOptions);

      const { error: insertError } = await supabase
        .from("email_logs")
        .insert([{ email, name, trackid, status: "sent" }])
        .single();

      if (insertError) {
        console.error("Supabase Insert Error:", insertError.message);
        return NextResponse.json({ error: "Failed to insert into Supabase" }, { status: 500 });
      }
    }

    if (duplicateEmails.length > 0) {
      return NextResponse.json(
        {
          message: "Emails sent and logged successfully, but some duplicates were skipped",
          duplicates: duplicateEmails,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Emails sent and logged successfully" }, { status: 200 });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ message: "Error sending emails", error }, { status: 500 });
  }
}
