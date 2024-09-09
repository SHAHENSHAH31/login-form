const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { verifyToken, verifyAdmin } = require('../midleware/authmid');


const router = express.Router();

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (user.blacklist == true||!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    

        // Generate JWT token
        const token = jwt.sign({user}, "chanchal", { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Blacklist a user, only admin can use this api
router.post('/blacklist',verifyToken,verifyAdmin, async (req, res) => {
    const { email } = req.body;
    console.log(req.user);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.blacklist = true;  // Set the user as blacklisted
        await user.save();

        res.json({ message: 'User has been blacklisted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from blacklist, admin
router.post('/remove-blacklist',verifyToken,verifyAdmin, async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.blacklist = false;  // Remove the user from blacklist
        await user.save();

        res.json({ message: 'User has been removed from the blacklist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// User signup route
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            email,
            password,
            role  // Default to false if isAdmin is not provided
        });

        // Save user to the database
        await newUser.save();

        // Generate a JWT token for the user
        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin },"chanchal", { expiresIn: '1h' });

        res.status(201).json({
            token,
            message: 'User registered successfully',
            isAdmin: newUser.isAdmin
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// only admin can see the list of login user 
router.get('/listUser',verifyToken,verifyAdmin, async(req,res)=>{
    try {
        const user = await User.find({});
      

        res.json({user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})


module.exports = router;
