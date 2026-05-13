import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

export async function completedCommand(
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

            completed: true,
        })
        .toArray();

    if (reminders.length === 0) {
        await bot.sendMessage(
            msg.chat.id,
            "📭 No completed reminders."
        );

        return;
    }

    let message =
        "✅ Completed Tasks\n\n";

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