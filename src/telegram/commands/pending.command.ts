import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import { getPendingReminders } from "@/repositories/reminder.repository";

export async function pendingCommand(
    msg: Message
) {
    const reminders =
        await getPendingReminders(
            msg.chat.id
        );

    if (reminders.length === 0) {
        await bot.sendMessage(
            msg.chat.id,
            "🎉 No pending tasks."
        );

        return;
    }

    let message =
        "⏳ Pending Tasks\n\n";

    reminders.forEach(
        (reminder, index) => {
            message += `${index + 1}. ${reminder.title
                }\n`;
        }
    );

    await bot.sendMessage(
        msg.chat.id,
        message
    );
}