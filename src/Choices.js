'use strict';
import {BLANK_LESSON, getRawSubjectWithoutClassIdentifier, isSameSubjectWithDifferentClassIdentifier} from './util';

export default class Choices {

    constructor(cursor) {
        this.cursor = cursor;
        this.choices = [];
        this.choicesNot = []; // 버려진 과목들
        this.result = [ [],[],[],[],[] ];
    }

    includes(newLesson) {
        return this.choices.findIndex(lesson => lesson.subject === newLesson.subject) !== -1;
    }

    includesNot(newLesson) {
        if (this.choicesNot.findIndex(lesson => lesson.subject === newLesson.subject) !== -1) {
            return true;
        }

        return this.choices.findIndex(lesson => isSameSubjectWithDifferentClassIdentifier(lesson.subject, newLesson.subject)) !== -1;
    }

    choose(newLesson) {
        if (newLesson !== BLANK_LESSON && !this.includes(newLesson)) {
            this.choices.push(newLesson);
        }
        this.result[this.cursor.day][this.cursor.period] = {
            ...newLesson,
            subject: getRawSubjectWithoutClassIdentifier(newLesson.subject)
        };
    }

    chooseNot(newLesson) {
        if (newLesson !== BLANK_LESSON && !this.includesNot(newLesson)) {
            this.choicesNot.push(newLesson);
        }
    }

}
