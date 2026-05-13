import bot from "@/telegram/bot";

import { completeCallback } from "@/telegram/callbacks/complete.callback";

import { snoozeCallback } from "@/telegram/callbacks/snooze.callback";

import { pendingCallback } from "@/telegram/callbacks/pending.callback";

import { deleteCallback } from "@/telegram/callbacks/delete.callback";

bot.on(
    "callback_query",

    async (query) => {
        try {
            const handledComplete =
                await completeCallback(
                    query
                );

            if (handledComplete) {
                return;
            }

            const handledSnooze =
                await snoozeCallback(
                    query
                );

            if (handledSnooze) {
                return;
            }

            const handledPending =
                await pendingCallback(
                    query
                );

            if (handledPending) {
                return;
            }

            const handledDelete =
                await deleteCallback(
                    query
                );

            if (handledDelete) {
                return;
            }
        } catch (error) {
            console.log(
                "Callback Error:",
                error
            );
        }
    }
);