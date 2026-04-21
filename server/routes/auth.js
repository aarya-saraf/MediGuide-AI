const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        user = new User({
            name,
            email,
            contact,
            password // In production, hash the password!
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid email or password" });
        }

        // Compare password (In production, use bcrypt)
        if (user.password !== password) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
