const express = require('express');
const router = express.Router();
const homeRouter = require('../controllers/home');
const authController = require('../controllers/auth');


router.get('/', homeRouter.getHome);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;