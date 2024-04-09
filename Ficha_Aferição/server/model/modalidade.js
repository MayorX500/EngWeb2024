const mongoose = require('mongoose');

var modalidadeSchema = new mongoose.Schema({
    _id: Number,
    modalidade: String,
    pessoas: [{
        _id: String,
        nome: String
    }]
}, { versionKey: false });

module.exports = mongoose.model('modalidades', modalidadeSchema);


