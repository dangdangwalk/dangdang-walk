import { getSchedulerInstance } from './scheduler/scheduler';

function init() {
    const scheduler = getSchedulerInstance();

    scheduler.scheduleOneHourRealWeatherPredicate();
    scheduler.scheduleTodayWeatherPredicate();
}

init();
