export function getPriorityEmoji(
    priority: string
) {
    switch (priority) {
        case "high":
            return "🚨";

        case "medium":
            return "⚠️";

        case "low":
            return "🟢";

        default:
            return "⚠️";
    }
}