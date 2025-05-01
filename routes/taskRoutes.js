const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    createProject,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getUserProjectsWithTasks,
} = require('../controllers/taskController');

router.get('/user-projects', auth, getUserProjectsWithTasks);
router.post('/project', auth, createProject);
router.post('/task', auth, createTask);
router.get('/tasks', auth, getTasks);
router.put('/task/:taskId', auth, updateTask);
router.delete('/task/:taskId', auth, deleteTask);

module.exports = router;