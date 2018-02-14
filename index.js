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

$.getJSON( "Resources/timetable1.json")
.done( timetable => {

  // 학년, 수업반 선택
  const grade = 1;

  const cursor = new TimetableDataManager(timetable, 1);
  const choices = new Choices(cursor);

  chooseAndAsk();

  function onClickSubject(event) {
    const lesson = $(this).data('lesson');
    choices.choose(lesson);
    $('#choose').empty();

    if (cursor.isLast()) {
      result();
    } else {
      chooseAndAsk();
    }
  }

  function chooseAndAsk() {
    do {
      cursor.next();
      const lessons = cursor.lessons;

      if (lessons.length == 0) { // 공강
        choices.choose({
          subject: "공강",
          teacher: ""
        });
        continue;
      }

      else if (lessons.length == 1) {
        choices.choose(lessons[0]);
        continue;
      }

      else {
        const includesIndex = lessons.findIndex((lesson) => choices.includes(lesson));
        if (includesIndex != -1) {
          choices.choose(lessons[includesIndex]);
          continue;
        }
        else {
          for (const [index, lesson] of lessons.entries()) {
            const button =
              $(`<button>${lesson.subject}</button>`)
              .data( 'lesson', lesson )
              .click( onClickSubject )
              .appendTo( '#choose' );
          }
          break;
        }
      }
    } while (!cursor.isLast())

    if (cursor.isLast()) {
      result();
    }
  }

  function result() {
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

    template = Handlebars.compile($('#timetable-template').html());
    $('#table').append(template(data));

    OUTPUT = arranged;
  }
});


/**
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */
function transpose(a) {
    return Object.keys(a[0]).map(function (c) {
        return a.map(function (r) {
            return r[c];
        });
    });
}
