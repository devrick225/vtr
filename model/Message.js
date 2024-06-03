const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    conference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conference',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
