const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    criteria: { type: String, enum: ['donations', 'volunteering', 'both'], required: true },
    threshold: { type: Number, required: true } // Количество для получения бейджа
});

module.exports = mongoose.model('Badge', BadgeSchema);
