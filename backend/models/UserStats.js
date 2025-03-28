const mongoose = require('mongoose');

const UserStatsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalDonations: { type: Number, default: 0 },
    volunteeringHours: { type: Number, default: 0 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }]
});

module.exports = mongoose.model('UserStats', UserStatsSchema);
