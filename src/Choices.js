import {BLANK_LESSON} from "./index";

export default class Choices {

  constructor(cursor) {
    this.cursor = cursor;
    this.choices = [];
    this.result = [ [],[],[],[],[] ];
  }

  includes(newLesson) {
    return this.choices.findIndex(lesson => lesson.subject === newLesson.subject);
  }

  choose(newLesson) {
    if (newLesson !== BLANK_LESSON && !this.includes(newLesson)) {
      this.choices.push(newLesson);
    }
    this.result[this.cursor.day][this.cursor.period] = newLesson;
  }

}
