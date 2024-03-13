const express=require("express")
const app=express()
const path=require("path")
const mongoose=require('mongoose');
const hbs = require('hbs');

//which view engine is used
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
 
const PORT=process.env.PORT || 3000

//for using static files
app.use(express.static('public'))

// Add middleware to parse urlencoded request bodies
app.use(express.urlencoded({ extended: true }));
/*
app.use("/", ...): This mounts the router at the specified route, 
which is the root URL ("/"). It means that any request made to 
the root URL ("/") will be passed to the router for further handling.
*/
app.use("/",require("./routes/contact"));

//connect to database
mongoose.connect('mongodb://127.0.0.1:27017/contact')
  .then(() => {
    console.log("connected to database");
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
        console.log(`http://localhost:${PORT}`);
    });
  });
 




