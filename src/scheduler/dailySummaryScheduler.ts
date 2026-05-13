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
            "Sending Daily Summaries..."
        );

        const client = await clientPromise;

        const db = client.db("studyReminder");

        const reminders = await db
            .collection("reminders")
            .find({
                completed: false,
            })
            .toArray();

        // GROUP TASKS BY USER

        const groupedReminders =
            reminders.reduce((acc, reminder) => {
                const chatId = reminder.chatId;

                if (!acc[chatId]) {
                    acc[chatId] = [];
                }

                acc[chatId].push(reminder);

                return acc;
            }, {} as Record<string, any[]>);

        // SEND SUMMARY TO EACH USER

        for (const chatId in groupedReminders) {
            const userReminders =
                groupedReminders[chatId];

            if (userReminders.length === 0) {
                continue;
            }

            let message =
                "📅 Today's Tasks\n\n";

            userReminders.forEach(
                (reminder, index) => {
                    const reminderDate = new Date(
                        reminder.reminderDate
                    );

                    message += `${index + 1}. ${reminder.title
                        } — ${reminderDate.toLocaleString()}\n`;
                }
            );

            message +=
                "\n🚀 Stay productive today!";

            await bot.sendMessage(
                Number(chatId),
                message
            );

            console.log(
                `Daily Summary Sent To ${chatId}`
            );
        }
    } catch (error) {
        console.log(
            "Daily Summary Error:",
            error
        );
    }
});