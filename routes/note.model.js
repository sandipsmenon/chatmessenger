const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    userID: String,
    oauthToken: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);