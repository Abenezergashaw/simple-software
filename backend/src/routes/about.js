const router = require('express').Router();
const ctrl = require('../controllers/aboutController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.get('/', ctrl.get);
router.put('/', authenticate, requireAdmin, ctrl.update);

module.exports = router;
