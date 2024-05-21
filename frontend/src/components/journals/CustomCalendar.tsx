import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions
import { useLocation } from 'react-router-dom';
import { queryStringKeys } from '@/constants';
import PrevMonth from '@/assets/icons/btn-prev-month.svg';
import NextMonth from '@/assets/icons/btn-next-month.svg';
import { fetchDogMonthStatistic, period } from '@/api/dogs';
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
        const dogId = params.get(queryStringKeys.DOGID);
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
        const dogId = params.get(queryStringKeys.DOGID);
        if (Number(dogId) === currentDogId) return;
        if (date.getFullYear() <= today.getFullYear() && date.getMonth() <= today.getMonth()) {
            console.log('today');
            getStatisticData(formDate(date), view);
        }
        setCurrentDogId(Number(dogId));
    }, [location.search]);

    return (
        <div className="w-full flex flex-col px-[30px] pt-4 justify-center items-center bg-white shadow rounded-bl-2xl rounded-br-2xl overflow-hidden">
            {view === 'month' && (
                <div className="w-full flex gap-2 justify-end mb-6">
                    <button
                        onClick={() => {
                            handlePrevMonth(getStatisticData);
                        }}
                    >
                        <img src={PrevMonth} alt="이전달" />
                    </button>
                    <span className="text-center text-neutral-800 text-base font-bold leading-normal">
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
                            <div className="flex flex-col justify-center items-center gap-2">
                                <div className="days">{formDay(date)}</div>
                                {mark.has(formDate(date)) ? (
                                    <div className="dot"></div>
                                ) : (
                                    <div className="w-1 h-1"></div>
                                )}
                            </div>
                        </>
                    );
                }}
            />
            <div className="w-full h-[30px]  justify-center items-center inline-flex">
                <button
                    className="w-[30px] h-1 bg-neutral-200 rounded-sm"
                    onClick={() => {
                        toggleViewSwitch(getStatisticData);
                    }}
                ></button>
            </div>
        </div>
    );
}
