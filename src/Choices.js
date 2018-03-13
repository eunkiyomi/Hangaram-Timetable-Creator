import {BLANK_LESSON} from "./index";

export default class Choices {

    constructor(cursor) {
        this.cursor = cursor;
        this.choices = [];
        this.notChoices = []; // 버려진 과목들
        this.result = [ [],[],[],[],[] ];
    }

    includes(newLesson) {
        return this.choices.findIndex(lesson => lesson.subject === newLesson.subject) !== -1;
    }

    includesNot(newLesson) {
        // TODO: 물리IA를 선택한 경우 물리IB도 includesNot으로 취급.
        return this.notChoices.findIndex(lesson => lesson.subject === newLesson.subject) !== -1;
    }

    choose(newLesson) {
        if (newLesson !== BLANK_LESSON && !this.includes(newLesson)) {
            this.choices.push(newLesson);
        }
        this.result[this.cursor.day][this.cursor.period] = newLesson;
    }

}
