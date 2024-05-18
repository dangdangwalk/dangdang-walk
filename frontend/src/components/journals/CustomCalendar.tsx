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
export default function CustomCalendar() {
    const [date, setDate] = useState(new Date());
    const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

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
        const prevWeek = new Date(date);
        prevWeek.setDate(date.getDate() - 7);
        setDate(prevWeek);
    };

    const handleNextWeek = () => {
        const nextWeek = new Date(date);
        nextWeek.setDate(date.getDate() + 7);
        setDate(nextWeek);
    };

    return (
        <div className="weekly-calendar">
            <div className="header">
                <button onClick={handlePrevWeek}>Previous</button>
                <span>Week of {currentWeek[0] && currentWeek[0].toDateString()}</span>
                <button onClick={handleNextWeek}>Next</button>
            </div>
            <Calendar
                value={date}
                tileDisabled={({ date }) =>
                    !currentWeek.some((weekDate) => date.toDateString() === weekDate.toDateString())
                }
                tileContent={({ date }) => <p>{date.getDate()}</p>}
                activeStartDate={currentWeek[0]}
                onActiveStartDateChange={() => {}}
                showNeighboringMonth={false}
            />
        </div>
    );
}
