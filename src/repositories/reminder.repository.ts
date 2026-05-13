import clientPromise from "@/lib/mongodb";

import { ObjectId } from "mongodb";

import { Reminder } from "@/types/reminder.types";

// ===============================
// COLLECTION
// ===============================

async function getCollection() {
    const client = await clientPromise;

    const db = client.db(
        "studyReminder"
    );

    return db.collection<Reminder>(
        "reminders"
    );
}

// ===============================
// CREATE REMINDER
// ===============================

export async function createReminder(
    reminder: Reminder
) {
    const collection =
        await getCollection();

    return collection.insertOne(
        reminder
    );
}

// ===============================
// GET ALL REMINDERS
// ===============================

export async function getAllReminders(
    chatId: number
) {
    const collection =
        await getCollection();

    return collection
        .find({
            chatId,
        })
        .sort({
            reminderDate: 1,
        })
        .toArray();
}

// ===============================
// GET TODAY REMINDERS
// ===============================

export async function getTodayReminders(
    chatId: number
) {
    const collection =
        await getCollection();

    const reminders =
        await collection
            .find({
                chatId,

                completed: false,
            })
            .sort({
                reminderDate: 1,
            })
            .toArray();

    const today = new Date();

    return reminders.filter(
        (reminder) => {
            const reminderDate =
                new Date(
                    reminder.reminderDate
                );

            return (
                reminderDate.getDate() ===
                today.getDate() &&
                reminderDate.getMonth() ===
                today.getMonth() &&
                reminderDate.getFullYear() ===
                today.getFullYear()
            );
        }
    );
}

// ===============================
// GET COMPLETED REMINDERS
// ===============================

export async function getCompletedReminders(
    chatId: number
) {
    const collection =
        await getCollection();

    return collection
        .find({
            chatId,

            completed: true,
        })
        .toArray();
}

// ===============================
// GET PENDING REMINDERS
// ===============================

export async function getPendingReminders(
    chatId: number
) {
    const collection =
        await getCollection();

    return collection
        .find({
            chatId,

            completed: false,
        })
        .toArray();
}

// ===============================
// COMPLETE REMINDER
// ===============================

export async function completeReminder(
    reminderId: string
) {
    const collection =
        await getCollection();

    return collection.updateOne(
        {
            _id: new ObjectId(
                reminderId
            ),
        },
        {
            $set: {
                completed: true,
            },
        }
    );
}

// ===============================
// DELETE REMINDER
// ===============================

export async function deleteReminder(
    reminderId: string
) {
    const collection =
        await getCollection();

    return collection.deleteOne({
        _id: new ObjectId(
            reminderId
        ),
    });
}

// ===============================
// FIND REMINDER
// ===============================

export async function findReminderById(
    reminderId: string
) {
    const collection =
        await getCollection();

    return collection.findOne({
        _id: new ObjectId(
            reminderId
        ),
    });
}

// ===============================
// REMINDER STATS
// ===============================

export async function getReminderStats(
    chatId: number
) {
    const collection =
        await getCollection();

    const total =
        await collection.countDocuments(
            {
                chatId,
            }
        );

    const completed =
        await collection.countDocuments(
            {
                chatId,

                completed: true,
            }
        );

    const pending =
        total - completed;

    return {
        total,

        completed,

        pending,
    };
}