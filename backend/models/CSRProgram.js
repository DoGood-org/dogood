const mongoose = require('mongoose');

const CSRProgramSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('CSRProgram', CSRProgramSchema);
