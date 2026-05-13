import cron from "node-cron";

import clientPromise from "@/lib/mongodb";

console.log("Cleanup Scheduler Started");

// EVERY DAY AT 3 AM

cron.schedule("0 3 * * *", async () => {
    try {
        console.log(
            "Running Cleanup Scheduler..."
        );

        const client = await clientPromise;

        const db = client.db("studyReminder");

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        // DELETE OLD COMPLETED TASKS

        const completedResult =
            await db.collection("reminders").deleteMany({
                completed: true,

                createdAt: {
                    $lte: sevenDaysAgo,
                },
            });

        // DELETE OLD EXPIRED TASKS

        const expiredResult =
            await db.collection("reminders").deleteMany({
                completed: false,

                reminderDate: {
                    $lte: sevenDaysAgo,
                },
            });

        console.log(
            `Deleted Completed Tasks: ${completedResult.deletedCount}`
        );

        console.log(
            `Deleted Expired Tasks: ${expiredResult.deletedCount}`
        );
    } catch (error) {
        console.log(
            "Cleanup Scheduler Error:",
            error
        );
    }
});