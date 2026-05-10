const router = require('express').Router();
const ctrl = require('../controllers/financeController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.use(authenticate, requireAdmin);
router.get('/reports', ctrl.getReports);
router.get('/summary', ctrl.getSummary);
router.get('/project/:projectId', ctrl.getProjectFinance);
router.put('/project/:projectId', ctrl.upsertProjectFinance);

module.exports = router;
