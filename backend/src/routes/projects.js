const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/public', ctrl.getPublicProjects);
router.get('/public/:id', ctrl.getPublicProject);

// Admin routes
router.use(authenticate);
router.get('/', ctrl.getAllProjects);
router.get('/:id', ctrl.getProject);
router.post('/', upload.single('thumbnail'), ctrl.createProject);
router.put('/:id', upload.single('thumbnail'), ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);
router.post('/:id/images', upload.array('images', 10), ctrl.addImages);
router.delete('/:id/images/:imageId', ctrl.deleteImage);

// Milestones
router.get('/:id/milestones', ctrl.getMilestones);
router.post('/:id/milestones', ctrl.createMilestone);
router.put('/:id/milestones/:mid', ctrl.updateMilestone);
router.delete('/:id/milestones/:mid', ctrl.deleteMilestone);

// Notes
router.get('/:id/notes', ctrl.getNotes);
router.post('/:id/notes', ctrl.createNote);
router.delete('/:id/notes/:nid', ctrl.deleteNote);

module.exports = router;
