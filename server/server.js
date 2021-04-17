const express = require("express");
const mongoose = require('mongoose');
const path = require ("path")
const cors = require("cors");
const PORT = process.env.PORT || 8080;
require('dotenv').config();

const authRoutes = require('./routes/auth');
const rankingRoutes = require('./routes/ranking');
const challengeRoutes = require('./routes/challenge');
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

const db = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-vcwg6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../', 'client', 'build');
  
  app.use(express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(buildPath + "/index.html"))
}

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));