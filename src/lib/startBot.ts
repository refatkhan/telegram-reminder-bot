import bot from "./bot";
import clientPromise from "./mongodb";
import { parseReminderWithAI } from "./aiParser";

let isBotRunning = false;

export function startTelegramBot() {
  if (isBotRunning) {
    return;
  }

  isBotRunning = true;

  console.log("Telegram Bot Listener Started");

  bot.on("message", async (msg) => {
    try {
      const text = msg.text;

      if (!text) return;

      await bot.sendMessage(
        msg.chat.id,
        "⏳ Processing your reminder..."
      );

      const parsed = await parseReminderWithAI(text);

      console.log("AI Parsed:", parsed);

      if (!parsed || !parsed.date) {
        await bot.sendMessage(
          msg.chat.id,
          "Could not understand reminder."
        );

        return;
      }

      const client = await clientPromise;

      const db = client.db("studyReminder");

      await db.collection("reminders").insertOne({
        chatId: msg.chat.id,
        title: parsed.title,
        originalText: text,
        reminderDate: new Date(parsed.date),
        createdAt: new Date(),
      });

      await bot.sendMessage(
        msg.chat.id,
        `✅ Reminder Saved

📌 ${parsed.title}

⏰ ${parsed.date}`
      );
    } catch (error) {
      console.log(error);

      await bot.sendMessage(
        msg.chat.id,
        "Something went wrong."
      );
    }
  });
}