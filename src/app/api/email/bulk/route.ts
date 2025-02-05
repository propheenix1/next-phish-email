import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!file || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Read the Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract email addresses from the first column
    const emails = data
      .slice(1) // Skip the header row
      .map((row: any) => row[0]?.trim()) // Extract and trim email addresses
      .filter((email: string) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)); // Validate email format

    if (emails.length === 0) {
      return NextResponse.json({ error: "No valid email addresses found in the file" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Track duplicate emails
    const duplicateEmails: string[] = [];

    // Send emails to all addresses
    for (const email of emails) {
      // Check if the email already exists in Supabase
      const { data: existingEmail, error: fetchError } = await supabase
        .from("email_logs")
        .select("email")
        .eq("email", email)
        .single();

      if (existingEmail) {
        // If the email already exists, add it to the duplicates list
        duplicateEmails.push(email);
        continue; // Skip sending and logging this email
      }

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
        return NextResponse.json({ error: "Failed to insert into Supabase" }, { status: 500 });
      }
    }

    // If there are duplicate emails, return a warning
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