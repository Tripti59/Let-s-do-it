const express= require("express");
const app=express();
const ejs=require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static((__dirname, 'public')));
require('dotenv').config();

const today= new Date();
let todayDate= today.toDateString();
console.log(todayDate);
mongoose.set('strictQuery', false);
// mongoose.connect("mongodb://localhost:27017/todolistdb",{useNewUrlParser:true});
const DB=process.env.database;
mongoose.connect(DB).then(() => {
  console.log("Connection successful bh");
}).catch((err)=> console.log("cannot connect"));

const itemsSchema =new mongoose.Schema({
    task:{type:String},
    time:{type:String}
});

const list = new mongoose.model("list",itemsSchema); 

app.get('/', (req, res) => {

  list.find({},function(err,founddata){
    console.log(founddata);
    res.render('index', {date : todayDate , arr : founddata});
  })}
  );
// app.get('/delete',function(req,res){
//   res.redirect('/');
//   });

app.post('/', function(req,res){
  let task= req.body.newtask;
  let time= req.body.time;
  let newTask= new list({
      task:task,
      time:time
  });
  newTask.save();
  res.redirect('/');
});  

app.post('/delete', function(req,res){
    console.log(req.body.checkbox);
    var delId = req.body.checkbox;
    console.log(delId);
    list.findByIdAndRemove(delId , function(err){
      if(!err){console.log("deleted entry")}
    });
    res.redirect('/');
});

app.listen(3000 || process.env.PORT , function(){
    console.log("Server is listening to port 3000");
});


