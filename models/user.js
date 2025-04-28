const { createHmac,randomBytes } = require('crypto');
const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    FullName:{
        type:String,
        required : true,
    },
    email:{
        type : String,
        required :true,
        unique : true,
    },
     salt:{
        type :String,
    },
    password:{
        type :String,
        required :true,
    },
    ProfileImg:{
        type : String,
        default :"/images/user.png",
    },
    role:{
        type : String,
        enum :["USER","ADMIN"],
        default :"USER",
    },

},
{timestamps : true},);

userSchema.pre("save",function(next){
    const user = this;

    if(!user.isModified("password")){
        return next();
    }

    const salt = randomBytes(16).toString();
    // const salt = 'someRandomString'; // For simplicity, using a fixed salt. In production, use randomBytes.
    const hashedPassword = createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

userSchema.static("matchPassword" ,async function(email , password) {
const user= await this.findOne({email});
if(!user) throw new Error("User not found");

const salt = user.salt;
const userhashedPassword = createHmac("sha256",salt)
.update(password)
.digest("hex");


if(userhashedPassword !== user.password){
    throw new Error("Invalid password");
}
return user
});

const User = model("User",userSchema);

module.exports = User;