// const express = require('express')
// const app = express()
//
// app.get('/', function (req, res) {
//   res.send('♥♥')
// })
//
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!')
// });

const fs = require("fs");
const timeTable1 = JSON.parse(fs.readFileSync("Resources/timeTable1.json"));

var grade = 1;
var auditClass = 1; // 수업반

var tableInClass = timeTable1[auditClass - 1]; // 수업반 json
var resultTable = [];



tableInClass[0].forEach(lessons => {
  if (lessons.length <= 1) {

  }
});



console.log(editedTable);

// function isAlphatbet(char) {
//   return /^[a-zA-Z]+$/.test(char);
// }
