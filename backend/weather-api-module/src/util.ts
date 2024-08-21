export function getCurrentTimeKey(): string {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, '0');
    return hour + '00';
}
