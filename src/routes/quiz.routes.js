const express = require('express')
const router = express.Router()
const quizController = require('../controllers/quiz.controller.js')
const { verifyToken } = require('../middlewares/verifyJwtToken.js')

router.post( "/create-quiz", verifyToken , quizController.createQuiz )

router.get('/get-quizzes' , verifyToken, quizController.getallQuizzes)
router.get('/get-quiz/:quizId' , verifyToken, quizController.getQuizById)
router.get('/view-quiz/:quizId' , quizController.viewQuiz)

router.put('/update-quiz/:quizId' , verifyToken, quizController.updateQuiz)
router.put('/update-quiz-stats/:quizId' , quizController.updateQuizStats)
router.put('/impression-increment/:quizId' , quizController.impressionIncrement)

router.delete('/delete-quiz/:quizId' , verifyToken, quizController.deleteQuiz)


module.exports = router