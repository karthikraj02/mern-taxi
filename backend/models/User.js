const mongoose =require('mongoose');
const UserScheme =new mongoose.Scheme(
    {
        name:String,
        email:{
            type:String,
            unique:true
        },
        password:String,
        role:{
            type:String,
            enum:['rider','driver']
        }
    }
);
module.exports =mongoose.model('User',UserSchema);