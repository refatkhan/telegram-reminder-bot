import { NextResponse } from "next/server";
import { startTelegramBot } from "@/lib/startBot";

startTelegramBot();

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Telegram Bot is running continuously",
  });
}