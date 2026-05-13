import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});
import TelegramBot from "node-telegram-bot-api";

const token = process.env.BOT_TOKEN as string;

if (!token) {
  throw new Error("BOT_TOKEN is missing");
}

let bot: TelegramBot;

declare global {
  var telegramBot: TelegramBot | undefined;
}

if (!global.telegramBot) {
  global.telegramBot = new TelegramBot(token, {
    polling: true,
  });

  console.log("Telegram Bot Started");
}

bot = global.telegramBot;

export default bot;