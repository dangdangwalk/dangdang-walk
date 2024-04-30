import { fetchCurrentWeather } from '@/api/weather.api';
import { getCurrentDate } from '@/utils/date';

function Home() {
    const onClick = async () => {
        const date = getCurrentDate(new Date());
        const data = await fetchCurrentWeather({ date, time: '0200', nx: 12, ny: 12 });
        console.log(data);
    };

    return (
        <>
            <div className="">홈</div>
            <button onClick={onClick}>날씨</button>
        </>
    );
}

export default Home;
