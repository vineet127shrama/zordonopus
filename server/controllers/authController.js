const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register new operator
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Sabhi fields fill karna zaroori hai.' });
        }

        // Email ko clean aur lowercase banao
        const cleanEmail = email.trim().toLowerCase();

        // Check if user already exists
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Operator already in the system.' });
        }

        // Role Formatting Ensure karein
        let formattedRole = 'Ranger';
        if (role) {
            const formatted = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            if (['Ranger', 'Admin', 'Engineer'].includes(formatted)) {
                formattedRole = formatted;
            }
        }

        // Create User
        const user = await User.create({
            name: name.trim(),
            email: cleanEmail,
            password,
            role: formattedRole
        });

        if (user) {
            return res.status(201).json({
                success: true,
                message: "Unit Deployed Successfully!",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    } catch (error) {
        console.error("Registration Server Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate operator & get token
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email aur password dono zaroori hain.' });
        }

        const cleanEmail = email.trim().toLowerCase();

        // User find karein
        const user = await User.findOne({ email: cleanEmail });

        // Password check
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET || 'ZORDON_SECRET_777', 
                { expiresIn: '30d' }
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid Credentials: Access Denied' });
        }
    } catch (error) {
        console.error("Login Server Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};