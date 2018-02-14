var lessons = [
  {
    "subject": "수학IIA",
    "teacher": "태영"
  },
  {
    "subject": "수학IIB",
    "teacher": "영현"
  }
];

console.log(lessons);

console.log(lessons.map(lesson => lesson.reduce((a, b) => {
  return a.subject + b.subject;
})).join(','));
