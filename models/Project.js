const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Project', projectSchema);
