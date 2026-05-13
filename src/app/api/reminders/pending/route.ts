import { NextResponse } from "next/server";

import { getPendingReminders } from "@/repositories/reminder.repository";

export async function GET() {
    try {
        const reminders =
            await getPendingReminders(
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
                    "Failed to fetch pending reminders",
            },

            {
                status: 500,
            }
        );
    }
}