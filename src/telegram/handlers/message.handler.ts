import bot from "@/telegram/bot";

import { processReminderMessage } from "@/services/telegram.service";

import { todayCommand } from "@/telegram/commands/today.command";

import { allCommand } from "@/telegram/commands/all.command";

import { completedCommand } from "@/telegram/commands/completed.command";

import { pendingCommand } from "@/telegram/commands/pending.command";

import { importantCommand } from "@/telegram/commands/important.command";

import { statsCommand } from "@/telegram/commands/stats.command";

import { focusCommand } from "@/telegram/commands/focus.command";

import { summaryCommand } from "@/telegram/commands/summary.command";

import { calendarCommand } from "@/telegram/commands/calendar.command";

import { streakCommand } from "@/telegram/commands/streak.command";

import { deleteCommand } from "@/telegram/commands/delete.command";

import { editCommand } from "@/telegram/commands/edit.command";

import { helpCommand } from "@/telegram/commands/help.command";

bot.on(
    "message",

    async (msg) => {
        try {
            const text = msg.text;

            if (!text) return;

            // ===============================
            // COMMANDS
            // ===============================

            if (text === "/today") {
                return todayCommand(msg);
            }

            if (text === "/all") {
                return allCommand(msg);
            }

            if (text === "/completed") {
                return completedCommand(
                    msg
                );
            }

            if (text === "/pending") {
                return pendingCommand(msg);
            }

            if (text === "/important") {
                return importantCommand(
                    msg
                );
            }

            if (text === "/stats") {
                return statsCommand(msg);
            }

            if (text === "/focus") {
                return focusCommand(msg);
            }

            if (text === "/summary") {
                return summaryCommand(msg);
            }

            if (text === "/calendar") {
                return calendarCommand(
                    msg
                );
            }

            if (text === "/streak") {
                return streakCommand(msg);
            }

            if (text === "/help") {
                return helpCommand(msg);
            }

            // ===============================
            // DELETE COMMAND
            // ===============================

            const handledDelete =
                await deleteCommand(msg);

            if (handledDelete) {
                return;
            }

            // ===============================
            // EDIT COMMAND
            // ===============================

            const handledEdit =
                await editCommand(msg);

            if (handledEdit) {
                return;
            }

            // ===============================
            // NORMAL REMINDER
            // ===============================

            return processReminderMessage(
                msg
            );
        } catch (error) {
            console.log(
                "BOT ERROR:",
                error
            );
        }
    }
);