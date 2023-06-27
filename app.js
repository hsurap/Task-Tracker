const express = require('express')
const bodyParser=require("body-parser")
const date =require(__dirname+"/date.js");
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

let items=["Buy Food","Cook Food","Eat Food"]
let workItems=[];

app.get('/', (req, res) => {
//   res.send('Hello World!')
    
    let day=date.getDate();
    res.render("list",{
        listTitle:day,
        newListItems:items,
    })
})


app.post("/",(req,res)=>{
    let item=req.body.newItem
    console.log(req.body);
    if(req.body.list==="Work List"){
        workItems.push(item)
        res.redirect("/work")
    }else{
        items.push(item)
        res.redirect("/")
    }
})


app.get("/work",(req,res)=>{
    res.render("list",{
        listTitle:"Work List",
        newListItems:workItems,
    })
})

app.post("/work",(req,res)=>{
    let item=req.body.newItem
    workItems.push(item)
    res.redirect("/work")
})

app.get("/about",(req,res)=>{
    res.render("about")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})