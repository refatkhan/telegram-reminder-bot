import { NextResponse } from "next/server";

import { getAllReminders, getTodayReminders } from "@/repositories/reminder.repository";

// ======================================
// GET TODAY REMINDERS
// ======================================

export async function GET() {
    try {
        const reminders =
            await getTodayReminders(
                chat_id
            );

        console.log(reminders);

        return NextResponse.json({
            success: true,

            reminders,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,

                message:
                    "Failed to fetch today's reminders",
            },
            {
                status: 500,
            }
        );
    }
}