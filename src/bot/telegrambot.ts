import dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

import "@/scheduler/reminderScheduler";

import bot from "@/lib/bot";
import clientPromise from "@/lib/mongodb";
import { parseReminderWithAI } from "@/lib/aiParser";

import { ObjectId } from "mongodb";

console.log("Telegram Bot Service Started");

// MESSAGE HANDLER

bot.on("message", async (msg) => {
    try {
        const text = msg.text;

        if (!text) return;

        console.log("Message:", text);

        await bot.sendMessage(
            msg.chat.id,
            "⏳ Processing your reminder..."
        );

        const parsed = await parseReminderWithAI(text);

        console.log("Parsed:", parsed);

        if (!parsed || !parsed.date) {
            await bot.sendMessage(
                msg.chat.id,
                "❌ Could not understand reminder."
            );

            return;
        }

        const client = await clientPromise;

        const db = client.db("studyReminder");

        await db.collection("reminders").insertOne({
            chatId: msg.chat.id,
            title: parsed.title,
            originalText: text,
            reminderDate: new Date(parsed.date),
            completed: false,
            eventStarted: false,
            lastReminderSent: new Date(),
            reminderCount: 0,
            createdAt: new Date(),
        });

        await bot.sendMessage(
            msg.chat.id,
            `✅ Reminder Saved

📌 ${parsed.title}

⏰ ${parsed.date}`
        );
    } catch (error) {
        console.log("BOT ERROR:", error);

        await bot.sendMessage(
            msg.chat.id,
            "❌ Something went wrong."
        );
    }
});

// BUTTON HANDLER

bot.on("callback_query", async (query) => {
    try {
        if (!query.data) return;

        const client = await clientPromise;

        const db = client.db("studyReminder");

        const [action, reminderId] =
            query.data.split("_");

        // REMOVE BUTTONS FUNCTION

        async function removeButtons() {
            await bot.editMessageReplyMarkup(
                {
                    inline_keyboard: [],
                },
                {
                    chat_id: query.message!.chat.id,
                    message_id:
                        query.message!.message_id,
                }
            );
        }

        // ✅ COMPLETE

        if (action === "complete") {
            const reminder =
                await db.collection("reminders").findOne(
                    {
                        _id: new ObjectId(reminderId),
                    }
                );

            // already completed
            if (reminder?.completed) {
                await bot.answerCallbackQuery(
                    query.id,
                    {
                        text: "✅ Already completed",
                    }
                );

                return;
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

            await bot.sendMessage(
                query.message!.chat.id,
                "🎉 Great! Reminder marked as completed."
            );
        }

        // ⏰ SNOOZE

        if (action === "snooze") {
            const reminder =
                await db.collection("reminders").findOne(
                    {
                        _id: new ObjectId(reminderId),
                    }
                );

            if (!reminder) {
                return;
            }

            // already completed
            if (reminder.completed) {
                await bot.answerCallbackQuery(
                    query.id,
                    {
                        text: "✅ Task already completed",
                    }
                );

                return;
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

            await bot.sendMessage(
                query.message!.chat.id,
                `⏰ Reminder Snoozed

New Reminder Time:
${newDate.toLocaleString()}`
            );
        }

        // ❌ PENDING

        if (action === "pending") {
            const reminder =
                await db.collection("reminders").findOne(
                    {
                        _id: new ObjectId(reminderId),
                    }
                );

            if (!reminder) {
                return;
            }

            // already completed
            if (reminder.completed) {
                await bot.answerCallbackQuery(
                    query.id,
                    {
                        text: "✅ Task already completed",
                    }
                );

                return;
            }

            await removeButtons();

            await bot.answerCallbackQuery(query.id, {
                text: "📌 Reminder Still Active",
            });

            await bot.sendMessage(
                query.message!.chat.id,
                "📌 Okay! Reminder will continue."
            );
        }
    } catch (error) {
        console.log("Callback Error:", error);
    }
});