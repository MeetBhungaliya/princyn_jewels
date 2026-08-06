"use server";

import nodemailer from "nodemailer";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const MAX_REQUESTS = 3; // Max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute

export type ActionState = {
  status: "idle" | "pending" | "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const email = formData.get("email")?.toString().trim();
    const botField = formData.get("bot_field")?.toString(); // Honeypot field

    // 1. Honeypot check: if filled, quietly succeed to fool the bot
    if (botField) {
      console.warn("Bot detected via honeypot field");
      return { status: "success", message: "Thank you for subscribing!" };
    }

    if (!email) {
      return { status: "error", message: "Email is required." };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        status: "error",
        message: "Please enter a valid email address.",
      };
    }

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (ip !== "unknown") {
      const now = new Date();
      const resetTime = new Date(now.getTime() + WINDOW_MS);

      const [existingRateLimit] = await db
        .select()
        .from(rateLimits)
        .where(eq(rateLimits.ip, ip));

      if (existingRateLimit) {
        if (now > existingRateLimit.resetAt) {
          // Reset window
          await db
            .update(rateLimits)
            .set({ count: 1, resetAt: resetTime })
            .where(eq(rateLimits.ip, ip));
        } else if (existingRateLimit.count >= MAX_REQUESTS) {
          // Rate limit exceeded
          console.warn(`Rate limit exceeded for IP: ${ip}`);
          return {
            status: "error",
            message: "Too many requests. Please try again later.",
          };
        } else {
          // Increment count
          await db
            .update(rateLimits)
            .set({ count: existingRateLimit.count + 1 })
            .where(eq(rateLimits.ip, ip));
        }
      } else {
        await db.insert(rateLimits).values({
          ip,
          count: 1,
          resetAt: resetTime,
        });
      }
    }

    // 3. Email Transport Setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const senderEmail = `"Princyn Jewels" <${process.env.SMTP_USER}>`;

    // 4. Send Admin Notification Email
    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #333; margin-top: 0;">New Newsletter Subscriber</h2>
        <p style="color: #555; line-height: 1.5;">You have a new subscriber for your Newsletter from Pricyn Jewels Website.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: senderEmail,
      to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER, // fallback to sender if NOTIFY_EMAIL missing
      subject: "New Newsletter Subscriber",
      html: adminHtml,
    });

    // 5. Send Welcome Email to Subscriber
    const subscriberHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; border: 1px solid #eaeaea; border-radius: 8px;">
        <h1 style="color: #111;">Welcome to Princyn Jewels! ✨</h1>
        <p style="color: #555; line-height: 1.6; font-size: 16px;">
          Thank you for subscribing to our newsletter. You're now on the list to receive our latest updates, exclusive offers, and jewelry inspiration directly to your inbox.
        </p>
        <div style="margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://princynjewels.com"}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
            Explore Our Collection
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          If you didn't subscribe to this list, you can safely ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: senderEmail,
      to: email,
      subject: "Welcome to our Newsletter!",
      html: subscriberHtml,
    });

    console.log("New subscriber processed:", email);

    return { status: "success", message: "Thank you for subscribing!" };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again later.",
    };
  }
}
