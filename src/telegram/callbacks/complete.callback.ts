import { CallbackQuery } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

export async function completeCallback(
    query: CallbackQuery
) {
    if (!query.data) return false;

    const [action, reminderId] =
        query.data.split("_");

    if (action !== "complete") {
        return false;
    }

    const client = await clientPromise;

    const db = client.db("studyReminder");

    async function removeButtons() {
        if (!query.message) return;

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

    const reminder = await db
        .collection("reminders")
        .findOne({
            _id: new ObjectId(reminderId),
        });

    // already completed

    if (reminder?.completed) {
        await bot.answerCallbackQuery(
            query.id,
            {
                text: "✅ Already completed",
            }
        );

        return true;
    }

    await db.collection("reminders").updateOne(
        {
            _id: new ObjectId(reminderId),
        },
        {
            $set: {
                completed: true,
            },
        }
    );

    await removeButtons();

    await bot.answerCallbackQuery(query.id, {
        text: "✅ Reminder Completed",
    });

    if (query.message) {
        await bot.sendMessage(
            query.message.chat.id,
            "🎉 Great! Reminder marked as completed."
        );
    }

    return true;
}