"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";

import { getReminders } from "@/services/reminder.service";

interface Reminder {
    _id: string;

    title: string;

    category: string;

    priority: string;

    reminderDate: string;

    completed: boolean;
}

export default function RemindersPage() {
    const [reminders, setReminders] =
        useState<Reminder[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function fetchReminders() {
            try {
                const data =
                    await getReminders();

                setReminders(
                    data.reminders
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchReminders();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            All Reminders
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Manage all your reminders.
                        </p>
                    </div>

                    <button className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                        + Add Reminder
                    </button>
                </div>

                <div className="rounded-2xl border">
                    {loading ? (
                        <div className="p-10 text-center">
                            Loading reminders...
                        </div>
                    ) : reminders.length ===
                        0 ? (
                        <div className="p-10 text-center text-muted-foreground">
                            No reminders found.
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-5">
                                        Task
                                    </th>

                                    <th className="p-5">
                                        Category
                                    </th>

                                    <th className="p-5">
                                        Priority
                                    </th>

                                    <th className="p-5">
                                        Date
                                    </th>

                                    <th className="p-5">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {reminders.map(
                                    (
                                        reminder
                                    ) => (
                                        <tr
                                            key={
                                                reminder._id
                                            }
                                            className="border-b transition hover:bg-muted/40"
                                        >
                                            <td className="p-5 font-medium">
                                                {
                                                    reminder.title
                                                }
                                            </td>

                                            <td className="p-5">
                                                {
                                                    reminder.category
                                                }
                                            </td>

                                            <td className="p-5">
                                                {
                                                    reminder.priority
                                                }
                                            </td>

                                            <td className="p-5">
                                                {new Date(
                                                    reminder.reminderDate
                                                ).toLocaleString()}
                                            </td>

                                            <td className="p-5">
                                                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-500">
                                                    {reminder.completed
                                                        ? "Completed"
                                                        : "Active"}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}