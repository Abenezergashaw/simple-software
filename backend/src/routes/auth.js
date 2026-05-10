const router = require('express').Router();
const { login, me, refreshToken } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, me);

module.exports = router;
