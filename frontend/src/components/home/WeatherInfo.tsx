import { gpsToGrid } from '@/utils/geo';

export default function WeatherInfo() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const data = gpsToGrid(position.coords.latitude, position.coords.longitude);
            console.log(data);
        });
    } else {
        /* 위치정보 사용 불가능 */
    }
    console.log('data');
    return (
        <>
            {' '}
            <div>WeatherInfo</div>
        </>
    );
}
