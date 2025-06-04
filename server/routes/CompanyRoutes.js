const express = require('express');
const router = express.Router();
const controller = require('../controllers/CompanyController');
const {authenticate, authorize} = require('../middlewares/auth');

// router.get('/', authenticate, authorize([1]), controller.getAll);
// router.get('/:id', authenticate, controller.getById);
// router.post('/', controller.create);
// router.put('/:id', authenticate, controller.update);
// router.delete('/:id', authenticate, authorize([1]), controller.remove);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.get('/:id/candidates', controller.getCompanyCandidates);
router.get('/:id/jobs', controller.getCompanyJobs);
router.get('/:id/appliedJobs', controller.getCompanyAppliedJobs);

module.exports = router;
