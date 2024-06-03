const Quiz = require('../models/quiz.model')
const asyncHandler = require("../utils/asyncHandler")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decodeJwtToken , verifyToken } = require("../middlewares/verifyJwtToken")

const createQuiz = asyncHandler(async (req, res) => {
    try {
      const { title, questions } = req.body;
  
      // Validate the input
      if (!title  || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
      }
  
      // Validate each question
      for (let question of questions) {
        if (!question.pollQuestion || !question.optionType || !Array.isArray(question.options) || question.options.length < 2) {
          return res.status(400).json({ success: false, message: 'Each question must have a pollQuestion, optionType, and at least 2 options' });
        }
        let correctOptionSelected = false;
        for (let option of question.options) {
          if (option.correct) correctOptionSelected = true;
        }
        if (!correctOptionSelected) {
          return res.status(400).json({ success: false, message: 'Each question must have one correct option' });
        }
      }

      const userId = req.userId;

  
      // Create and save the new quiz
      const newQuiz = new Quiz({
        title,
        questions,
        createdBy : userId 
      });
      const savedQuiz = await newQuiz.save();
  
      // Return the saved quiz
      return res.status(201).json(
        new ApiResponse(
            200,
            savedQuiz,
            "Quiz Created successfully",
            true
        )
      );
  
    } catch (error) {
      console.error(error);
      return res.status(400).json({ success: false, message: 'Quiz creation failed' });
    }
  });

  const getallQuizzes = async  (req, res) => {
    try {
      const userId = req.userId;
      const quizzes = await Quiz.find({ createdBy : userId }).sort({ impressions: -1 });
      return res.status(200).json(
        new ApiResponse(
            200,
            "Quizzes fetched successfully",
            quizzes,
            true
        )
      );
      
    } catch (error) {
      
    }
  }

  const getQuizById = async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Quiz fetched successfully",
            quiz,
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const viewQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Quiz viewed successfully",
            quiz,
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { questions } = req.body;
  
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, { questions }, { new: true });
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Quiz updated successfully",
            updatedQuiz,
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    } 
  }

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
      if (!deletedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Quiz deleted successfully",
            deletedQuiz,
            true
        )
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  const updateQuizStats = async (req, res) => {
    const { quizId } = req.params;
    const { questionResults } = req.body;

    try {
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        questionResults.forEach(result => {
            const question = quiz.questions.id(result.questionId);

            if (question) {
                question.attempts += result.attempts;
                question.correctAnswers += result.correct;
                question.incorrectAnswers += result.incorrect;
            }
        });

        await quiz.save();

        res.status(200).json(
            new ApiResponse(
                200,
                "Quiz results submitted successfully",
                quiz,
                true
            )
        );
    } catch (error) {
        console.error('Error submitting quiz results:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const impressionIncrement = async (req, res) => {
    const { quizId } = req.params;
    try {
        const quiz = await Quiz.findByIdAndUpdate(quizId, { $inc: { impressions: 1 } }, { new: true });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(
            new ApiResponse(
                200,
                "Quiz impressions incremented successfully",
                quiz,
                true
            )
        );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


  
  module.exports = {
    createQuiz,
    getallQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    viewQuiz,
    updateQuizStats,
    impressionIncrement
    }