const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const sendEmail = require('../config/mail');
const crypto = require('crypto');

const nodemailer = require('nodemailer');

exports.getTotalUsers = async (req, res) => {
  try {
    // Test the connection and model by fetching one user
    const testUser = await User.findOne();
    if (!testUser) {
      return res.status(404).json({ message: "No users found in the database" });
    }

    // Count the total number of users in the database
    const totalUsers = await User.countDocuments();

    // Send the total user count as a JSON response with a 200 status code
    res.status(200).json({ total: totalUsers });
  } catch (error) {
    console.error("Error fetching total users:", error);

    // Send a French error message in the specified format
    res.status(500).json({ message: "Erreur du serveur" });
  }
};
exports.addUser = async (req, res) => {
 
  const { firstName, lastName, email, password, telephone } = req.body;


 
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  const confirmationUrl = `http://148.113.194.169:5000/api/users/confirm/${confirmationToken}`;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Utilisateur existe déjà' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      telephone,
      confirmationToken 
    });

    await user.save();

    const subject = 'Nouveau Compte - Atlantis Conseil';
    const text =`Bonjour, le compte \n \n a été créé avec succès. \n e-mail: ${email} \n mot de passe: ${password} \n \n Veuillez vous connecter et modifier votre mot de passe lors de votre première connexion.\n \n Veuillez confirmer votre e-mail en cliquant sur le lien ci-dessous:\n\n${confirmationUrl} \n \nCordialement, \nAtlantis Conseil`

    await sendEmail(email, subject, text);

    res.status(201).json({ message: 'L\'utilisateur s\'est enregistré avec succès. Veuillez vérifier votre e-mail pour confirmer votre inscription.' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, telephone } = req.body;
  if (!firstName || !lastName || !email || !password || !telephone) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Format d\'email invalide' });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  const confirmationUrl = `http://148.113.194.169:5000/api/users/confirm/${confirmationToken}`;

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
      confirmationToken // Save the token to the user model
    });

    await user.save();

    const subject = 'Email Confirmation - Atlantis Conseil';
    const text = `Merci de vous être inscrit. Veuillez confirmer votre e-mail en cliquant sur le lien ci-dessous:\n\n${confirmationUrl}`;

    await sendEmail(email, subject, text);

    res.status(201).json({ message: 'L\'utilisateur s\'est enregistré avec succès. Veuillez vérifier votre e-mail pour confirmer votre inscription.' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Jeton invalide ou expiré.' });
    }

    if (user.confirmed) {
      return res.status(400).json({ message: 'Email est déjà confirmé.' });
    }

    user.isConfirmed = true;
    user.confirmationToken = null; 
    await user.save();

   
    res.redirect('http://148.113.194.169:3000/signin?confirmation=success');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if ( !password || !email) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'les informations d\'identification invalides' });
      
      const payload = { id: user.id, email: user.email, role: user.role ,company : user.company};
      const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '30d' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Erreur du serveur' });
    }
};


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
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
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};



exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

exports.getUserRole = async (req, res) => {
    try {
   
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Pas ou non valide fourni' });
      }
  
      const token = authHeader.split(' ')[1];
  
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decoded.id;
  
  
      const user = await User.findById(userId).select('role');
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
   
      res.json({ role: user.role });
    } catch (error) {
      console.error('Erreur récupérant le rôle de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

 
exports.updateUser = async (req, res) => {
    const { firstName, lastName, email, password, telephone, role, company } = req.body;
    try {

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
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
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  };
    

  exports.chartUser = async (req, res) => {
    try {
      const users = await User.find(query).select('-password');
  
     
      if (!users) {
        throw new Error('Aucun utilisateur trouvé');
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
        throw new Error('Aucune statistique d\'entreprise trouvée');
      }
  
      const chartData = Object.keys(companyStats).map(company => ({
        name: company,
        data: [companyStats[company]],
      }));
  
      res.json(chartData);
    } catch (error) {
      console.error("Erreur récupérant les utilisateurs:", error.message); 
      res.status(500).json({ message: 'Erreur interne du serveur', error: error.message }); 
    }
  };
