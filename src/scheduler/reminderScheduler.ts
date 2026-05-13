import cron from "node-cron";

import bot from "@/lib/bot";
import clientPromise from "@/lib/mongodb";

console.log("Reminder Scheduler Started");

cron.schedule("* * * * *", async () => {
    try {
        console.log("Checking reminders...");

        const client = await clientPromise;

        const db = client.db("studyReminder");

        const reminders = await db
            .collection("reminders")
            .find({
                completed: false,
            })
            .toArray();

        const now = new Date();

        for (const reminder of reminders) {
            let shouldSend = false;

            const reminderDate = new Date(
                reminder.reminderDate
            );

            const diffMs =
                reminderDate.getTime() - now.getTime();

            const diffHours =
                diffMs / (1000 * 60 * 60);

            const diffMinutes =
                diffMs / (1000 * 60);

            if (diffHours <= 0) {
                // EVENT START ALERT

                if (!reminder.eventStarted) {
                    await bot.sendMessage(
                        reminder.chatId,
                        `🚨 EVENT STARTED

📌 ${reminder.title}

Your scheduled event time has arrived.`
                    );

                    await db.collection("reminders").updateOne(
                        {
                            _id: reminder._id,
                        },
                        {
                            $set: {
                                eventStarted: true,
                            },
                        }
                    );
                    console.log(
                        "Event Started Alert Sent:",
                        reminder.title
                    );
                }
                continue;
            }
            let cooldownMinutes = 0;

            // 48h → 24h
            if (diffHours <= 48 && diffHours > 24) {
                cooldownMinutes = 360;
            }

            // 24h → 1h
            else if (
                diffHours <= 24 &&
                diffHours > 1
            ) {
                cooldownMinutes = 240;
            }

            // 1h → 0h
            else if (
                diffMinutes <= 60 &&
                diffMinutes > 0
            ) {
                cooldownMinutes = 5;
            }

            if (cooldownMinutes > 0) {
                if (!reminder.lastReminderSent) {
                    shouldSend = true;
                } else {
                    const lastSent = new Date(
                        reminder.lastReminderSent
                    );

                    const minutesSinceLast =
                        (now.getTime() -
                            lastSent.getTime()) /
                        (1000 * 60);

                    if (
                        minutesSinceLast >=
                        cooldownMinutes
                    ) {
                        shouldSend = true;
                    }
                }
            }

            if (shouldSend) {
                // ESCALATION MESSAGE

                let reminderText = `⚠️ Reminder

📌 ${reminder.title}

⏰ ${diffHours >= 1
                        ? `${Math.floor(
                            diffHours
                        )} hours remaining`
                        : `${Math.floor(
                            diffMinutes
                        )} minutes remaining`
                    }

🗓️ Event Time:
${reminderDate.toLocaleString()}`;

                // IF USER IGNORES TOO MUCH

                if (reminder.reminderCount >= 4) {
                    reminderText = `⚠️ You still haven't completed this task.

📌 ${reminder.title}

⏰ ${diffHours >= 1
                            ? `${Math.floor(
                                diffHours
                            )} hours remaining`
                            : `${Math.floor(
                                diffMinutes
                            )} minutes remaining`
                        }

Please complete it before the deadline.`;
                }

                await bot.sendMessage(
                    reminder.chatId,
                    reminderText,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: "✅ Completed",
                                        callback_data: `complete_${reminder._id}`,
                                    },
                                ],

                                [
                                    {
                                        text: "⏰ Snooze 30m",
                                        callback_data: `snooze_${reminder._id}`,
                                    },
                                ],

                                [
                                    {
                                        text: "❌ Pending",
                                        callback_data: `pending_${reminder._id}`,
                                    },
                                ],
                            ],
                        },
                    }
                );

                await db
                    .collection("reminders")
                    .updateOne(
                        {
                            _id: reminder._id,
                        },
                        {
                            $set: {
                                lastReminderSent: now,
                            },

                            $inc: {
                                reminderCount: 1,
                            },
                        }
                    );

                console.log(
                    "Reminder Sent:",
                    reminder.title
                );
            }
        }
    } catch (error) {
        console.log("Scheduler Error:", error);
    }
});