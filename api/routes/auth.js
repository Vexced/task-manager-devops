const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await findUserByUsername(username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(username, hashedPassword);
  res.status(201).json({ id: user.id, username: user.username });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});


module.exports = router;
