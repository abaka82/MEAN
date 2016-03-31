var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    created_at: {type: Date, default: Date.now},
    modified_at: {type: Date}
});

var postSchema = new mongoose.Schema({
    created_by: String, // {type: Schema.ObjectId, ref: 'User' },
    created_at: {type: Date, default: Date.now},
    text: String
});

//Hooks example
userSchema.pre('save', function(next) {
    //prepare for saving
    console.log('Saving user success...');
    return next();
});

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);