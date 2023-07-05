//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _=require("lodash")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect('mongodb://localhost:27017/todoListDB',{useNewUrlParser:true});

const itemSchema={
  name:String
};

const listSchema={
  name:String,
  items:[itemSchema]
}

const Item=mongoose.model('Item',itemSchema)
const List=mongoose.model('List',listSchema)


const item1=new Item({
  name:"study"
})

const item2=new Item({
  name:"Do HW"
})

const item3=new Item({
  name:"eat food"
})

const defaultItems=[item1,item2,item3];






app.get("/", function(req, res) {

// const day = date.getDate();

  Item.find({}).then((foundItem)=>{
    // console.log(res);
    if(foundItem.length===0){
      Item.insertMany(defaultItems).then(()=>{
        console.log("yes");
      }).catch((e)=>{
        console.log(e);
      })
      res.redirect("/")
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItem});
    }
    
  }).catch((err)=>{
    console.log(err);
  })

  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list

  const newItem=new Item({
    name:itemName
  })

  if(listName==="Today"){
    newItem.save()
    res.redirect("/");
  }else{
    List.findOne({
      name:listName
    }).then((foundList)=>{
      foundList.items.push(newItem)
      foundList.save()
      res.redirect("/" + listName);
    }).catch((e)=>{
      console.log(e);
    })
  }

  

  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/:customListName",(req,res)=>{
  var customListName=_.capitalize(req.params.customListName)
  // res.send(customListName)
  List.findOne({
    name:customListName
  }).then((list)=>{
    if(!list)
    {
      // console.log("not");
      const list=new List({
        name:customListName,
        items:defaultItems
      })
      list.save()
      res.redirect("/"+customListName)
    }else{
      // console.log("yes");
      res.render("list", {listTitle: list.name, newListItems: list.items});
    }
  }).catch((e)=>{
    console.log(e);
  })
  

  
})

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/delete",(req,res)=>{
  // console.log(req.body.checkbox);
  const checkedItemId=req.body.checkbox
  const listName=req.body.listName

  if(listName==="Today")
  {
    Item.findByIdAndRemove(checkedItemId).then(()=>{
      // console.log("yes");
      res.redirect("/")
    }).catch((e)=>{
      console.log(e);
    })
  }else{
    List.findOneAndUpdate({
      name:listName
    },{
      $pull:{
        items:{
          _id:checkedItemId
        }
      }
    }).then(()=>{
      res.redirect("/"+listName)
    }).catch((e)=>{
      console.log(e)
    })
  }

  

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
