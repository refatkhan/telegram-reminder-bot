import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import { getTodayReminders } from "@/repositories/reminder.repository";

import { getPriorityEmoji } from "@/utils/getPriorityEmoji";

import { getCategoryEmoji } from "@/utils/getCategoryEmoji";

export async function todayCommand(
    msg: Message
) {
    const todayReminders =
        await getTodayReminders(
            msg.chat.id
        );

    if (todayReminders.length === 0) {
        await bot.sendMessage(
            msg.chat.id,
            "📭 No tasks scheduled for today."
        );

        return;
    }

    let message =
        "📅 Today's Tasks\n\n";

    todayReminders.forEach(
        (reminder, index) => {
            const reminderDate = new Date(
                reminder.reminderDate
            );

            message += `${index + 1}. ${getPriorityEmoji(
                reminder.priority || "medium"
            )} ${getCategoryEmoji(
                reminder.category || "personal"
            )} ${reminder.title}

⏰ ${reminderDate.toLocaleString()}

`;

            if (reminder.isOverdue) {
                message +=
                    "⚠️ Overdue Task\n\n";
            }
        }
    );

    message +=
        "🚀 Stay productive today!";

    await bot.sendMessage(
        msg.chat.id,
        message
    );
}