"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface Reminder {
    _id: string;

    title: string;

    priority: string;

    reminderDate: string;
}

export default function TodayPage() {
    const [reminders, setReminders] =
        useState<Reminder[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function fetchToday() {
            try {
                const response =
                    await fetch(
                        "/api/reminders/today"
                    );

                const data =
                    await response.json();

                setReminders(
                    data.reminders || []
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchToday();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Today's Tasks
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        View all reminders scheduled for today.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border p-10 text-center">
                        Loading today's reminders...
                    </div>
                ) : reminders.length ===
                    0 ? (
                    <div className="rounded-2xl border p-10 text-center text-muted-foreground">
                        No reminders for today.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reminders.map(
                            (
                                reminder
                            ) => (
                                <div
                                    key={
                                        reminder._id
                                    }
                                    className="flex items-center justify-between rounded-2xl border p-5"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {
                                                reminder.title
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {new Date(
                                                reminder.reminderDate
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm text-yellow-500">
                                        {
                                            reminder.priority
                                        }
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}