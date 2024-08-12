export declare function formatDate(date: Date): string;
export declare function getWeekNumber(date: Date): number;
interface DateRange {
    startDate: Date;
    endDate: Date;
}
export declare function getStartAndEndOfMonth(date: Date): DateRange;
export declare function getStartAndEndOfWeek(date: Date): DateRange;
export declare function getStartAndEndOfDay(date: Date): DateRange;
export declare function getOneMonthAgo(date: Date): DateRange;
export declare function getLastSunday(): Date;
export declare function getStartOfToday(): Date;
export {};
