const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const { default: sendEmail } = require('../config/mail');




exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, telephone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      telephone,
    });
    console.log("test");
    
    await user.save();
    const subject = "Compte Atlantic-conseil"
    const text = `votre mot de passe est: ${password}`
    sendEmail(email, subject, text)

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const payload = { id: user.id, email: user.email, role: user.role ,company : user.company};
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const { role, company } = req.user;

    let query = {};

    if (role === 'agent' && company) {
     
      query = { company: company };
    }

    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserRole = async (req, res) => {
    try {
   
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No or invalid token provided' });
      }
  
      const token = authHeader.split(' ')[1];
  
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decoded.id;
  
  
      const user = await User.findById(userId).select('role');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
   
      res.json({ role: user.role });
    } catch (error) {
      console.error('Error fetching user role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

 
exports.updateUser = async (req, res) => {
    const { firstName, lastName, email, password, telephone, role, company } = req.body;
    try {

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
  
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (telephone) user.telephone = telephone;
      if (role) user.role = role;
      if (company) user.company = company;
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
    

  exports.chartUser = async (req, res) => {
    try {
      const users = await User.find(query).select('-password');
  
     
      if (!users) {
        throw new Error('No users found');
      }
  
      const companyStats = users.reduce((acc, user) => {
        const company = user.company || 'No Company';
        if (!acc[company]) {
          acc[company] = 0;
        }
        acc[company] += 1;
        return acc;
      }, {});
  
     
      if (Object.keys(companyStats).length === 0) {
        throw new Error('No company stats found');
      }
  
      const chartData = Object.keys(companyStats).map(company => ({
        name: company,
        data: [companyStats[company]],
      }));
  
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching users:", error.message); 
      res.status(500).json({ message: 'Internal Server Error', error: error.message }); 
    }
  };
  