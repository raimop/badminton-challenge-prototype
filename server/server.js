const express = require("express");
const mongoose = require('mongoose');
const path = require ("path")
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io")
const io = new Server(server, { cors: { origin: '*' } });
const Notification = require('./models/Notification');
const changeStream = Notification.watch()
const PORT = process.env.PORT || 8080;
require('dotenv').config();

const authRoutes = require('./routes/auth');
const rankingRoutes = require('./routes/ranking');
const challengeRoutes = require('./routes/challenge');
const notificationRoutes = require('./routes/notification');
const userRoutes = require('./routes/user');

io.on("connection", (socket) => {
  /* console.log("New client connected"); */
  changeStream.on('change', change => {
    if (change.operationType === 'insert'){
      socket.emit(change.fullDocument.to, change.fullDocument);
    }
  })
  /* socket.on("disconnect", () => {
    console.log("Client disconnected");
  }) */
});

app.use(cors());
app.use(express.json());

const db = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-vcwg6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/user', userRoutes);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../', 'client', 'build');
  
  app.use(express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(buildPath + "/index.html"))
}

server.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));