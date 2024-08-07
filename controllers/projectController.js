const Project = require('../models/project');


exports.addProject = async (req, res) => {
  const { name, company, email, telephone, message } = req.body;

  try {
    const project = new Project({
      name,
      company,
      email,
      telephone,
      message,
    });

    await project.save();

    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

  
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



exports.updateProject = async (req, res) => {
  const { name, company, email, telephone, message } = req.body;
  try {
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'project not found' });
    }

    
    if (name) project.firstName = name;
    if (company) project.company = company;
    if (email) project.email = email;
    if (telephone) project.telephone = telephone;
    if (message) project.message = message;

    

    await project.save();
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};