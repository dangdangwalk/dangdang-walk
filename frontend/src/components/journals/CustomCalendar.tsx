import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions
import PrevMonth from '@/assets/buttons/btn-prev-month.svg';
import NextMonth from '@/assets/buttons/btn-next-month.svg';
import { formatYearMonth, formatDate, formatDay, getCurrentWeek } from '@/utils/time';
import { useDogStatistic } from '@/hooks/useDogStatistic';

interface CalendarProps {
    dogId: number;
    date: Date;
    handleDate: (date: Date) => void;
}

type ViewMode = 'week' | 'month';

export default function CustomCalendar({ dogId, date, handleDate }: CalendarProps) {
    const [mark, setMark] = useState<Set<string>>(new Set<string>());
    const currentWeek: Date[] = getCurrentWeek(date);
    const [view, setView] = useState<ViewMode>('week');

    const { data } = useDogStatistic(dogId, date, view);

    const handlePrevMonth = async () => {
        const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        handleDate(prevMonth);
    };

    const handleNextMonth = async () => {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        handleDate(nextMonth);
    };

    const toggleViewSwitch = () => {
        if (view === 'month') {
            setView('week');
        } else {
            setView('month');
        }
    };

    const handleClickDay = (value: Date, mark: Set<string>) => {
        const date = formatDate(value);
        handleDate(value);
        if (!mark.has(date)) return;
    };

    useEffect(() => {
        if (!data) return;
        const newArray = new Set<string>();
        Object.keys(data).forEach((v) => {
            if (data[v]) {
                newArray.add(v);
            }
        });
        setMark(newArray);
    }, [data]);
    return (
        <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-b-2xl bg-white px-[30px] pt-4 shadow">
            {view === 'month' && (
                <div className="mb-6 flex w-full justify-end gap-2">
                    <button
                        onClick={() => {
                            handlePrevMonth();
                        }}
                    >
                        <img src={PrevMonth} alt="이전달" />
                    </button>
                    <span className="text-center text-base font-bold leading-normal text-neutral-800">
                        {formatYearMonth(date)}
                    </span>
                    <button
                        onClick={() => {
                            handleNextMonth();
                        }}
                    >
                        <img src={NextMonth} alt="다음달" />
                    </button>
                </div>
            )}
            <Calendar
                value={date}
                calendarType="gregory"
                showNavigation={false}
                activeStartDate={date}
                onActiveStartDateChange={() => {}}
                showNeighboringMonth={view === 'week'}
                onClickDay={(value: Date) => {
                    handleClickDay(value, mark);
                }}
                tileDisabled={({ date }) =>
                    view === 'month'
                        ? false
                        : !currentWeek.some((weekDate) => date.toDateString() === weekDate.toDateString())
                }
                tileContent={({ date, view }) => {
                    return (
                        <>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="days">{formatDay(date)}</div>
                                {mark.has(formatDate(date)) ? (
                                    <div className="dot"></div>
                                ) : (
                                    <div className="size-1"></div>
                                )}
                            </div>
                        </>
                    );
                }}
            />
            <div className="inline-flex h-[30px] w-full items-center justify-center">
                <button
                    className="h-1 w-[30px] rounded-sm bg-neutral-200"
                    onClick={() => {
                        toggleViewSwitch();
                    }}
                ></button>
            </div>
        </div>
    );
}
