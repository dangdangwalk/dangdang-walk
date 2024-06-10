export const formatTemperature = (temper: number | undefined): string => {
    return `${temper}°C`;
};

export const formatPercent = (num1: number, num2: number): string => {
    if (num2 === 0) return '0';
    const percent = num1 / num2;
    if (percent >= 1) return '100';
    return Math.floor(percent * 100)
        .toString()
        .padStart(3, '0');
};

export const formatTime = (time: number): string => {
    // const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes}:${seconds}`;
};
