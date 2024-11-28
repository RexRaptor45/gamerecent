const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/saveScore', userController.saveScore);
router.get('/scores', userController.getScores);

module.exports = router;
