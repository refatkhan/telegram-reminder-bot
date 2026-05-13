import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description: string;
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    description,
}: StatsCardProps) {
    return (
        <div className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>
                </div>

                <div className="rounded-xl border p-3">
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    );
}