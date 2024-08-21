import { getSchedulerInstance } from './scheduler';

function init() {
    const scheduler = getSchedulerInstance();

    scheduler.scheduleOneHourRealWeatherPredicate();
    scheduler.scheduleTodayWeatherPredicate();
}

init();
