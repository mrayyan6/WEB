const mongoose = require('mongoose');

const syncRecordSchema = new mongoose.Schema(
    {
        identifier:
        {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        clientData:
        {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        syncedAt:
        {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.SyncRecord || mongoose.model('SyncRecord', syncRecordSchema);