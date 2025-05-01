const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getUserProjectsWithTasks = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const projects = await Project.find({ user: userId })
        .lean(); 
  
      const projectIds = projects.map(p => p._id);
      const tasks = await Task.find({ project: { $in: projectIds } });
  
      const projectsWithTasks = projects.map(project => {
        return {
          ...project,
          tasks: tasks.filter(task => task.project.toString() === project._id.toString())
        };
      });
  
      res.status(200).json(projectsWithTasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error', error });
    }
  };

exports.createProject = async (req, res) => {
    const projectCount = await Project.countDocuments({ user: req.user._id });
    if (projectCount >= 4) return res.status(400).json({ msg: "Limit of 4 projects reached" });

    const project = await Project.create({ title: req.body.title, user: req.user._id });
    res.status(201).json(project);
};

exports.createTask = async (req, res) => {
    const { projectId, title, description } = req.body;
    const task = await Task.create({ project: projectId, title, description });
    res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
    const tasks = await Task.find({ project: req.query.projectId });
    res.json(tasks);
};

exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const updates = req.body;
    if (updates.status === 'completed') updates.completedAt = new Date();

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
    res.json(task);
};

exports.deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ msg: 'Task deleted' });
};
