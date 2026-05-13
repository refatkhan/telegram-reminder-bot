"use client";

import { Bell, MoonStar, Search } from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex h-20 items-center justify-between border-b px-6">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                    type="text"
                    placeholder="Search reminders..."
                    className="h-11 w-full rounded-xl border bg-background pl-10 pr-4 outline-none"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="flex h-11 w-11 items-center justify-center rounded-xl border hover:bg-muted transition">
                    <MoonStar className="h-5 w-5" />
                </button>

                <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border hover:bg-muted transition">
                    <Bell className="h-5 w-5" />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-primary" />

                    <div>
                        <p className="text-sm font-semibold">
                            Refat Khan
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Premium User
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}