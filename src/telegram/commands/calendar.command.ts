import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { getPriorityEmoji } from "@/utils/getPriorityEmoji";

import { getCategoryEmoji } from "@/utils/getCategoryEmoji";

export async function calendarCommand(
    msg: Message
) {
    const client = await clientPromise;

    const db = client.db(
        "studyReminder"
    );

    const reminders = await db
        .collection("reminders")
        .find({
            chatId: msg.chat.id,

            completed: false,
        })
        .sort({
            reminderDate: 1,
        })
        .limit(10)
        .toArray();

    if (reminders.length === 0) {
        await bot.sendMessage(
            msg.chat.id,
            "📭 No scheduled tasks."
        );

        return;
    }

    let message =
        "🗓️ Upcoming Schedule\n\n";

    reminders.forEach(
        (reminder, index) => {
            const reminderDate = new Date(
                reminder.reminderDate
            );

            message += `${index + 1}. ${getPriorityEmoji(
                reminder.priority || "medium"
            )} ${getCategoryEmoji(
                reminder.category || "personal"
            )} ${reminder.title}\n`;

            message += `⏰ ${reminderDate.toLocaleString()}\n\n`;
        }
    );

    await bot.sendMessage(
        msg.chat.id,
        message
    );
}