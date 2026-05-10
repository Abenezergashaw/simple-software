const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(authenticate);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

router.use(requireAdmin);
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
