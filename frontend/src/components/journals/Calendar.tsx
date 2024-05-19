import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
export default function Calen() {
    const [value, onChange] = useState(new Date());

    return (
        <div>
            <Calendar onChange={(value, event) => alert('New date is: ', value)} value={value} />
        </div>
    );
}
