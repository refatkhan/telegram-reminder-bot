import dotenv from "dotenv";

dotenv.config({
    path: ".env.local",
});

import "@/scheduler/reminderScheduler";
import "@/scheduler/cleanupScheduler";
import "@/scheduler/dailySummaryScheduler";

import bot from "@/telegram/bot";

import "@/telegram/handlers/message.handler";

import "@/telegram/handlers/callback.handler";

console.log("Telegram Bot Service Started");

bot.setMyCommands([
    {
        command: "today",
        description: "📅 Show today's tasks",
    },

    {
        command: "all",
        description: "📋 Show all reminders",
    },

    {
        command: "completed",
        description: "✅ Show completed tasks",
    },

    {
        command: "pending",
        description: "⏳ Show pending tasks",
    },

    {
        command: "important",
        description: "🚨 Show important tasks",
    },

    {
        command: "edit",
        description: "✏️ Edit reminder",
    },

    {
        command: "summary",
        description: "📝 Show task summary",
    },

    {
        command: "calendar",
        description: "🗓️ Show upcoming schedule",
    },

    {
        command: "stats",
        description: "📊 Show productivity stats",
    },

    {
        command: "streak",
        description: "🔥 Show productivity streak",
    },

    {
        command: "focus",
        description: "🎯 Show next important task",
    },

    {
        command: "motivation",
        description: "🚀 Get motivational message",
    },

    {
        command: "delete",
        description: "🗑️ Delete a reminder",
    },

    {
        command: "settings",
        description: "⚙️ Bot settings",
    },

    {
        command: "help",
        description: "🤖 Show all commands",
    },
]);

console.log("🤖 Telegram Bot Running...");