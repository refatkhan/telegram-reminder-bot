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
${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
    })}

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

===================================
VALID REMINDER EXAMPLES
===================================

- exam tomorrow 10am
- meeting after 5 min
- kalke presentation ache
- remind me to submit assignment
- gym everyday 7am
- class every sunday 10am
- ajke rat 10tay class
- rat 9ta17 e meeting
- sokal 8tay exam
- dupur 2tay doctor appointment
- bikal 5tay coaching

===================================
NOT REMINDERS
===================================

- rakib er kache 1400 tk pai
- ajke onek gorom
- ami ghurte jabo
- amar balance 500

===================================
CRITICAL TIME RULES
===================================
- Detect Banglish compact formats correctly.
- Examples:
  - "9ta17" = 09:17
  - "10ta12" = 10:12
  - "8ta5" = 08:05

- Detect Banglish spaced formats correctly.
- Examples:
  - "10 ta 12 te" = 10:12
  - "9 ta 5 e" = 09:05
  - "8 ta 30 e" = 08:30

- Detect time-of-day words correctly.
- Examples:
  - "rat 10tay" = 22:00
  - "sokal 8tay" = 08:00
  - "dupur 2tay" = 14:00
  - "bikal 5tay" = 17:00

- Preserve minute values accurately.
- Never ignore minute values after hour.
- "10 ta 12 te" means 10:12, NOT 10:00.
- "9ta17" means 09:17, NOT 09:00.

- If user says "ajke", use TODAY.
- If user says "kalke", use TOMORROW.
- If time is still upcoming today,
  NEVER move it to another future date randomly.
===================================
BANGLISH TIME UNDERSTANDING
===================================

Understand Banglish/Bangla casual time correctly.

-----------------------------------
NO SPACE FORMAT
-----------------------------------

"rat 9ta"
=
21:00

"9ta17"
=
09:17

"rat 9ta17"
=
21:17

"10ta12"
=
10:12

"8ta5"
=
08:05

IMPORTANT:
- If second number exists after "ta",
  treat it as MINUTES.
- Never ignore minute values.

-----------------------------------
SPACE SEPARATED FORMAT
-----------------------------------

"10 ta 12 te"
=
10:12

"rat 10 ta 12 te"
=
22:12

"9 ta 5 e"
=
09:05

"8 ta 30 e"
=
08:30

"sokal 8 ta 15 te"
=
08:15

IMPORTANT:
- If second number exists after hour,
  treat it as MINUTES.
- "10 ta 12 te" means 10:12.
- "9 ta 5 e" means 9:05.
- Never ignore minute values.

-----------------------------------
TIME OF DAY
-----------------------------------

"rat 10tay"
=
22:00

"sokal 8tay"
=
08:00

"dupur 2tay"
=
14:00

"bikal 5tay"
=
17:00

"night 10ta"
=
22:00

-----------------------------------
COLON FORMAT
-----------------------------------

"10:30"
=
10:30

"21:15"
=
21:15

-----------------------------------
AM PM FORMAT
-----------------------------------

"10pm"
=
22:00

"8am"
=
08:00

"5 PM"
=
17:00

-----------------------------------
TODAY TOMORROW UNDERSTANDING
-----------------------------------

"ajke rat 10tay"
=
today 22:00

"kalke rat 10tay"
=
tomorrow 22:00

"ajke sokal 8tay"
=
today 08:00

-----------------------------------
RELATIVE TIME
-----------------------------------

"after 5 min"
=
current time + 5 minutes

"15 minute por"
=
current time + 15 minutes

"2 ghonta por"
=
current time + 2 hours

-----------------------------------
RECURRING TIME
-----------------------------------

"everyday 7am"
=
daily recurring

"protidin 8tay"
=
daily recurring

"every sunday 10am"
=
weekly recurring

-----------------------------------
IMPORTANT RULES
-----------------------------------

- If user says "ajke" then use TODAY.
- If user says "kalke" then use TOMORROW.
- If time is still upcoming today,
  NEVER move to future week/day.
- Do NOT randomly change day/month.
- Never convert money into time.
- Numbers like 1400 tk are NOT time.
- "10 ta 12 te" means 10:12.
- "9 ta 5 e" means 09:05.
- "9ta17" means 09:17.
- Always preserve minutes correctly.

===================================
RECURRING REMINDER RULES
===================================

Detect recurring reminders.

Supported recurring types:
- daily
- weekly

Examples:

"gym everyday 7am"

{
  "isReminder": true,
  "title": "Gym",
  "date": "2026-05-14T07:00:00+06:00",
  "category": "health",
  "priority": "medium",
  "isRecurring": true,
  "recurringType": "daily"
}

"class every sunday 10am"

{
  "isReminder": true,
  "title": "Class",
  "date": "2026-05-17T10:00:00+06:00",
  "category": "study",
  "priority": "medium",
  "isRecurring": true,
  "recurringType": "weekly"
}

===================================
CATEGORY RULES
===================================

Possible categories:
- study
- work
- health
- finance
- personal
- meeting
- travel
- shopping

===================================
PRIORITY RULES
===================================

Possible priorities:
- low
- medium
- high

HIGH PRIORITY keywords:
- important
- urgent
- final exam
- deadline
- interview

===================================
FINAL JSON FORMAT
===================================

IF reminder detected:

{
  "isReminder": true,
  "title": "Meeting",
  "date": "2026-05-13T09:01:00+06:00",
  "category": "meeting",
  "priority": "medium",
  "isRecurring": false,
  "recurringType": null
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

        // EXTRACT JSON

        const jsonMatch =
            cleaned.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.log("No JSON Found");

            return null;
        }

        const parsed = JSON.parse(
            jsonMatch[0]
        );

        // NOT REMINDER

        if (!parsed.isReminder) {
            console.log(
                "Message is not a reminder"
            );

            return null;
        }

        // NO DATE

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

        // FINAL SAFE RETURN

        return {
            title:
                parsed.title || "Reminder",

            date: parsed.date,

            category:
                parsed.category ||
                "personal",

            priority:
                parsed.priority ||
                "medium",

            isRecurring:
                parsed.isRecurring || false,

            recurringType:
                parsed.recurringType ||
                null,
        };
    } catch (error) {
        console.log(
            "AI Parser Error:",
            error
        );

        return null;
    }
}