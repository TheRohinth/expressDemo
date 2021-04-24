/*
const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sample'
});

app.use(express.json());

app.get('/', function (req, res) {
    res.send("Rohinth");
})

app.get('/:name', function (req, res) {
    const name = req.params.name;
    console.log("Name : " , name);
    connection.query(
        `SELECT * FROM student WHERE name = "${name}"`,
        function(err, results) {
            if(err !== null)
            return res.json(err);
            console.log(results);
            if(results.length!=0)
                res.json(results);
            else
                res.json({Status : false});
        }
    );
})

app.post('/',function(req,res){
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    console.log(name,age,dob);
    connection.query(
        `INSERT INTO student VALUES ("${name}", "${age}", "${dob}")`,
        function(err, results) {
            if(err !== null)
            return console.log(err);
            res.json({Status : true});
        }
    );
})

app.put('/',function(req,res){
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    connection.query(
        `UPDATE student SET age = "${age}", dob = "${dob}" WHERE name = "${name}"`,
        function(err, results) {
            if(err !== null)
            return console.log(err);
            res.json({Status : true});
        }
    );
})

app.delete('/:name',function(req,res){
    const name = req.params.name;
    connection.query(
        `DELETE FROM student WHERE name = "${name}";`,
        function(err, results) {
            if(err !== null)
            return console.log(err);
            res.json(results);
        }
    );
})

app.listen(8081);

*/

const express = require('express');
const AWS = require("aws-sdk");
const app = express();

let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": "AKIAUHWFYGFRL5SERS7A", "secretAccessKey": "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"
};
AWS.config.update(awsConfig);
let docClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get('/:roll', function (req, res) {
    const roll = req.params.roll;
    console.log("Roll : " , roll);
    
    var params = {
        TableName: 'student',
        ExpressionAttributeValues: {':roll' : parseInt(roll,10)},
        KeyConditionExpression: "rollno = :roll",
    };

    docClient.query(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          res.send({Status : false});
        } else {
          console.log("Success", data);
          res.send({Status : true});
        }
    });
})

app.post('/',function(req,res){
    const roll = req.body.rollno;
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    console.log(roll,name,age,dob);
    
    var params = {
        TableName: 'student',
        Item: {
          'rollno' : roll,
          'std_name' : name,
          'age' : age,
          'dob' : dob
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
          console.log("Error", err);
          res.send({Status : false});
        } else {
          console.log("Success", data);
          res.send({Status : true});
        }
    });
})

app.put('/',function(req,res){
    const roll = req.body.rollno;
    const name = req.body.name;
    const age = req.body.age;
    const dob = req.body.dob;
    var params = {
        TableName: 'student',
        Key:{
            "rollno" : roll
        },
        UpdateExpression: "set std_name = :n, age= :a, dob= :d",
        ExpressionAttributeValues:{
            ":n": name,
            ":a":age,
            ":d":dob
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    docClient.update(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            res.send({Status : false});
        } else {
            console.log("Success", data);
            res.send({Status : true});
        }
    });
})

app.delete('/:rollno',function(req,res){
    const roll = req.params.rollno;

    var params = {
        TableName: 'student',
        Key:{
            "rollno": parseInt(roll, 10)
        }
    };
    
    docClient.delete(params, function(err, data) {
        if (err) {
            console.log("Error", err);
            res.send({Status : false});
        } else {
            console.log("Success", data);
            res.send({Status : true});
        }
    });
})


app.listen(8081);