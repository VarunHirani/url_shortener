// import mongoose from  "mongoose";
// import crypto from "crypto";
// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     avatar: {
//         type: String,
//         required: false,
//         default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
//     }
// });
// userSchema.pre('save',function(next){
//     if(!this.avatar && this.email){
//         this.avatar = getGravatarUrl(this.email);
//     }
//     next();
// });

// function getGravatarUrl(email){
//     const hash = require('crypto')
//     .createHash('md5')
//     .update(email.trim().toLowerCase())
//     .digest('hex');
//     return `https://www.gravatar.com/avatar/${hash}?d=mp&f=y`;
// }

// const User = mongoose.model("User",userSchema);

// export default User;

import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    avatar: {
        type: String,
        default:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    },
});

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
};

userSchema.set('toJSON',{
    transform: function(doc,ret){
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});
// userSchema.pre("save",async function (next){
//     if(!this.isModified("password")) return next;
//     this.password = await bcrypt.hash(this.password,10);
//     next();
// });
// userSchema.pre("save", function (next) {
//     if (!this.isModified("password")) return next();

//     bcrypt.hash(this.password, 10)
//         .then(hash => {
//             this.password = hash;
//             next();
//         })
//         .catch(next);
// });
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.pre("save", function () {
    if (!this.avatar && this.email) {
        this.avatar = getGravatarUrl(this.email);
    }
});

function getGravatarUrl(email) {
    const hash = crypto
        .createHash("md5")
        .update(email.trim().toLowerCase())
        .digest("hex");

    return `https://www.gravatar.com/avatar/${hash}?d=mp&f=y`;
}

const User = mongoose.model("User", userSchema);

export default User;