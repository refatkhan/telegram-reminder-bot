import cron from "node-cron";

import clientPromise from "@/lib/mongodb";
import bot from "@/lib/bot";

console.log(
    "Daily Summary Scheduler Started"
);

// EVERY DAY AT 8 AM

cron.schedule("0 8 * * *", async () => {
    try {
        console.log(
            "Sending Daily Schedules..."
        );

        const client = await clientPromise;

        const db = client.db("studyReminder");

        const reminders = await db
            .collection("reminders")
            .find({
                completed: false,
            })
            .toArray();

        const today = new Date();

        // TODAY DATE VALUES

        const todayDate =
            today.getDate();

        const todayMonth =
            today.getMonth();

        const todayYear =
            today.getFullYear();

        // GROUP USER REMINDERS

        const groupedReminders:
            Record<string, any[]> = {};

        for (const reminder of reminders) {
            const reminderDate = new Date(
                reminder.reminderDate
            );

            // ONLY TODAY'S TASKS

            if (
                reminderDate.getDate() ===
                todayDate &&
                reminderDate.getMonth() ===
                todayMonth &&
                reminderDate.getFullYear() ===
                todayYear
            ) {
                if (
                    !groupedReminders[
                    reminder.chatId
                    ]
                ) {
                    groupedReminders[
                        reminder.chatId
                    ] = [];
                }

                groupedReminders[
                    reminder.chatId
                ].push(reminder);
            }
        }

        // SEND TO EACH USER

        for (const chatId in groupedReminders) {
            const userReminders =
                groupedReminders[chatId];

            if (
                userReminders.length === 0
            ) {
                continue;
            }

            // SORT BY TIME

            userReminders.sort(
                (a, b) =>
                    new Date(
                        a.reminderDate
                    ).getTime() -
                    new Date(
                        b.reminderDate
                    ).getTime()
            );

            let message =
                "🌅 Good Morning\n\n";

            message +=
                "📅 Today's Schedule\n\n";

            userReminders.forEach(
                (reminder) => {
                    const reminderDate =
                        new Date(
                            reminder.reminderDate
                        );

                    message += `📌 ${reminder.title
                        }\n`;

                    message += `⏰ ${reminderDate.toLocaleTimeString()}\n\n`;
                }
            );

            message +=
                "🚀 Stay productive today!";

            await bot.sendMessage(
                Number(chatId),
                message
            );

            console.log(
                `Daily Schedule Sent To ${chatId}`
            );
        }
    } catch (error) {
        console.log(
            "Daily Summary Error:",
            error
        );
    }
});