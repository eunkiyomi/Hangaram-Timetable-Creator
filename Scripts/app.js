import $ from "jquery";
import timetableTpl from "../Templates/timetable.handlebars";
import subjectButtonTpl from "../Templates/subject-button.handlebars";
import timetableJSON from "../Resources/timetable1.json";
import transpose from "./transpose.js"

class Choices {
  constructor(cursor) {
    this.cursor = cursor;
    this.choices = [];
    this.result = [ [],[],[],[],[] ];
  }

  includes(newLesson) {
    const newLessonEquals = function (lesson) {
      return newLesson.subject === lesson.subject;
    };

    return this.choices.findIndex( newLessonEquals ) !== -1;
  }

  choose(newLesson) {
    if (!this.includes(newLesson)) { this.choices.push(newLesson); }
    this.result[this.cursor.day][this.cursor.period] = newLesson;
  }
}

class TimetableDataManager {
  constructor(timetable, auditClass) {
    this.class = auditClass - 1; // 수업반은 1반부터, index는 0부터
    this.day = 0;
    this.period = -1;
    this.lesson = 0;
    this.table = timetable[this.class];
  }

  get lessons() {
    return this.table[this.day][this.period];
  }

  isLast() {
    return this.table[this.day].length - 1 == this.period && this.table.length - 1 == this.day;
  }

  next() {
    if (this.table[this.day].length - 1 > this.period) {
      this.period += 1;
    } else if (this.table.length - 1 > this.day) {
      this.period = 0;
      this.day += 1;
    }
    return this;
  }
}

var OUTPUT = {};

// 학년, 수업반 선택
const grade = 1;
const cursor = new TimetableDataManager(timetableJSON, 1);
const choices = new Choices(cursor);

chooseAndAsk();

function onClickSubject(event) { // 과목 선택 버튼 이벤트 리스너
  const lesson = $(this).data("lesson");
  choices.choose(lesson);
  $("#choose").empty();

  if (cursor.isLast()) {
    result();
  } else {
    chooseAndAsk();
  }
}

function chooseAndAsk() { // 메인 루프. 시간표 데이터를 훑으며 Choices 객체에 추가하다가 정해지지 않은 게 있으면 선택 버튼을 만든다
  do {
    cursor.next();
    const lessons = cursor.lessons;

    if (lessons.length == 0) { // 과목명이 비어있으면 공강으로 처리
      choices.choose({
        subject: "공강",
        teacher: ""
      });
      continue;
    }

    else if (lessons.length == 1) { // 고를 과목이 없으면 바로 등록
      choices.choose(lessons[0]);
      continue;
    }

    else {
      const includesIndex = lessons.findIndex((lesson) => choices.includes(lesson));
      if (includesIndex != -1) { // 이미 선택한 적이 있으면 그걸 등록
        choices.choose(lessons[includesIndex]);
        continue;
      }
      else { // 새로운 과목들이면 선택 버튼 만들기
        for (const [index, lesson] of lessons.entries()) {
          const button =
            $(subjectButtonTpl(lesson))
            .data( 'lesson', lesson )
            .click( onClickSubject )
            .appendTo( "#choose" );
        }
        break;
      }
    }
  } while (!cursor.isLast())

  if (cursor.isLast()) {
    result();
  }
}

function result() { // 결과를 표시하고 OUTPUT 변수에 저장한다.
  console.log(choices.result);

  const transposed = transpose(choices.result);
  const arranged = transposed.map((element, i) => {
    return {
      period: i + 1,
      lesson: element
    };
  });

  const data = {
    timetable: arranged
  }

  $("#table").append(timetableTpl(data));

  OUTPUT = arranged;
}
