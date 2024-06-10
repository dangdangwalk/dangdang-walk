export const secondsToTimeFormat = (duration: number) => {
    const totalSeconds = parseInt(String(duration));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
};

export const getCurrentDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
};

export const getCurrentTime = (date: Date) => {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}${minute}`;
};

export const getHours = (date: Date) => {
    const hour = date.getHours().toString().padStart(2, '0');
    return hour;
};

export const getElapsedTime = (start: Date, end: Date) => {
    return (end.getTime() - start.getTime()) / 1000;
};

export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const formatDay = (date: Date): string => {
    return date.getDate().toString();
};
export const formatYearMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}`;
};

export const getStartTimeToEndTime = (start: string, seconds: number) => {
    const startTime = new Date(start);
    const endTime = new Date(start);
    endTime.setSeconds(endTime.getSeconds() + seconds);
    return `${formatDate(startTime)} ${formatToHHMM(startTime)}-${formatToHHMM(endTime)}`;
};

export const formatToHHMM = (date: Date) => {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    return `${hour}:${minute}`;
};
