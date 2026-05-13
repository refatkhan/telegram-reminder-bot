import { NextResponse } from "next/server";

import { getReminderStats } from "@/repositories/reminder.repository";

export async function GET() {
    try {
        const stats =
            await getReminderStats(
                YOUR_REAL_CHAT_ID
            );

        return NextResponse.json({
            success: true,

            streak:
                stats.completed,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,

                message:
                    "Failed to fetch streak",
            },

            {
                status: 500,
            }
        );
    }
}