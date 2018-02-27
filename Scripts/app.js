import $ from "jquery";
import timetableTpl from "../Templates/timetable.handlebars";
import subjectButtonTpl from "../Templates/subject-button.handlebars";
import timetable1JSON from "../Resources/timetable1.json";
import timetable2JSON from "../Resources/timetable2.json";
import timetable3JSON from "../Resources/timetable3.json";
import transpose from "./transpose.js";
import TableExport from "tableexport";

console.log("he!");

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
    if (newLesson != Choices.BLANK_LESSON && !this.includes(newLesson)) {
      this.choices.push(newLesson);
    }
    this.result[this.cursor.day][this.cursor.period] = newLesson;
  }

  static get BLANK_LESSON() {
    return {
      subject: "공강",
      teacher: ""
    };
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
var cursor, choices;

$('#submit-class').click(function(event) {
  const grade = Number($('#select-grade').val());
  const auditClass = Number($('#select-audit-class').val());


  switch (grade) {
    case 1:
      cursor = new TimetableDataManager(timetable1JSON, auditClass);
      break;
    case 2:
      cursor = new TimetableDataManager(timetable2JSON, auditClass);
      break;
    case 3:
      cursor = new TimetableDataManager(timetable3JSON, auditClass);
      break;
    default: return;
  }

  choices = new Choices(cursor);

  $(this).prop("disabled", true);

  chooseAndAsk()
});

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
      choices.choose(Choices.BLANK_LESSON);
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
          $(subjectButtonTpl(lesson))
            .data( 'lesson', lesson )
            .click( onClickSubject )
            .appendTo( "#choose" );
        }

        $(subjectButtonTpl({ subject: "해당 없음", teacher: "" }))  // '해당 없음' 선택지 추가
          .data( 'lesson', Choices.BLANK_LESSON )
          .click( onClickSubject )
          .appendTo( "#choose" );

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
  $("#export-excel").click(exportTable);
  $("#print").click(printTable);

  $("#submit-class")
    .click(refreshPage)
    .html("다시 만들기")
    .prop("disabled", false);

  OUTPUT = arranged
}

function exportTable(event) {
  const exportManager = $("#table table").tableExport({
    headers: true,                              // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
    footers: true,                              // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
    formats: ['xlsx'],            // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
    filename: 'Timetable',                             // (id, String), filename for the downloaded file, (default: 'id')
    bootstrap: false,                           // (Boolean), style buttons using bootstrap, (default: true)
    exportButtons: false,                        // (Boolean), automatically generate the built-in export buttons for each of the specified formats (default: true)
    ignoreRows: null,                           // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
    ignoreCols: null,                           // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
    trimWhitespace: true                        // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
  });

  const data = exportManager.getExportData()['tableexport-1']['xlsx'];
  exportManager.export2file(data.data, data.mimeType, data.filename, data.fileExtension);
}

function printTable(event) {
  var printDivSmall = $('#table table').clone().appendTo('html').addClass('small');
  var printDivBig = $('#table table').clone().appendTo('html').addClass('big');

  $('body').hide();
  window.print();

  $('body').show();
  printDivSmall.remove();
  printDivBig.remove();
}

function refreshPage() {
  window.location.reload();
}
