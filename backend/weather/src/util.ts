export function getCurrentTimeKey(): string {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    return hour + '00';
}

export function getToday() {
    const today = new Date();
    return `${today.getFullYear().toString()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
}

export function getYesterday() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return `${yesterday.getFullYear().toString()}${(yesterday.getMonth() + 1).toString().padStart(2, '0')}${yesterday.getDate().toString().padStart(2, '0')}`;
}
