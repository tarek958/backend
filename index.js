const express = require('express');
const path = require('path');
const cors = require('cors');
const Post = require('./models/Post');
require('dotenv').config();
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();
const port = 5000;


connectDB();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/files', fileRoutes);
app.use('/api', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);

app.get('/api/postss/by-region', async (req, res) => {
    const { region, page = 1, limit = 10, keyword = '' } = req.query;
    try {
      const posts = await Post.find({ 
        region: new RegExp(region, 'i'), 
        descriptionDuPoste: new RegExp(keyword, 'i')
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
      const totalPosts = await Post.countDocuments({
        region: new RegExp(region, 'i'),
        descriptionDuPoste: new RegExp(keyword, 'i')
      });
  
      const totalPages = Math.ceil(totalPosts / limit);
  
      res.json({ posts, totalPages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.get('/api/postss/regions', async (req, res) => {
    try {
        const posts = await Post.find();
        const uniqueRegions = [...new Set(posts.map(post => post.region))]; 
        res.json(uniqueRegions); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
