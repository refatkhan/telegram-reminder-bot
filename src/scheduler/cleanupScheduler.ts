import cron from "node-cron";

import clientPromise from "@/lib/mongodb";

console.log("Cleanup Scheduler Started");

// RUN EVERY DAY AT 3 AM

cron.schedule("0 3 * * *", async () => {
    try {
        console.log(
            "Running Cleanup Scheduler..."
        );

        const client = await clientPromise;

        const db = client.db("studyReminder");

        // ==========================
        // 7 DAYS AGO
        // ==========================

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(
            sevenDaysAgo.getDate() - 7
        );

        // ==========================
        // 30 DAYS AGO
        // ==========================

        const thirtyDaysAgo = new Date();

        thirtyDaysAgo.setDate(
            thirtyDaysAgo.getDate() - 30
        );

        // =====================================
        // DELETE COMPLETED TASKS AFTER 7 DAYS
        // =====================================

        const completedResult =
            await db.collection("reminders").deleteMany({
                completed: true,

                createdAt: {
                    $lte: sevenDaysAgo,
                },
            });

        // =====================================
        // DELETE ALL OLD TASKS AFTER 30 DAYS
        // =====================================

        const oldTasksResult =
            await db.collection("reminders").deleteMany({
                createdAt: {
                    $lte: thirtyDaysAgo,
                },
            });

        console.log(
            `Deleted Completed Tasks: ${completedResult.deletedCount}`
        );

        console.log(
            `Deleted Old Tasks: ${oldTasksResult.deletedCount}`
        );
    } catch (error) {
        console.log(
            "Cleanup Scheduler Error:",
            error
        );
    }
});