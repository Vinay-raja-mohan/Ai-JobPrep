import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/models/User";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: Request) {
  try {
    const { email, date, time, topic } = await req.json();

    if (!email || !date || !time || !topic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send Telegram notification if available
    if (user.telegramChatId) {
      const msg = `📅 <b>Demo Session Booked!</b>\n\nHi ${user.name}! Your demo session has been confirmed.\n\n🎯 <b>Topic:</b> ${topic}\n📆 <b>Date:</b> ${date}\n⏰ <b>Time:</b> ${time}\n💼 <b>Career Goal:</b> ${user.targetRole || "Not set"}\n\nOur mentor will guide you through everything you need to know about your career path. Stay prepared! 🚀`;
      await sendTelegramMessage(user.telegramChatId, msg);
    }

    return NextResponse.json({
      success: true,
      message: "Demo session booked successfully!",
      telegramSent: !!user.telegramChatId,
    });

  } catch (error: any) {
    console.error("Demo Booking Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to book demo session" },
      { status: 500 }
    );
  }
}
