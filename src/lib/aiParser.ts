import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function parseReminderWithAI(
    text: string
) {
    const prompt = `
You are an AI reminder detection system.

Current date and time:
${new Date().toISOString()}

Timezone:
Bangladesh Standard Time (+06:00)

User message:
"${text}"

TASK:
Determine whether this message is actually a reminder/task request.

IMPORTANT:
- Not every message is a reminder.
- Casual conversation is NOT a reminder.
- Money amounts are NOT time.
- Numbers like 1400 tk are NOT 14:00 time.
- Only create reminders if user clearly intends a future task/event/reminder.

Examples of valid reminders:
- exam tomorrow 10am
- meeting after 5 min
- kalke presentation ache
- remind me to submit assignment

Examples of NOT reminders:
- rakib er kache 1400 tk pai
- ajke onek gorom
- ami ghurte jabo
- amar balance 500

CRITICAL RULES:
- ALWAYS convert relative time into REAL datetime.
- NEVER use:
  - tomorrow
  - current time
  - current date
  - after 10 minutes
- ALWAYS generate REAL ISO datetime.
- Understand Banglish/Bangla casual language.

Return ONLY valid JSON.

IF reminder detected:

{
  "isReminder": true,
  "title": "Meeting",
  "date": "2026-05-13T09:01:00+06:00"
}

IF NOT a reminder:

{
  "isReminder": false
}
`;

    try {
        const response =
            await client.chat.completions.create({
                model: "llama-3.3-70b-versatile",

                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature: 0,
            });

        const content =
            response.choices[0].message.content;

        console.log(
            "RAW AI RESPONSE:",
            content
        );

        if (!content) {
            return null;
        }

        const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log(
            "CLEANED RESPONSE:",
            cleaned
        );

        const jsonMatch =
            cleaned.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.log("No JSON Found");

            return null;
        }

        const parsed = JSON.parse(
            jsonMatch[0]
        );

        // NOT A REMINDER

        if (!parsed.isReminder) {
            console.log(
                "Message is not a reminder"
            );

            return null;
        }

        // DATE MISSING

        if (!parsed.date) {
            console.log("No date found");

            return null;
        }

        const validDate = new Date(
            parsed.date
        );

        // INVALID DATE

        if (
            isNaN(validDate.getTime())
        ) {
            console.log(
                "Invalid Date From AI"
            );

            return null;
        }

        return {
            title: parsed.title,
            date: parsed.date,
        };
    } catch (error) {
        console.log(
            "AI Parser Error:",
            error
        );

        return null;
    }
}