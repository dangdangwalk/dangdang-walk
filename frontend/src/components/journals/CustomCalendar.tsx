import { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import './CustomCalendar.css'; // Custom CSS for transitions

const getStartOfWeek = (date: any) => {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(startDate.setDate(diff));
};

type ValuePiece = Date | null;
export type viewMode = 'week' | 'month';

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function CustomCalendar() {
    const [date, setDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState<any[]>([]);
    const [view, setView] = useState<viewMode>('week');

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

    return (
        <>
            <div className="header">
                <button onClick={handlePrevWeek}>Previous</button>
                <button onClick={handleNextWeek}>Next</button>
            </div>
            <Calendar
                value={date}
                tileDisabled={({ date }) =>
                    view === 'month'
                        ? false
                        : !currentWeek.some((weekDate) => date.toDateString() === weekDate.toDateString())
                }
                tileContent={({ date }) => <p>{date.getDate()}</p>}
                activeStartDate={currentWeek[0]}
                onActiveStartDateChange={() => {}}
                showNeighboringMonth={view === 'week'}
            />
            <div className="w-full h-[30px] -rotate-180 bg-white rounded-tl-2xl rounded-tr-2xl justify-center items-center inline-flex">
                <button className="w-[30px] h-1 bg-neutral-200 rounded-sm" onClick={toggleSwitch}></button>
            </div>
        </>
    );
}
