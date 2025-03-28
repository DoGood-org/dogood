const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);
