import Sidebar from "@/components/dashboard/sidebar";

import Navbar from "@/components/dashboard/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}