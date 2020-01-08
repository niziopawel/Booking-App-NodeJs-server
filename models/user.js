const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        match: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 64
    },
    phone: {
        type: String,
        required: true,
        match: /^(?:\(?\+?48)?(?:[-\.\(\)\s]*(\d)){9}\)?$/
    }, 
    isAdmin: {
        type: Boolean,
        default: false
    }   

})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, 'jwtPrivateKey'
    //config.get('jwtPrivateKey')
    );
    return token;
}

module.exports = mongoose.model('User', userSchema);