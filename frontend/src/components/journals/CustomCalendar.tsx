import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions
import { useLocation, useSearchParams } from 'react-router-dom';
import { queryStringKeys } from '@/constants';
import PrevMonth from '@/assets/icons/btn-prev-month.svg';
import NextMonth from '@/assets/icons/btn-next-month.svg';
import { fetchDogMonthStatistic, period } from '@/api/dogs';
import { formDate, formDay } from '@/utils/date';

const getStartOfWeek = (date: Date) => {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    return new Date(startDate.setDate(diff));
};
const formCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}년 ${month}`;
};

export type viewMode = 'week' | 'month';

export default function CustomCalendar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const today = new Date();
    const [date, setDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [view, setView] = useState<viewMode>('week');
    const [mark, setMark] = useState<any[]>([]);

    const getStatisticData = async (date: string, period: period) => {
        const params = new URLSearchParams(location.search);
        const dogId = params.get(queryStringKeys.DOGID);
        if (!dogId) return;
        const data = await fetchDogMonthStatistic(Number(dogId), date, period);
        const newArray: any[] = [];
        Object.keys(data).forEach((v) => {
            if (data[v]) {
                newArray.push(v);
            }
        });
        setMark(newArray);
    };

    const handlePrevMonth = async () => {
        const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        if (today.getFullYear() >= prevMonth.getFullYear() && today.getMonth() >= prevMonth.getMonth()) {
            await getStatisticData(formDate(prevMonth), 'month');
        }
        setDate(prevMonth);
    };

    const handleNextMonth = async () => {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        if (today.getFullYear() >= nextMonth.getFullYear() && today.getMonth() >= nextMonth.getMonth()) {
            await getStatisticData(formDate(nextMonth), 'month');
        }
        setDate(nextMonth);
    };
    const toggleSwitch = () => {
        if (view === 'month') {
            setView('week');
        } else {
            getStatisticData(formDate(today), 'month');
            setView('month');
        }
    };
    const handleClickDay = (value: Date) => {
        const date = formDate(value);
        setDate(value);
        if (!mark.includes(date)) return;

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

    useEffect(() => {
        getStatisticData(formDate(today), 'week');
    }, []);
    return (
        <div className="w-full flex flex-col px-[30px] pt-4 justify-center items-center bg-white shadow rounded-bl-2xl rounded-br-2xl overflow-hidden">
            {view === 'month' && (
                <div className="w-full flex gap-2 justify-end mb-6">
                    <button onClick={handlePrevMonth}>
                        <img src={PrevMonth} alt="이전달" />
                    </button>
                    <span className="text-center text-neutral-800 text-base font-bold leading-normal">
                        {formCalendar(date)}
                    </span>
                    <button onClick={handleNextMonth}>
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
                onClickDay={handleClickDay}
                tileDisabled={({ date }) =>
                    view === 'month'
                        ? false
                        : !currentWeek.some((weekDate) => date.toDateString() === weekDate.toDateString())
                }
                tileContent={({ date, view }) => {
                    let html = [];
                    // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
                    if (mark.includes(formDate(date))) {
                        html.push(<div className="dot"></div>);
                    }
                    // 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
                    return (
                        <>
                            <div className="flex flex-col justify-center items-center gap-2">
                                <div className="days">{formDay(date)}</div>
                                {mark.includes(formDate(date)) ? (
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
                <button className="w-[30px] h-1 bg-neutral-200 rounded-sm" onClick={toggleSwitch}></button>
            </div>
        </div>
    );
}
