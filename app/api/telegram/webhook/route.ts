import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Roadmap } from '@/models/Roadmap';
import { getGeminiModel, generateContentWithRetry } from '@/lib/gemini';

// Function to send a message back via Telegram API
async function sendTelegramMessage(chatId: string | number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error("TELEGRAM_BOT_TOKEN is missing");
    return;
  }
  
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown" // Enables bold/italic formatting
      })
    });
  } catch(e) {
    console.error("Failed to send telegram reply:", e);
  }
}

export async function POST(req: Request) {
  try {
    console.log("Telegram Webhook Triggered");
    const body = await req.json();
    
    // Telegram sometimes sends edits or other updates, we only care about new text messages
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: "ignored" });
    }
    
    const chatId = body.message.chat.id;
    const incomingText = body.message.text;
    
    console.log(`Received Telegram message from ${chatId}: ${incomingText}`);
    
    await dbConnect();
    // Find the user by their Telegram Chat ID
    const user = await User.findOne({ telegramChatId: String(chatId) });
    
    if (!user) {
      await sendTelegramMessage(
        chatId, 
        "👋 Hello! I don't recognize this account. Please go to your **AI Career Prep Dashboard** and link your Telegram account first by entering this ID: `" + chatId + "`"
      );
      return NextResponse.json({ status: "unauthorized" });
    }
    
    // If user says /start or /help
    if (incomingText.startsWith('/start')) {
      await sendTelegramMessage(
        chatId, 
        `Welcome back, ${user.name}! 🚀 Your AI Career Prep Mentor is ready. How can I help you today?`
      );
      return NextResponse.json({ status: "started" });
    }
    
    // Build AI Context
    let userContext = `User Name: ${user.name}\nTarget Role: ${user.targetRole}\nCurrent Level: ${user.currentLevel}\nStreak: ${user.streak} days\n`;
    
    const roadmap = await Roadmap.findOne({ userId: user._id as any, status: 'active' });
    if (roadmap) {
      userContext += `They are following a ${user.goalTimeline} roadmap.\n`;
    }
    
    const prompt = `
You are an expert AI Placement Mentor named "Guide" communicating via Telegram.
Keep your answers concise, helpful, and highly readable on a mobile device. Use Markdown bullet points and emojis.

Student Context:
${userContext}

Student's Message: "${incomingText}"
`;
      
    // Use the global API key for webhooks
    const text = await generateContentWithRetry(prompt, process.env.GEMINI_API_KEY || undefined);
    
    await sendTelegramMessage(chatId, text);
    
    return NextResponse.json({ status: "success" });
    
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
