export const temperFormat = (temper: number): string => {
    return `${temper}°C`;
};

export const walkPercentFormat = (percent: number): string => {
    if (percent >= 1) return '100';
    return (percent * 100).toString().padStart(3, '0');
};
