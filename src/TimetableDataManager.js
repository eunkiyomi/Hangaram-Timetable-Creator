export default class TimetableDataManager {

    constructor(timetable, auditClass) {
        this.day = 0;
        this.period = -1;
        this.lesson = 0;
        this.table = timetable[auditClass - 1];
    }

    get lessons() {
        return this.table[this.day][this.period];
    }

    isLast() {
        return this.table[this.day].length - 1 === this.period && this.table.length - 1 === this.day;
    }

    next() {
        if (this.period + 1 < this.table[this.day].length) {
            this.period++;
        } else if (this.day + 1 < this.table.length) {
            this.day++;
            this.period = 0;
        }
    }

}
