import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

export async function helpCommand(
    msg: Message
) {
    await bot.sendMessage(
        msg.chat.id,

        `🤖 Available Commands

📅 /today → Today's tasks

📋 /all → All reminders

✅ /completed → Completed tasks

⏳ /pending → Pending tasks

🚨 /important → Important tasks

🗓️ /calendar → Upcoming schedule

📝 /summary → Task summary

📊 /stats → Productivity stats

🔥 /streak → Productivity streak

🎯 /focus → Next important task

✏️ /edit → Edit reminder

🗑️ /delete → Delete reminder

🚀 /motivation → Motivation

⚙️ /settings → Bot settings`
    );
}