import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import { getReminderStats } from "@/repositories/reminder.repository";

export async function streakCommand(
    msg: Message
) {
    const stats =
        await getReminderStats(
            msg.chat.id
        );

    await bot.sendMessage(
        msg.chat.id,

        `🔥 Productivity Streak

You've completed ${stats.completed} tasks so far!

Keep going 🚀`
    );
}