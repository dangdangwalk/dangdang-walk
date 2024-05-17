export function getWeek(date: Date): number {
    const currentDate = date.getDate();
    const firstDay = new Date(date.setDate(1)).getDay();

    return Math.ceil((currentDate + firstDay) / 7);
}
