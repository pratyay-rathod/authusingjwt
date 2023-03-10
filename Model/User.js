const mongoose = require("mongoose");
const {isEmail} = require("validator")
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        minlength:[6,"email must contains 6th characters"],
        required:[true,"Please Enter Email Id"],
        validate:[isEmail,"Please Enter Valid Email Id"],
    },
    password:{
        type:String,
        required:[true,"PLease Enter Password"],
        minlength:[6,"Password must be contains 6 Characters"],
    }
});

// -- print saving before user saving to the collections --//

userSchema.pre('save',async function(next){
    const sault = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,sault);
    next();
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
       const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
}

// -- print documents after saved user's data in collection --//

// userSchema.post('save',function(doc,next){
//     console.log("user's data saved to the document of the collections");
// });

const user = mongoose.model("User",userSchema);

module.exports = user;