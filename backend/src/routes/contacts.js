const router = require('express').Router();
const ctrl = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.post('/', ctrl.submit);
router.use(authenticate, requireAdmin);
router.get('/', ctrl.getAll);
router.put('/:id/read', ctrl.markRead);
router.delete('/:id', ctrl.remove);

module.exports = router;
