const express = require('express');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const router = express.Router();

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: "Autorização negada" });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ msg: "Token inválido" });
    }
};

// Criar novo post
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: "Acesso negado" });
    const { title, body } = req.body;
    const post = new Post({ title, body, userId: req.user.id });
    await post.save();
    res.status(201).json(post);
});

// Listar todos os posts
router.get('/', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

module.exports = router;

const { JSDOM } = require('jsdom');
const marked = require('marked');
const dompurify = require('dompurify')(new JSDOM().window);

// Exibir post com Markdown
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post não encontrado" });
    post.body = dompurify.sanitize(marked(post.body)); // Converter Markdown
    res.render('post', { post });
});
