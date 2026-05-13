import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

export async function editCommand(
    msg: Message
) {
    const text = msg.text;

    if (!text) return false;

    // ===============================
    // EDIT HELP
    // ===============================

    if (text === "/edit") {
        await bot.sendMessage(
            msg.chat.id,

            `✏️ Edit Reminder

Examples:

edit exam tomorrow 5pm

edit meeting friday 8pm

edit class test next monday 10am`
        );

        return true;
    }

    // ===============================
    // EDIT LOGIC
    // ===============================

    if (
        text
            .toLowerCase()
            .startsWith("edit ")
    ) {
        const editText = text
            .replace(/edit /i, "")
            .trim();

        const client =
            await clientPromise;

        const db =
            client.db("studyReminder");

        const reminders = await db
            .collection("reminders")
            .find({
                chatId: msg.chat.id,

                completed: false,
            })
            .toArray();

        // FIND MATCHING REMINDER

        let matchedReminder =
            null;

        for (const reminder of reminders) {
            if (
                editText
                    .toLowerCase()
                    .includes(
                        reminder.title.toLowerCase()
                    )
            ) {
                matchedReminder =
                    reminder;

                break;
            }
        }

        // NO MATCH FOUND

        if (!matchedReminder) {
            await bot.sendMessage(
                msg.chat.id,

                "❌ Could not find matching reminder."
            );

            return true;
        }

        await bot.sendMessage(
            msg.chat.id,

            `✏️ Reminder editing feature is coming soon for:

📌 ${matchedReminder.title}`
        );

        return true;
    }

    return false;
}