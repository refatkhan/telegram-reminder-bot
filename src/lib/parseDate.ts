import * as chrono from "chrono-node";

export function parseReminder(text: string) {
  let processedText = text.toLowerCase();

  // Bangla/Banglish date words
  processedText = processedText
    .replace(/\b(agamikal|আগামিকাল|kalke|kal)\b/g, "tomorrow")
    .replace(/ajke|aij|আজ/g, "today")
    .replace(/porshu|পরশু/g, "day after tomorrow");

  // Banglish time words
  processedText = processedText
    .replace(/(\d+)tay/g, "$1:00")
    .replace(/rat/g, "night")
    .replace(/sokal/g, "morning")
    .replace(/dupur/g, "afternoon")
    .replace(/bikal/g, "evening");

  const parsedDate = chrono.parseDate(processedText);

  if (!parsedDate) {
    return null;
  }

  return {
    title: text,
    reminderDate: parsedDate,
  };
}