import { NextResponse } from "next/server";

import { getCompletedReminders } from "@/repositories/reminder.repository";

export async function GET() {
    try {
        const reminders =
            await getCompletedReminders(
                YOUR_REAL_CHAT_ID
            );

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
                    "Failed to fetch completed reminders",
            },

            {
                status: 500,
            }
        );
    }
}