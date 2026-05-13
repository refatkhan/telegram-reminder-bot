import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { getPriorityEmoji } from "@/utils/getPriorityEmoji";

import { getCategoryEmoji } from "@/utils/getCategoryEmoji";

export async function allCommand(
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
        })
        .sort({
            reminderDate: 1,
        })
        .toArray();

    if (reminders.length === 0) {
        await bot.sendMessage(
            msg.chat.id,
            "📭 No reminders found."
        );

        return;
    }

    let message =
        "📋 All Reminders\n\n";

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

            message += `⏰ ${reminderDate.toLocaleString()}\n`;

            message += `✅ ${
                reminder.completed
                    ? "Completed"
                    : "Pending"
            }\n\n`;
        }
    );

    await bot.sendMessage(
        msg.chat.id,
        message
    );
}