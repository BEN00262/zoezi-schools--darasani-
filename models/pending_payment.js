const mongoose = require('mongoose');

const pendingPayment = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },

    metadata: {
        type: Object,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('pending_payment', pendingPayment);