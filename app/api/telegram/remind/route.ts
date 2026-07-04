import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Roadmap } from '@/models/Roadmap';

async function sendTelegramMessage(chatId: string | number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is missing");
  
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    })
  });
  
  if (!res.ok) {
      const err = await res.text();
      throw new Error(`Telegram API Error: ${err}`);
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email });
    
    if (!user || !user.telegramChatId) {
      return NextResponse.json({ error: "User or Telegram Chat ID not found" }, { status: 404 });
    }

    const roadmap = await Roadmap.findOne({ userId: user._id as any, status: 'active' });
    if (!roadmap) {
      return NextResponse.json({ error: "No active roadmap found" }, { status: 404 });
    }

    // Find current task based on user streak / progress
    let currentTask = roadmap.months?.[0]?.weeks?.[0]?.dailyTasks?.[0]; // fallback
    if (!currentTask) {
      return NextResponse.json({ error: "No tasks found in roadmap" }, { status: 404 });
    }
    let found = false;
    
    for (const month of roadmap.months) {
      for (const week of month.weeks) {
        for (const day of week.dailyTasks) {
          const aptDone = day.resources?.includes("completed_aptitude");
          const dsaDone = day.resources?.includes("completed_dsa");
          const coreDone = day.resources?.includes("completed_core");
          
          if (!aptDone || !dsaDone || !coreDone) {
            currentTask = day;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    function formatTaskTitle(taskStr: string) {
      if (!taskStr) return "";
      const parts = taskStr.split(":");
      if (parts.length < 2) return taskStr;
      const topic = parts[0].trim();
      const subtopic = parts[1].split("-")[0].trim();
      return `${topic} - ${subtopic}`;
    }

    const messageBody = `
🚀 *AI Career Prep Mission: Day ${currentTask.day}* 🚀

Hi ${user.name.split(' ')[0]}! Here are your tasks for today to become a ${user.targetRole}:

🧠 *Aptitude*: ${formatTaskTitle(currentTask.aptitudeTask)}
💻 *DSA*: ${formatTaskTitle(currentTask.dsaTask)}
🛠️ *Core*: ${formatTaskTitle(currentTask.coreTask)}

Reply to this message if you need help from your AI Mentor! Let's get that streak to ${user.streak + 1} 🔥!
    `;

    await sendTelegramMessage(user.telegramChatId, messageBody.trim());

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Telegram Reminder Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
