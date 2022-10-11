const express = require('express');
const router = express.Router();
const homeRouter = require('../controllers/home');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const authController = require('../controllers/auth');



router.get('/', homeRouter.getHome);
router.get('/profile/:id', homeRouter.getProfile);
router.get('/login', ensureGuest, authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

module.exports = router;