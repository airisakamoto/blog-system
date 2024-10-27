const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
