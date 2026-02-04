const UniqueCode = require('../models/UniqueCode');

// Generate a random 6-digit code
const generateUniqueCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a new unique code
exports.createUniqueCode = async (req, res) => {
    try {
        const code = generateUniqueCode();
        const newCode = new UniqueCode({ code });
        await newCode.save();
        res.status(201).json({ success: true, code: newCode });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all unique codes
exports.getAllUniqueCodes = async (req, res) => {
    try {
        const codes = await UniqueCode.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, codes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a unique code
exports.deleteUniqueCode = async (req, res) => {
    try {
        await UniqueCode.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Code deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle unique code status (active/inactive)
exports.toggleCodeStatus = async (req, res) => {
    try {
        const code = await UniqueCode.findById(req.params.id);
        if (!code) {
            return res.status(404).json({ success: false, message: 'Code not found' });
        }
        
        code.isActive = !code.isActive;
        code.lastModifiedAt = new Date();
        await code.save();
        
        res.status(200).json({ 
            success: true, 
            message: `Code ${code.isActive ? 'activated' : 'deactivated'} successfully`,
            code: code
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify a unique code
exports.verifyUniqueCode = async (req, res) => {
    try {
        const { code } = req.body;
        const uniqueCode = await UniqueCode.findOne({ code, isActive: true });
        
        if (!uniqueCode) {
            return res.status(400).json({ success: false, message: 'Invalid or inactive unique code' });
        }

        res.status(200).json({ success: true, message: 'Code verified successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
