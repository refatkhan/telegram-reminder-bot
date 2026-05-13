import { CallbackQuery } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

export async function deleteCallback(
    query: CallbackQuery
) {
    if (!query.data) return false;

    const [action, reminderId] =
        query.data.split("_");

    if (action !== "delete") {
        return false;
    }

    const client = await clientPromise;

    const db = client.db("studyReminder");

    const reminder = await db
        .collection("reminders")
        .findOne({
            _id: new ObjectId(reminderId),
        });

    // REMINDER NOT FOUND

    if (!reminder) {
        await bot.answerCallbackQuery(
            query.id,
            {
                text: "❌ Reminder not found",
            }
        );

        return true;
    }

    // DELETE FROM DATABASE

    await db.collection("reminders").deleteOne(
        {
            _id: new ObjectId(reminderId),
        }
    );

    // REMOVE BUTTONS FROM OLD MESSAGE

    if (query.message) {
        await bot.editMessageReplyMarkup(
            {
                inline_keyboard: [],
            },
            {
                chat_id: query.message.chat.id,

                message_id:
                    query.message.message_id,
            }
        );
    }

    // SUCCESS POPUP

    await bot.answerCallbackQuery(
        query.id,
        {
            text: "🗑️ Reminder Deleted",
        }
    );

    // SUCCESS MESSAGE

    if (query.message) {
        await bot.sendMessage(
            query.message.chat.id,

            `🗑️ Reminder Deleted

📌 ${reminder.title}`
        );
    }

    console.log(
        "Reminder Deleted:",
        reminder.title
    );

    return true;
}