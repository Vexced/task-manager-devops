const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../models/taskModel');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const tasks = await getTasks(req.user.id);
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const task = await createTask(req.user.id, req.body);
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const task = await updateTask(req.user.id, req.params.id, req.body);
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await deleteTask(req.user.id, req.params.id);
  res.sendStatus(204);
});

module.exports = router;
