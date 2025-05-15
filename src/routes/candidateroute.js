const express = require('express'); 
const multer = require('multer'); 
const controller = require('../controllers/candidatecontroller'); 
 
const router = express.Router(); 
 
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/addCandidate', upload.single('image'), controller.addCandidate);
router.get('/', controller.getAllCandidates);
router.get('/byId/:id', controller.getCandidateById);
router.put('/', upload.single('image'), controller.updateCandidate);
router.delete('/:id', controller.deleteCandidate);
module.exports = router;