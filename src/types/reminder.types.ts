export interface Reminder {
    _id?: string;

    chatId: number;

    title: string;

    category: string;

    priority: string;

    originalText: string;

    reminderDate: Date;

    completed: boolean;

    isOverdue: boolean;

    lastReminderSent: Date | null;

    isRecurring: boolean;

    recurringType: string | null;

    createdAt: Date;
}