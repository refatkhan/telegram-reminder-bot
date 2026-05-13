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
        description: "📅 Show today's tasks",
    },

    {
        command: "all",
        description: "📋 Show all reminders",
    },

    {
        command: "completed",
        description: "✅ Show completed tasks",
    },

    {
        command: "pending",
        description: "⏳ Show pending tasks",
    },

    {
        command: "important",
        description: "🚨 Show important tasks",
    },
    {
        command: "edit",
        description: "✏️ Edit reminder",
    },
    {
        command: "summary",
        description: "📝 Show task summary",
    },

    {
        command: "calendar",
        description: "🗓️ Show upcoming schedule",
    },

    {
        command: "stats",
        description: "📊 Show productivity stats",
    },

    {
        command: "streak",
        description: "🔥 Show productivity streak",
    },

    {
        command: "focus",
        description: "🎯 Show next important task",
    },

    {
        command: "motivation",
        description: "🚀 Get motivational message",
    },

    {
        command: "delete",
        description: "🗑️ Delete a reminder",
    },

    {
        command: "settings",
        description: "⚙️ Bot settings",
    },

    {
        command: "help",
        description: "🤖 Show all commands",
    },
]);
// MESSAGE HANDLER
function getCategoryEmoji(
    category: string
) {
    switch (category) {
        case "study":
            return "📚";

        case "work":
            return "💼";

        case "health":
            return "🏃";

        case "finance":
            return "💰";

        case "meeting":
            return "🤝";

        case "travel":
            return "✈️";

        case "shopping":
            return "🛒";

        default:
            return "🏠";
    }
}
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
        if (text === "/pending") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

            const reminders = await db
                .collection("reminders")
                .find({
                    chatId: msg.chat.id,
                    completed: false,
                })
                .toArray();

            if (reminders.length === 0) {
                await bot.sendMessage(
                    msg.chat.id,
                    "🎉 No pending tasks."
                );

                return;
            }

            let message = "⏳ Pending Tasks\n\n";

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
        if (text === "/important") {
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
                .limit(3)
                .toArray();

            if (reminders.length === 0) {
                await bot.sendMessage(
                    msg.chat.id,
                    "📭 No important tasks."
                );

                return;
            }

            let message =
                "🚨 Important Upcoming Tasks\n\n";

            reminders.forEach((reminder, index) => {
                const reminderDate = new Date(
                    reminder.reminderDate
                );

                message += `${index + 1}. ${reminder.title
                    }\n`;

                message += `⏰ ${reminderDate.toLocaleString()}\n\n`;
            });

            await bot.sendMessage(
                msg.chat.id,
                message
            );

            return;
        }
        if (text === "/summary") {
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

            await bot.sendMessage(
                msg.chat.id,
                `📝 Task Summary

📌 Total Tasks: ${total}

✅ Completed: ${completed}

⏳ Pending: ${pending}`
            );

            return;
        }
        if (text === "/calendar") {
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
                .limit(10)
                .toArray();

            if (reminders.length === 0) {
                await bot.sendMessage(
                    msg.chat.id,
                    "📭 No scheduled tasks."
                );

                return;
            }

            let message =
                "🗓️ Upcoming Schedule\n\n";

            reminders.forEach((reminder, index) => {
                const reminderDate = new Date(
                    reminder.reminderDate
                );

                message += `${index + 1}. ${reminder.title
                    }\n`;

                message += `⏰ ${reminderDate.toLocaleString()}\n\n`;
            });

            await bot.sendMessage(
                msg.chat.id,
                message
            );

            return;
        }
        if (text === "/streak") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

            const completed = await db
                .collection("reminders")
                .countDocuments({
                    chatId: msg.chat.id,
                    completed: true,
                });

            await bot.sendMessage(
                msg.chat.id,
                `🔥 Productivity Streak

You've completed ${completed} tasks so far!

Keep going 🚀`
            );

            return;
        }
        if (text === "/focus") {
            const client = await clientPromise;

            const db = client.db("studyReminder");

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

📌${getCategoryEmoji(reminder.category)} ${reminder.title}

⏰ ${new Date(
                    reminder.reminderDate
                ).toLocaleString()}`
            );

            return;
        }
        if (text === "/motivation") {
            const messages = [
                "🚀 Small progress is still progress.",
                "🔥 Stay focused and keep pushing.",
                "🎯 Discipline beats motivation.",
                "💡 Your future self will thank you.",
                "📚 Consistency creates success.",
            ];

            const random =
                messages[
                Math.floor(
                    Math.random() * messages.length
                )
                ];

            await bot.sendMessage(
                msg.chat.id,
                random
            );

            return;
        }
        if (text === "/settings") {
            await bot.sendMessage(
                msg.chat.id,
                `⚙️ Settings

Coming soon:

🌍 Timezone Settings
🔔 Reminder Frequency
🎨 Theme Customization
🧠 AI Preferences`
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
        // ===============================
        // EDIT COMMAND
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

            return;
        }

        // ===============================
        // EDIT REMINDER LOGIC
        // ===============================

        if (
            text.toLowerCase().startsWith("edit ")
        ) {
            const editText = text
                .replace(/edit /i, "")
                .trim();

            const client = await clientPromise;

            const db = client.db("studyReminder");

            const reminders = await db
                .collection("reminders")
                .find({
                    chatId: msg.chat.id,

                    completed: false,
                })
                .toArray();

            // FIND MATCHING REMINDER

            let matchedReminder = null;

            for (const reminder of reminders) {
                if (
                    editText
                        .toLowerCase()
                        .includes(
                            reminder.title.toLowerCase()
                        )
                ) {
                    matchedReminder = reminder;

                    break;
                }
            }

            // NO MATCH FOUND

            if (!matchedReminder) {
                await bot.sendMessage(
                    msg.chat.id,
                    "❌ Could not find matching reminder."
                );

                return;
            }

            // PARSE NEW DATE

            const parsed =
                await parseReminderWithAI(editText);

            // INVALID DATE

            if (!parsed?.date) {
                await bot.sendMessage(
                    msg.chat.id,
                    "❌ Could not understand new reminder time."
                );

                return;
            }

            // UPDATE REMINDER

            await db.collection("reminders").updateOne(
                {
                    _id: matchedReminder._id,
                },
                {
                    $set: {
                        reminderDate: new Date(
                            parsed.date
                        ),

                        lastReminderSent: null,

                        eventStarted: false,
                    },
                }
            );

            await bot.sendMessage(
                msg.chat.id,
                `✏️ Reminder Updated

📌 ${matchedReminder.title}

⏰ ${parsed.date}`
            );

            console.log(
                "Reminder Updated:",
                matchedReminder.title
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

            category:
                parsed.category || "personal",

            originalText: text,

            reminderDate: new Date(parsed.date),

            completed: false,

            isOverdue: false,
            eventStarted: false,
            lastReminderSent: new Date(),
            reminderCount: 0,
            isRecurring:
                parsed.isRecurring || false,

            recurringType:
                parsed.recurringType || null,

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
        // ===============================
        // DELETE REMINDER
        // ===============================

        if (action === "delete") {
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

                return;
            }

            // DELETE FROM DATABASE

            await db.collection("reminders").deleteOne(
                {
                    _id: new ObjectId(reminderId),
                }
            );

            // REMOVE BUTTONS FROM OLD MESSAGE

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

            // SUCCESS POPUP

            await bot.answerCallbackQuery(
                query.id,
                {
                    text: "🗑️ Reminder Deleted",
                }
            );

            // SUCCESS MESSAGE

            await bot.sendMessage(
                query.message!.chat.id,
                `🗑️ Reminder Deleted

📌 ${reminder.title}`
            );

            console.log(
                "Reminder Deleted:",
                reminder.title
            );

            return;
        }
    } catch (error) {
        console.log("Callback Error:", error);
    }
});