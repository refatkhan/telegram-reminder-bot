import dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

import "@/scheduler/reminderScheduler";
import "@/scheduler/cleanupScheduler";
import "@/scheduler/dailySummaryScheduler";

import bot from "@/lib/bot";
import clientPromise from "@/lib/mongodb";
import { parseReminderWithAI } from "@/lib/aiParser";

import { ObjectId } from "mongodb";

console.log("Telegram Bot Service Started");
bot.setMyCommands([
    {
        command: "today",
        description: "Show today's tasks",
    },

    {
        command: "all",
        description: "Show all reminders",
    },

    {
        command: "completed",
        description: "Show completed tasks",
    },

    {
        command: "stats",
        description: "Show productivity stats",
    },

    {
        command: "delete",
        description: "Delete a reminder",
    },

    {
        command: "help",
        description: "Show all commands",
    },
]);
// MESSAGE HANDLER

bot.on("message", async (msg) => {
    try {
        const text = msg.text;

        if (!text) return;
        if (text === "/today") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

            const reminders = await db
                .collection("reminders")
                .find({
                    chatId: msg.chat.id,
                    completed: false,
                })
                .sort({
                    reminderDate: 1,
                })
                .toArray();

            if (reminders.length === 0) {
                await bot.sendMessage(
                    msg.chat.id,
                    "📭 No active reminders found."
                );

                return;
            }

            let message = "📅 Today's Tasks\n\n";

            reminders.forEach((reminder, index) => {
                const reminderDate = new Date(
                    reminder.reminderDate
                );

                message += `${index + 1}. ${reminder.title
                    }\n⏰ ${reminderDate.toLocaleString()}\n\n`;
            });

            message += "🚀 Stay productive!";

            await bot.sendMessage(
                msg.chat.id,
                message
            );

            return;
        }

        if (text === "/all") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

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

            let message = "📋 All Reminders\n\n";

            reminders.forEach((reminder, index) => {
                const reminderDate = new Date(
                    reminder.reminderDate
                );

                message += `${index + 1}. ${reminder.title
                    }\n`;

                message += `⏰ ${reminderDate.toLocaleString()}\n`;

                message += `✅ ${reminder.completed
                    ? "Completed"
                    : "Pending"
                    }\n\n`;
            });

            await bot.sendMessage(
                msg.chat.id,
                message
            );

            return;
        }
        if (text === "/completed") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

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

            reminders.forEach((reminder, index) => {
                message += `${index + 1}. ${reminder.title
                    }\n`;
            });

            await bot.sendMessage(
                msg.chat.id,
                message
            );

            return;
        }
        if (text === "/stats") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

            const total = await db
                .collection("reminders")
                .countDocuments({
                    chatId: msg.chat.id,
                });

            const completed = await db
                .collection("reminders")
                .countDocuments({
                    chatId: msg.chat.id,
                    completed: true,
                });

            const pending =
                total - completed;

            const completionRate =
                total > 0
                    ? Math.round(
                        (completed / total) * 100
                    )
                    : 0;

            await bot.sendMessage(
                msg.chat.id,
                `📊 Productivity Stats

📌 Total Tasks: ${total}

✅ Completed: ${completed}

⏳ Pending: ${pending}

🚀 Completion Rate: ${completionRate}%`
            );

            return;
        }
        if (text === "/delete") {
            await bot.sendMessage(
                msg.chat.id,
                `🗑️ Delete Command

Send:

delete task_name

Example:
delete exam`
            );

            return;
        }
        if (
            text.toLowerCase().startsWith(
                "delete "
            )
        ) {
            const taskName = text
                .replace(/delete /i, "")
                .trim();

            const client = await clientPromise;

            const db = client.db("studyReminder");

            const result = await db
                .collection("reminders")
                .deleteOne({
                    chatId: msg.chat.id,

                    title: {
                        $regex: taskName,
                        $options: "i",
                    },
                });

            if (result.deletedCount === 0) {
                await bot.sendMessage(
                    msg.chat.id,
                    "❌ Task not found."
                );

                return;
            }

            await bot.sendMessage(
                msg.chat.id,
                `🗑️ Deleted task: ${taskName}`
            );

            return;
        }
        if (text === "/help") {
            await bot.sendMessage(
                msg.chat.id,
                `🤖 Available Commands

/today → Today's tasks

/all → All reminders

/completed → Completed tasks

/stats → Productivity stats

/delete → Delete reminder

/help → Show commands`
            );

            return;
        }

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