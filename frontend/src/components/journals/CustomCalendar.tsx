import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions
import { useLocation } from 'react-router-dom';
import { queryStringKeys } from '@/constants';
import PrevMonth from '@/assets/buttons/btn-prev-month.svg';
import NextMonth from '@/assets/buttons/btn-next-month.svg';
import { fetchDogMonthStatistic, period } from '@/api/dog';
import { formDate, formDay } from '@/utils/date';
import useCalendar from '@/hooks/useCalendar';

const formCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}`;
};

export default function CustomCalendar() {
    const location = useLocation();
    const [mark, setMark] = useState<Set<string>>(new Set<string>());
    const [currentDogId, setCurrentDogId] = useState<number | null>(null);
    const { toggleViewSwitch, handlePrevMonth, handleNextMonth, today, handleClickDay, date, currentWeek, view } =
        useCalendar();
    const getStatisticData = async (date: string, period: period) => {
        const params = new URLSearchParams(location.search);
        const dogId = params.get(queryStringKeys.DOG_ID);
        if (!dogId) return;
        const data = await fetchDogMonthStatistic(Number(dogId), date, period);
        const newArray = new Set<string>();
        Object.keys(data).forEach((v) => {
            if (data[v]) {
                newArray.add(v);
            }
        });
        setMark(newArray);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const dogId = params.get(queryStringKeys.DOG_ID);
        if (Number(dogId) === currentDogId) return;
        if (date.getFullYear() <= today.getFullYear() && date.getMonth() <= today.getMonth()) {
            getStatisticData(formDate(date), view);
        }
        setCurrentDogId(Number(dogId));
    }, [location.search]);

    return (
        <div className="flex w-full flex-col items-center justify-center overflow-hidden rounded-bl-2xl rounded-br-2xl bg-white px-[30px] pt-4 shadow">
            {view === 'month' && (
                <div className="mb-6 flex w-full justify-end gap-2">
                    <button
                        onClick={() => {
                            handlePrevMonth(getStatisticData);
                        }}
                    >
                        <img src={PrevMonth} alt="이전달" />
                    </button>
                    <span className="text-center text-base font-bold leading-normal text-neutral-800">
                        {formCalendar(date)}
                    </span>
                    <button
                        onClick={() => {
                            handleNextMonth(getStatisticData);
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
                                <div className="days">{formDay(date)}</div>
                                {mark.has(formDate(date)) ? (
                                    <div className="dot"></div>
                                ) : (
                                    <div className="h-1 w-1"></div>
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
                        toggleViewSwitch(getStatisticData);
                    }}
                ></button>
            </div>
        </div>
    );
}
