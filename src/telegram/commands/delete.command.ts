import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

export async function deleteCommand(
    msg: Message
) {
    const text = msg.text;

    if (!text) return;

    // ===============================
    // DELETE HELP
    // ===============================

    if (text === "/delete") {
        await bot.sendMessage(
            msg.chat.id,

            `🗑️ Delete Command

Send:

delete task_name

Example:
delete exam`
        );

        return true;
    }

    // ===============================
    // DELETE LOGIC
    // ===============================

    if (
        text
            .toLowerCase()
            .startsWith("delete ")
    ) {
        const taskName = text
            .replace(/delete /i, "")
            .trim();

        const client =
            await clientPromise;

        const db =
            client.db("studyReminder");

        const result = await db
            .collection("reminders")
            .deleteOne({
                chatId: msg.chat.id,

                title: {
                    $regex: taskName,

                    $options: "i",
                },
            });

        if (
            result.deletedCount === 0
        ) {
            await bot.sendMessage(
                msg.chat.id,
                "❌ Task not found."
            );

            return true;
        }

        await bot.sendMessage(
            msg.chat.id,

            `🗑️ Deleted task: ${taskName}`
        );

        return true;
    }

    return false;
}