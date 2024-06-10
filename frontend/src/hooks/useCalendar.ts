import { period } from '@/api/dog';
import { queryStringKeys } from '@/constants';
import { formatDate } from '@/utils/time';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export type viewMode = 'week' | 'month';

const useCalendar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const today = new Date();
    const [date, setDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [view, setView] = useState<viewMode>('week');

    const getStartOfWeek = (date: Date) => {
        const startDate = new Date(date);
        const day = startDate.getDay();
        const diff = startDate.getDate() - day;
        return new Date(startDate.setDate(diff));
    };

    const handlePrevMonth = async (getData: (date: string, period: period) => Promise<void>) => {
        const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        if (today.getFullYear() >= prevMonth.getFullYear() && today.getMonth() >= prevMonth.getMonth()) {
            await getData(formatDate(prevMonth), 'month');
        }
        setDate(prevMonth);
    };

    const handleNextMonth = async (getData: (date: string, period: period) => Promise<void>) => {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        if (today.getFullYear() >= nextMonth.getFullYear() && today.getMonth() >= nextMonth.getMonth()) {
            await getData(formatDate(nextMonth), 'month');
        }
        setDate(nextMonth);
    };
    const toggleViewSwitch = async (getData: (date: string, period: period) => Promise<void>) => {
        if (view === 'month') {
            setView('week');
        } else {
            await getData(formatDate(today), 'month');
            setView('month');
        }
    };

    const handleClickDay = (value: Date, mark: Set<string>) => {
        const date = formatDate(value);
        setDate(value);
        if (!mark.has(date)) return;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(queryStringKeys.DATE, date);
        setSearchParams(newSearchParams);
    };

    useEffect(() => {
        const startOfWeek = getStartOfWeek(date);
        const week = Array.from({ length: 7 }).map((_, index) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + index);
            return day;
        });
        setCurrentWeek(week);
    }, [date]);

    return {
        toggleViewSwitch,
        handlePrevMonth,
        handleNextMonth,
        handleClickDay,
        date,
        currentWeek,
        view,
        today,
    };
};

export default useCalendar;
