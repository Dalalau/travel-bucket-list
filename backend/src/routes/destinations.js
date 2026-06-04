const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getAll, getOne, create, update, remove, getStats
} = require('../controllers/destinationController');
const { destinationValidator } = require('../validators/destinationValidator');

router.use(auth);

router.get('/stats', getStats);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', destinationValidator, create);
router.put('/:id', destinationValidator, update);
router.delete('/:id', remove);

module.exports = router;