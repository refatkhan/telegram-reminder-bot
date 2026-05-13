export function getCategoryEmoji(
    category: string
) {
    switch (category) {
        case "study":
            return "📚";

        case "work":
            return "💼";

        case "health":
            return "🏃";

        case "finance":
            return "💰";

        case "meeting":
            return "🤝";

        case "travel":
            return "✈️";

        case "shopping":
            return "🛒";

        default:
            return "🏠";
    }
}