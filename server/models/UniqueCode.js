const mongoose = require("mongoose");

const UniqueCodeSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        length: 6 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    lastModifiedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("UniqueCode", UniqueCodeSchema);
