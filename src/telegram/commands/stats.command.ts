import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import { getReminderStats } from "@/repositories/reminder.repository";

export async function statsCommand(
    msg: Message
) {
    const stats =
        await getReminderStats(
            msg.chat.id
        );

    const completionRate =
        stats.total > 0
            ? Math.round(
                (stats.completed /
                    stats.total) *
                100
            )
            : 0;

    await bot.sendMessage(
        msg.chat.id,

        `📊 Productivity Stats

📌 Total Tasks: ${stats.total}

✅ Completed: ${stats.completed}

⏳ Pending: ${stats.pending}

🚀 Completion Rate: ${completionRate}%`
    );
}