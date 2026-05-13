"use client";

import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    Bell,
    BarChart3,
    Settings,
    Flame,
    CheckCircle2,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Today",
        href: "/dashboard/today",
        icon: Calendar,
    },
    {
        title: "Reminders",
        href: "/dashboard/reminders",
        icon: Bell,
    },
    {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Streak",
        href: "/dashboard/streak",
        icon: Flame,
    },
    {
        title: "Completed",
        href: "/dashboard/completed",
        icon: CheckCircle2,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex h-screen w-72 flex-col border-r bg-background px-5 py-6">
            <div className="mb-10">
                <h1 className="text-2xl font-bold tracking-tight">
                    Study Reminder
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                    Productivity Dashboard
                </p>
            </div>

            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-muted"
                        >
                            <Icon className="h-5 w-5" />

                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}