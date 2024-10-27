const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Usuário não encontrado" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Senha inválida" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
