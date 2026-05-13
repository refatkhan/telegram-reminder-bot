import { NextResponse } from "next/server";

import {
  createReminder,
  getAllReminders,
} from "@/repositories/reminder.repository";

// ======================================
// GET REMINDERS
// ======================================

export async function GET() {
  try {
    const reminders =
      await getAllReminders(
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
          "Failed to fetch reminders",
      },

      {
        status: 500,
      }
    );
  }
}

// ======================================
// CREATE REMINDER
// ======================================

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const reminder = {
      chatId:
        body.chatId ||
        123456789,

      title: body.title,

      category:
        body.category ||
        "personal",

      priority:
        body.priority ||
        "medium",

      originalText:
        body.originalText ||
        body.title,

      reminderDate: new Date(
        body.reminderDate
      ),

      completed: false,

      isOverdue: false,

      lastReminderSent: null,

      isRecurring: false,

      recurringType: null,

      createdAt: new Date(),
    };

    const result =
      await createReminder(
        reminder
      );

    return NextResponse.json({
      success: true,

      insertedId:
        result.insertedId,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to create reminder",
      },

      {
        status: 500,
      }
    );
  }
}