const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    document: { type: String, required: true }, //
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminComment: { type: String }
});

module.exports = mongoose.model('Verification', VerificationSchema);
