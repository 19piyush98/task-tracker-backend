const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.signup = async (req, res) => {
    const { name, email, password, country } = req.body;
    try {
        const user = await User.create({ name, email, password, country });
        res.status(201).json({ token: generateToken(user._id) });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        res.json({ token: generateToken(user._id) });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
