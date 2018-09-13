const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    username:{
        type:"String",
        required:[true,"Username is required"],
        unique:[true,"username must be ubique"]
    },
    userId:{
        type:String,
        required:[true,"UserId is required to map"],
        unique:[true,"userId must be ubique"],
        ref:'users'
    },
    website:{
        type:String,

    },
    location:{
        countryCode:{
            type:String,
            required:true
        },
        zipCode:{
            type:String,
            required:true
        }
    }

});
module.exports = Profile = mongoose.model("profile",ProfileSchema);