export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// 현재 날짜를 기준으로 과거의 랜덤한 날짜 생성
export function getRandomPastDate(days: number): Date {
    const now = new Date();
    return getRandomDate(new Date(now.getTime() - days * 24 * 60 * 60 * 1000), now);
}
