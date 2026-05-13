import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-3xl">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Settings
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Manage your dashboard preferences.
                    </p>
                </div>

                <div className="rounded-2xl border p-6 space-y-6">
                    <div>
                        <label className="text-sm font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Refat Khan"
                            className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Timezone
                        </label>

                        <select className="mt-2 h-12 w-full rounded-xl border bg-background px-4 outline-none">
                            <option>
                                Asia/Dhaka
                            </option>
                        </select>
                    </div>

                    <button className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                        Save Settings
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}