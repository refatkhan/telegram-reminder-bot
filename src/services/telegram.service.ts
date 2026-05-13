import { Message } from "node-telegram-bot-api";

import bot from "@/telegram/bot";

import clientPromise from "@/lib/mongodb";

import { parseReminderWithAI } from "@/services/aiParser.service";

import { getPriorityEmoji } from "@/utils/getPriorityEmoji";

import { getCategoryEmoji } from "@/utils/getCategoryEmoji";

export async function processReminderMessage(
    msg: Message
) {
    const text = msg.text;

    if (!text) return;

    console.log("Message:", text);

    await bot.sendMessage(
        msg.chat.id,
        "⏳ Processing your reminder..."
    );

    const parsed =
        await parseReminderWithAI(text);

    if (!parsed || !parsed.date) {
        await bot.sendMessage(
            msg.chat.id,
            "❌ Could not understand reminder."
        );

        return;
    }

    const client = await clientPromise;

    const db = client.db("studyReminder");

    await db.collection("reminders").insertOne({
        chatId: msg.chat.id,

        title: parsed.title,

        category:
            parsed.category || "personal",

        priority:
            parsed.priority || "medium",

        originalText: text,

        reminderDate: new Date(parsed.date),

        completed: false,

        isOverdue: false,

        lastReminderSent: null,

        isRecurring:
            parsed.isRecurring || false,

        recurringType:
            parsed.recurringType || null,

        createdAt: new Date(),
    });
    await bot.sendMessage(
        msg.chat.id,

        `✅ Reminder Saved

${getPriorityEmoji(
            parsed.priority || "medium"
        )} ${getCategoryEmoji(
            parsed.category || "personal"
        )}

📌 ${parsed.title}

⏰ ${parsed.date}`
    );
}