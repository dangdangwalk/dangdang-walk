import { useEffect, useState } from 'react';
// import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions
import { useSearchParams } from 'react-router-dom';
import { queryStringKeys } from '@/constants';
import dayjs from 'dayjs';
import PrevMonth from '@/assets/icons/btn-prev-month.svg';
import NextMonth from '@/assets/icons/btn-next-month.svg';

const getStartOfWeek = (date: any) => {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(startDate.setDate(diff));
};

export type viewMode = 'week' | 'month';

export default function CustomCalendar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [date, setDate] = useState<Date>(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
    const [view, setView] = useState<viewMode>('week');
    const [mark, setMark] = useState([dayjs().format('YYYY-MM-DD')]);

    useEffect(() => {
        const startOfWeek = getStartOfWeek(date);
        const week = Array.from({ length: 7 }).map((_, index) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + index);
            return day;
        });
        setCurrentWeek(week);
    }, [date]);

    const handlePrevWeek = () => {
        if (!date) return;
        const prevWeek = new Date(date);
        prevWeek.setDate(date.getDate() - 7);
        setDate(prevWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(date);
        nextWeek.setDate(date.getDate() + 7);
        setDate(nextWeek);
    };
    const toggleSwitch = () => {
        if (view === 'month') {
            setView('week');
        } else {
            setView('month');
        }
        console.log(view);
    };
    const handleClickDay = (value: Date) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(queryStringKeys.DATE, value.toISOString());
        setSearchParams(newSearchParams);
        setDate(value);
    };

    return (
        <div className="w-full flex flex-col px-[30px] pt-4 gap-6 justify-center items-center bg-white rounded-bl-2xl rounded-br-2xl overflow-hidden">
            {view === 'month' && (
                <div className="w-full flex gap-2 justify-end">
                    <button onClick={handlePrevWeek}>
                        <img src={PrevMonth} alt="이전달" />
                    </button>
                    <span className="text-center text-neutral-800 text-base font-bold leading-normal">
                        {dayjs(date).format('YYYY년 M월')}
                    </span>
                    <button onClick={handleNextWeek}>
                        <img src={NextMonth} alt="다음달" />
                    </button>
                </div>
            )}
            <Calendar
                value={date}
                prev2Label={null}
                next2Label={null}
                calendarType="gregory"
                showNavigation={false}
                activeStartDate={currentWeek[0]}
                onActiveStartDateChange={() => {}}
                showNeighboringMonth={view === 'week'}
                onClickDay={handleClickDay}
                formatDay={(locale, date) => dayjs(date).format('D')}
                tileDisabled={({ date }) =>
                    view === 'month'
                        ? false
                        : !currentWeek.some((weekDate) => date.toDateString() === weekDate.toDateString())
                }
                tileContent={({ date, view }) => {
                    // 날짜 타일에 컨텐츠 추가하기 (html 태그)
                    // 추가할 html 태그를 변수 초기화
                    let html = [];
                    // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
                    if (mark.find((x) => x === dayjs(date).format('YYYY-MM-DD'))) {
                        html.push(<div className="dot"></div>);
                    }
                    // 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
                    return (
                        <>
                            <div className="flex justify-center items-center">{html}</div>
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
