const router = require('express').Router();
const ctrl = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.get('/', ctrl.getAll);
router.use(authenticate, requireAdmin);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
