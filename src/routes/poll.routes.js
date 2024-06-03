const express = require('express')
const router = express.Router()
const pollController = require('../controllers/poll.controller')
const { verifyToken } = require('../middlewares/verifyJwtToken.js')

router.post( "/create-poll", verifyToken , pollController.createPoll)

router.get('/get-all-polls' , verifyToken, pollController.getallPoll)
router.get('/get-poll/:pollId' , verifyToken, pollController.getPollById)
router.get('/view-poll/:pollId' , pollController.viewPoll)

router.put('/update-poll/:pollId' , verifyToken, pollController.updatePoll)
router.put('/update-poll-stats/:pollId' , pollController.updatePollStats)
router.put('/impression-increment/:pollId' , pollController.impressionIncrement)

router.delete('/delete-poll/:pollId' , verifyToken, pollController.deletePoll)


module.exports = router