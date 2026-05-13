import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { getPriorityEmoji } from "@/utils/getPriorityEmoji";

import { getCategoryEmoji } from "@/utils/getCategoryEmoji";

export async function focusCommand(
    msg: Message
) {
    const client = await clientPromise;

    const db = client.db(
        "studyReminder"
    );

    const reminder = await db
        .collection("reminders")
        .find({
            chatId: msg.chat.id,

            completed: false,
        })
        .sort({
            reminderDate: 1,
        })
        .limit(1)
        .next();

    if (!reminder) {
        await bot.sendMessage(
            msg.chat.id,
            "🎉 No pending tasks."
        );

        return;
    }

    await bot.sendMessage(
        msg.chat.id,

        `🎯 Focus Task

${getPriorityEmoji(
    reminder.priority || "medium"
)} ${getCategoryEmoji(
    reminder.category || "personal"
)}

📌 ${reminder.title}

⏰ ${new Date(
    reminder.reminderDate
).toLocaleString()}`
    );
}