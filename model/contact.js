const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const contactSchema=new Schema({
    id:String,
    name:String,
    phone:String,
    email:String,
    isShow:Boolean
});

const Contact=mongoose.model('Contact',contactSchema);
module.exports=Contact;


