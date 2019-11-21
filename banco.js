
const mysql     = require('mysql');

const connection = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database : ""
  });

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('conectou.');
});

