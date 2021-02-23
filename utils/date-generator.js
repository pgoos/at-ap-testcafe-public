import DateRange from "../data/models/dateRange";
var moment = require('moment');

export default class DateGenerator {
    static getYesterday() {
        return new DateRange({
            startDate: moment().subtract(1, 'day').format('MM/D/YYYY'),
            endDate: moment().subtract(1, 'day').format('MM/D/YYYY'),
        });
    }

    static getLastWeek() {
        return new DateRange({
            startDate: moment().subtract(1, 'week').startOf('isoWeek').format('MM/D/YYYY'),
            endDate: moment().subtract(1, 'week').endOf('isoWeek').format('MM/D/YYYY'),
        });
    }

    static getLastMonth() {
        return new DateRange({
            startDate: moment().subtract(1, 'month').startOf('month').format('MM/D/YYYY'),
            endDate: moment().subtract(1, 'month').endOf('month').format('MM/D/YYYY'),
        });
    }

    static getLastYear() {
        return new DateRange({
            startDate: moment().subtract(1, 'year').startOf('year').format('MM/D/YYYY'),
            endDate: moment().subtract(1, 'year').endOf('year').format('MM/D/YYYY'),
        });
    }
}