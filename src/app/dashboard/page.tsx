import DashboardLayout from "@/components/dashboard/dashboard-layout";

import StatsCard from "@/components/dashboard/stats-card";

import {
    Bell,
    CheckCircle2,
    Flame,
    ListTodo,
} from "lucide-react";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage your reminders and productivity.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard
                        title="Total Tasks"
                        value="124"
                        icon={ListTodo}
                        description="All reminders created"
                    />

                    <StatsCard
                        title="Completed"
                        value="84"
                        icon={CheckCircle2}
                        description="Tasks completed successfully"
                    />

                    <StatsCard
                        title="Pending"
                        value="18"
                        icon={Bell}
                        description="Upcoming reminders"
                    />

                    <StatsCard
                        title="Streak"
                        value="12 Days"
                        icon={Flame}
                        description="Current productivity streak"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border p-6 lg:col-span-2">
                        <h2 className="text-xl font-semibold">
                            Upcoming Reminders
                        </h2>

                        <div className="mt-6 space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between rounded-xl border p-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            Database Assignment
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Today • 10:30 PM
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-500">
                                        High
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border p-6">
                        <h2 className="text-xl font-semibold">
                            Quick Stats
                        </h2>

                        <div className="mt-6 space-y-5">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Completion Rate
                                </p>

                                <h3 className="mt-1 text-3xl font-bold">
                                    82%
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Weekly Productivity
                                </p>

                                <h3 className="mt-1 text-3xl font-bold">
                                    Excellent
                                </h3>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Focus Score
                                </p>

                                <h3 className="mt-1 text-3xl font-bold">
                                    9.1/10
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}