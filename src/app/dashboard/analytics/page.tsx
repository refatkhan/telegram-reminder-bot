"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";

interface Stats {
    total: number;

    completed: number;

    pending: number;
}

export default function AnalyticsPage() {
    const [stats, setStats] =
        useState<Stats>({
            total: 0,
            completed: 0,
            pending: 0,
        });

    useEffect(() => {
        async function fetchStats() {
            const response =
                await fetch(
                    "/api/reminders/stats"
                );

            const data =
                await response.json();

            setStats(
                data.stats || {
                    total: 0,
                    completed: 0,
                    pending: 0,
                }
            );
        }

        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Analytics
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Productivity insights and statistics.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            Total Tasks
                        </p>

                        <h2 className="mt-4 text-4xl font-bold">
                            {stats.total}
                        </h2>
                    </div>

                    <div className="rounded-2xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            Completed
                        </p>

                        <h2 className="mt-4 text-4xl font-bold">
                            {stats.completed}
                        </h2>
                    </div>

                    <div className="rounded-2xl border p-6">
                        <p className="text-sm text-muted-foreground">
                            Pending
                        </p>

                        <h2 className="mt-4 text-4xl font-bold">
                            {stats.pending}
                        </h2>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}