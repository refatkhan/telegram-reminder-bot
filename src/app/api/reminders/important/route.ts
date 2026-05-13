import { NextResponse } from "next/server";

import { getImportantReminders } from "@/repositories/reminder.repository";

export async function GET() {
    try {
        const reminders =
            await getImportantReminders(
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
                    "Failed to fetch important reminders",
            },

            {
                status: 500,
            }
        );
    }
}