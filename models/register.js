var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RegisterSchema = new Schema(
    {
        userEmail: {type: String, required: true, maxLength: 100},
        userMobileNo :{type: String, required: true, maxLength: 100},
        userName : {type: String, required: true, maxLength: 100},
        userPassword: {type: String, required: true, maxLength: 100},
    }
);

module.exports = mongoose.model('Register', RegisterSchema);