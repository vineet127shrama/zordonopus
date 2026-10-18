const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Password hashing ke liye

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pehchaan (Name) batana zaroori hai'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email ID command center ke liye mandatory hai'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Secret Code (Password) set karein'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['Ranger', 'Admin', 'Engineer'],
        default: 'Ranger'
    }
}, { timestamps: true });

// PASSWORD ENCRYPTION: Save hone se pehle password ko hash karega
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// LOGIN HELPER: Password compare karne ke liye method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);