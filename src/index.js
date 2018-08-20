'use strict';
import $ from 'jquery';
import timetableTpl from '../dist/template/timetable.handlebars';
import subjectButtonTpl from '../dist/template/subject-button.handlebars';
import timetable1JSON from '../dist/resource/timetable1.json';
import timetable2JSON from '../dist/resource/timetable2.json';
import timetable3JSON from '../dist/resource/timetable3.json';
import optionalLessons from '../dist/resource/optional_subjects.json';
import Choices from './Choices';
import TimetableCursor from './TimetableCursor';
import {BLANK_LESSON, getRawSubjectWithoutClassIdentifier, transpose} from './util';

let OUTPUT = {};
let cursor, choices;

let grade = -1;

function onSubmitClass() {
    const selectGrade = document.getElementById('select-grade');
    const selectAuditClass = document.getElementById('select-audit-class');

    grade = Number(selectGrade.options[selectGrade.selectedIndex].value);
    const auditClass = Number(selectAuditClass.options[selectAuditClass.selectedIndex].value);

    switch (grade) {
        case 1:
            cursor = new TimetableCursor(timetable1JSON, auditClass);
            break;
        case 2:
            cursor = new TimetableCursor(timetable2JSON, auditClass);
            break;
        case 3:
            cursor = new TimetableCursor(timetable3JSON, auditClass);
            break;
        default:
            return;
    }

    choices = new Choices(cursor);
    this.disabled = true;

    chooseAndAsk()
}
document.getElementById('submit-class').addEventListener('click', onSubmitClass);

function chooseAndAsk() { // 메인 루프. 시간표 데이터를 훑으며 Choices 객체에 추가하다가 정해지지 않은 게 있으면 선택 버튼을 만든다
    loop:do {
        cursor.next();
        const lessons = cursor.getLessons().map(e => {
            if (e.subject.includes('자율')) {
                return {
                    ...e,
                    subject: '자율'
                }
            }
            return e;
        });

        switch (lessons.length) {
            case 0:
                choices.choose(BLANK_LESSON);
                break;
            case 1:
                if (!optionalLessons[grade - 1].includes(getRawSubjectWithoutClassIdentifier(lessons[0].subject))) {
                    choices.choose(lessons[0]);
                    break;
                }
            // fall-through if the lesson's optional
            default:
                const includesIndex = lessons.findIndex(lesson => choices.includes(lesson));
                if (includesIndex !== -1) { // 이미 선택한 적이 있으면 그걸 등록
                    for (let i = 0; i < lessons.length; i++) {
                        if (i !== includesIndex) {
                            choices.chooseNot(lessons[i]);
                        } else {
                            choices.choose(lessons[i]);
                        }
                    }

                } else { // 새로운 과목들이면 선택 버튼 만들기
                    let existChoices = false;
                    for (const [index, lesson] of lessons.entries()) {
                        if (!choices.includesNot(lesson)) {
                            $(subjectButtonTpl(lesson))
                                .data( 'lesson', lesson )
                                .click( onClickSubject )
                                .appendTo( '#choose' );
                            existChoices = true;
                        }
                    }

                    if (!existChoices) {
                        choices.choose(BLANK_LESSON);
                        continue;
                    }

                    $(subjectButtonTpl({ subject: '해당 없음', teacher: '' }))  // '해당 없음' 선택지 추가
                        .data( 'lesson', BLANK_LESSON )
                        .click( onClickSubject )
                        .appendTo( '#choose' );

                    break loop;
                }
        }
    } while (!cursor.isLast());

    if (cursor.isLast()) {
        result();
    }
}

function onClickSubject() { // 과목 선택 버튼 이벤트 리스너
    const lesson = $(this).data('lesson');
    choices.choose(lesson);
    cursor.getLessons().forEach(e => {
        if (e.subject !== lesson.subject) {
            choices.chooseNot(e);
        }
    });

    const choose = document.getElementById('choose');
    while (choose.firstChild) {
        choose.removeChild(choose.firstChild);
    }

    if (cursor.isLast()) {
        result();
    } else {
        chooseAndAsk();
    }
}


function result() { // 결과를 표시하고 OUTPUT 변수에 저장한다.
    const transposed = transpose(choices.result);
    const arranged = transposed.map((element, i) => {
        return {
            period: i + 1,
            lesson: element
        };
    });

    const data = {
        timetable: arranged
    };

    $('#audit-class-control')
        .append('<button class="button is-primary">다시 만들기</button>')
        .click(refreshPage);

    $('#table').append(timetableTpl(data));
    $('#print').click(printTable);

    $('#select-grade').hide();
    $('#select-audit-class').hide();
    $('.select').hide();
    $('#submit-class').hide();


    OUTPUT = arranged
}

function printTable() {
    const table = $('#table table');
    const printDivSmall = table.clone().appendTo('html').addClass('small');
    const printDivBig = table.clone().appendTo('html').addClass('big');
    document.body.style.display = 'none';
    window.print();
    document.body.style.display = 'block';
    printDivSmall.remove();
    printDivBig.remove();
}

function refreshPage() {
    window.location.reload();
}
