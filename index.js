const express = require('express');
const path = require('path');
const cors = require('cors');
const Post = require('./models/Post');
const User = require('./models/User')
const Project = require('./models/project')
require('dotenv').config();
const connectDB = require('./config/db');
const fileRoutes = require('./routes/fileRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const postRoutes = require('./routes/postRoutes');
const File = require('./models/File');
const authenticateToken = require('./middleware/authenticateToken');
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

app.get('/check', authenticateToken, (req, res) => {
  if (req.user) {
      res.json({ authenticated: true, user: req.user });
  } else {
      res.json({ authenticated: false });
  }
});


app.get('/api/userss/total', async (req, res) => {
  try {
    // Check if the User model is working by fetching the total count of users
    const totalUsers = await User.countDocuments();

    // Return the total count of users
    res.status(200).json({ total: totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);

    // Return an error message in French
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

app.get('/api/projectss/total', async (req, res) => {
  try {
    // Check if the User model is working by fetching the total count of users
    const totalProjects = await Project.countDocuments();

    // Return the total count of users
    res.status(200).json({ total: totalProjects });
  } catch (error) {
    console.error("Error fetching total users:", error);

    // Return an error message in French
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

app.get('/api/filess/total', async (req, res) => {
  try {
    // Check if the User model is working by fetching the total count of users
    const totalFiles = await File.countDocuments();

    // Return the total count of users
    res.status(200).json({ total: totalFiles });
  } catch (error) {
    console.error("Error fetching total users:", error);

    // Return an error message in French
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

app.get('/api/filess/totaljour', async (req, res) => {
  try {
    // Aggregate total counts of files per day
    const totalFilesPerDay = await File.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          total: { $sum: 1 } // Count number of documents per day
        }
      },
      {
        $sort: { _id: 1 } // Sort by date
      }
    ]);

    // Return the aggregated data
    res.status(200).json(totalFilesPerDay);
  } catch (error) {
    console.error("Error fetching total files per day:", error);

    // Return an error message in French
    res.status(500).json({ message: "Erreur du serveur" });
  }
});


app.get('/api/postss/total', async (req, res) => {
  try {
    // Check if the User model is working by fetching the total count of users
    const totalPosts = await Post.countDocuments();

    // Return the total count of users
    res.status(200).json({ total: totalPosts });
  } catch (error) {
    console.error("Error fetching total users:", error);

    // Return an error message in French
    res.status(500).json({ message: "Erreur du serveur" });
  }
});

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


app.get('/api/userss/user-stats', async (req, res) => {
  try {
    // Aggregates user counts by company
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$company", // Group by company field
          totalUsersCount: { $sum: 1 } // Count the number of users in each group
        }
      }
    ]);

    // Format the result to be more user-friendly
    const formattedStats = userStats.map(stat => ({
      companyId: stat._id,
      totalUsersCount: stat.totalUsersCount
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Server running at http://148.113.194.169:${port}`);
});
