const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Secret Key definition
const JWT_SECRET = process.env.JWT_SECRET || 'ZORDON_SECRET_2026';

// 🛠️ 1. REGISTER ROUTE (Fixed: Changed from '/signup' to '/register' to match frontend)
router.post('/register', async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, msg: 'Sabhi fields fill karna zaroori hai.' });
        }

        // Email normalization to prevent casing / whitespace issues
        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ email: cleanEmail });
        if (user) {
            return res.status(400).json({ success: false, msg: "Unit already deployed with this email" });
        }

        // Create new user instance
        user = new User({
            name: name.trim(),
            email: cleanEmail,
            password, 
            role: role || 'Ranger'
        });

        await user.save();

        res.status(201).json({ 
            success: true, 
            msg: "Unit Deployed Successfully! Proceed to Command Center." 
        });

    } catch (err) {
        console.error("🔥 SIGNUP ERROR:", err.message);
        res.status(500).json({ success: false, msg: "System Conflict: " + err.message });
    }
});

// 🚀 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, msg: 'Email aur password dono zaroori hain.' });
        }

        const cleanEmail = email.trim().toLowerCase();

        let user = await User.findOne({ email: cleanEmail });
        if (!user) return res.status(400).json({ success: false, msg: "Access Denied: Unit not found" });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ success: false, msg: "Access Denied: Invalid Encryption Key" });

        const payload = { 
            user: { 
                id: user.id, 
                role: user.role,
                name: user.name 
            } 
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.json({ 
                success: true, 
                token, 
                user: { 
                    id: user.id,
                    name: user.name, 
                    role: user.role 
                } 
            });
        });
    } catch (err) {
        console.error("🔥 CRITICAL LOGIN ERROR:", err.message);
        res.status(500).json({ success: false, msg: "System Conflict" });
    }
});

module.exports = router;