const KM: number = 1000;

export const valueWithUnit = (value: number) => {
    const roundValue = Math.round(value);
    return `${toKm(roundValue)} km`;
};

export const formatDistance = (value: number): string => {
    const roundValue = Math.round(value);
    return toKm(roundValue);
};
const toKm = (value: number) => {
    return (value / 1000).toFixed(2);
};

export const distanceUnit = (value: number) => {
    return Math.floor(value) >= KM ? 'km' : 'm';
};
