const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { Post } = require('./models');

const app = express();
app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', (res, req) => {
  req.sendFile(path.join(__dirname, '/build/index.html'));
});


mongoose.connect("mongodb://127.0.0.1/company-introduction");

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB");
});


app.get('/noticedb', async (req, res) => {
  const posts = await Post.find({});
  res.json(posts);
  
});

app.post('/notice', (req, res) => {
  Post.create(req.body);
  res.json('post created');
});

app.delete('/notice/:id', async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.json('post deleted');
});

app.get('/notice/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.json(post);
});

app.put('/notice/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(id, {
    title: title,
    content: content,
  });
  res.json('post updated');
});

app.get('*', (res, req) => {
  req.sendFile(path.join(__dirname, '/build/index.html'));
});


app.listen(8080);