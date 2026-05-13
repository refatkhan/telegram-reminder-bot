"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface Reminder {
    _id: string;

    title: string;
}

export default function CompletedPage() {
    const [reminders, setReminders] =
        useState<Reminder[]>([]);

    useEffect(() => {
        async function fetchCompleted() {
            const response =
                await fetch(
                    "/api/reminders/completed"
                );

            const data =
                await response.json();

            setReminders(
                data.reminders || []
            );
        }

        fetchCompleted();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Completed Tasks
                    </h1>
                </div>

                <div className="space-y-4">
                    {reminders.map(
                        (reminder) => (
                            <div
                                key={
                                    reminder._id
                                }
                                className="flex items-center justify-between rounded-2xl border p-5"
                            >
                                <h3 className="text-lg font-semibold line-through opacity-70">
                                    {
                                        reminder.title
                                    }
                                </h3>

                                <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-500">
                                    Done
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}