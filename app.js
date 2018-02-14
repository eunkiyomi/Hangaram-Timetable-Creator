$.getJSON( "Resources/timeTable1.json")
.done( timeTable1 => {

  // 학년, 수업반 선택
  var grade = 1;
  var auditClass = 1; // 수업반

  var days = timeTable1[auditClass - 1]; // 수업반 json
  var editedTable = [];

  var choices = [];
  var notChoices = [];

  var answered = false;

  for (let day in days) {
    for (let period in day) {
      if (period.length <= 1) { // 선택 가능한 과목이 하나
        choose(period[0].subject);
      } else { // 선택 가능한 과목 여럿
        chosenIndex = period.findIndex( lesson => chosen(lesson.subject) );
        if (chosenIndex != -1) {
          choose(period[chosenIndex].subject);
        } else {
          read.question(`You can choice ${period}`, answer => {
            let choice = period[answer];
            console.log(`Your choice: ${choice.subject}`);
            choose(choice.subject);
          });

          setTimeout(() => {}, 1000);
        }
      }
    }
  }

  console.log("Complete!");
  console.log(choices);

  function chosen(subject) {
    if (choices.indexOf(subject) == -1) { return false; }
    else { return true; }
  }

  function choose(subject) {
    if (!chosen(subject)) { choices.push(subject); }
  }

  function askChoice(subjects) {

  }



});
