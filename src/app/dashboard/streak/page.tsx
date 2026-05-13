"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/dashboard-layout";

import {
    Flame,
    Trophy,
    CalendarDays,
} from "lucide-react";

interface StreakStats {
    streak: number;
}

export default function StreakPage() {
    const [streak, setStreak] =
        useState(0);

    useEffect(() => {
        async function fetchStreak() {
            try {
                const response =
                    await fetch(
                        "/api/reminders/streak"
                    );

                const data =
                    await response.json();

                setStreak(
                    data.streak || 0
                );
            } catch (error) {
                console.error(error);
            }
        }

        fetchStreak();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Productivity Streak
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Track your consistency and productivity performance.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-2xl border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Current Streak
                                </p>

                                <h2 className="mt-3 text-4xl font-bold">
                                    {streak} Days
                                </h2>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <Flame className="h-8 w-8 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Best Streak
                                </p>

                                <h2 className="mt-3 text-4xl font-bold">
                                    {streak}
                                </h2>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <Trophy className="h-8 w-8 text-yellow-500" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Active Days
                                </p>

                                <h2 className="mt-3 text-4xl font-bold">
                                    {streak}
                                </h2>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <CalendarDays className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border p-6">
                    <h2 className="text-2xl font-semibold">
                        Weekly Consistency
                    </h2>

                    <div className="mt-8 flex items-end gap-4 h-[250px]">
                        {[60, 90, 70, 100, 80, 95, 85].map(
                            (
                                height,
                                index
                            ) => (
                                <div
                                    key={index}
                                    className="flex flex-1 flex-col items-center gap-3"
                                >
                                    <div
                                        style={{
                                            height: `${height}%`,
                                        }}
                                        className="w-full rounded-2xl bg-primary/80"
                                    />

                                    <span className="text-sm text-muted-foreground">
                                        {
                                            [
                                                "Mon",
                                                "Tue",
                                                "Wed",
                                                "Thu",
                                                "Fri",
                                                "Sat",
                                                "Sun",
                                            ][
                                            index
                                            ]
                                        }
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border p-6">
                    <h2 className="text-2xl font-semibold">
                        Achievement Badges
                    </h2>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border p-5">
                            <div className="text-4xl">
                                🔥
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                                7 Day Warrior
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Completed tasks for 7 consecutive days.
                            </p>
                        </div>

                        <div className="rounded-2xl border p-5">
                            <div className="text-4xl">
                                🏆
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                                Productivity Master
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Achieved 90% completion rate.
                            </p>
                        </div>

                        <div className="rounded-2xl border p-5">
                            <div className="text-4xl">
                                ⚡
                            </div>

                            <h3 className="mt-4 text-lg font-semibold">
                                Focus Champion
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Maintained strong daily focus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}