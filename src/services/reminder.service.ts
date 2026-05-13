export async function getReminders() {
    const response = await fetch(
        "/api/reminders"
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch reminders"
        );
    }

    return response.json();
}


export async function createReminder(data: any) {
    const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create reminder");
    }

    return response.json();
}