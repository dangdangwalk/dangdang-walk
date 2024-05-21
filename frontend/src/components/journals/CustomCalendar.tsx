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

export type viewMode = 'week' | 'month';

export default function CustomCalendar() {
    const location = useLocation();
    const [mark, setMark] = useState<any[]>([]);
    const { toggleViewSwitch, handlePrevMonth, handleNextMonth, today, handleClickDay, date, currentWeek, view } =
        useCalendar();
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

    useEffect(() => {
        getStatisticData(formDate(today), 'week');
    }, []);
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
