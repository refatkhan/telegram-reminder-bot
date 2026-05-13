import { CallbackQuery } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

export async function snoozeCallback(
    query: CallbackQuery
) {
    if (!query.data) return false;

    const [action, reminderId] =
        query.data.split("_");

    if (action !== "snooze") {
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

    if (!reminder) {
        return true;
    }

    // already completed

    if (reminder.completed) {
        await bot.answerCallbackQuery(
            query.id,
            {
                text: "✅ Task already completed",
            }
        );

        return true;
    }

    const newDate = new Date(
        reminder.reminderDate
    );

    newDate.setMinutes(
        newDate.getMinutes() + 30
    );

    await db.collection("reminders").updateOne(
        {
            _id: new ObjectId(reminderId),
        },
        {
            $set: {
                reminderDate: newDate,

                lastReminderSent: null,
            },
        }
    );

    await removeButtons();

    await bot.answerCallbackQuery(query.id, {
        text: "⏰ Reminder Snoozed 30 Minutes",
    });

    if (query.message) {
        await bot.sendMessage(
            query.message.chat.id,

            `⏰ Reminder Snoozed

New Reminder Time:
${newDate.toLocaleString()}`
        );
    }

    return true;
}