const Poll = require('../models/poll.model')
const asyncHandler = require("../utils/asyncHandler")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { decodeJwtToken , verifyToken } = require("../middlewares/verifyJwtToken")

const createPoll = asyncHandler(async (req, res) => {
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
      }

      const userId = req.userId;

  
      // Create and save the new quiz
      const newPoll = new Poll({
        title,
        questions,
        createdBy : userId 
      });
      const savedPoll = await newPoll.save();
  
      // Return the saved quiz
      return res.status(201).json(
        new ApiResponse(
            200,
            savedPoll,
            "Poll Created successfully",
            true
        )
      );
  
    } catch (error) {

      console.error(error);
      return res.status(400).json({ success: false, message: 'Poll creation failed' });
    }
  });

  const getallPoll = async  (req, res) => {
    try {
      const userId = req.userId;
      const polls = await Poll.find({ createdBy : userId }).sort({ impressions: -1 });
      return res.status(200).json(
        new ApiResponse(
            200,
            "Poll fetched successfully",
            polls,
            true
        )
      );
      
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Poll fetching failed' });

    }
  }

  const getPollById = async (req, res) => {
    const { pollId } = req.params;
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            poll,
            "Poll fetched successfully",
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const viewPoll = async (req, res) => {
    const { pollId } = req.params;
    try {
      const poll = await Poll.findById(pollId);
  if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Poll viewed successfully",
            poll,
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const updatePoll = async (req, res) => {
    const { pollId } = req.params;
    const { questions } = req.body;
  
    try {
      const updatedPoll = await Poll.findByIdAndUpdate(pollId, { questions }, { new: true });
      if (!updatedPoll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      res.status(200).json(
        new ApiResponse(
            200,
            "Poll updated successfully",
            updatedPoll,
            true
        )
      );
    } catch (error) {
      res.status(500).json({ message: error.message });
    } 
  }

  const deletePoll = async (req, res) => {
    const { pollId } = req.params;
    console.log("Poll ID to delete:", pollId);

    try {
        const deletedPoll = await Poll.findByIdAndDelete(pollId);
        if (!deletedPoll) {
            return res.status(404).json();
        }
        res.status(200).json(
            new ApiResponse(
                200,
                "Poll deleted successfully",
                deletedPoll,
                true
            )
        );
    } catch (error) {
        console.error("Error deleting poll:", error);
        res.status(500).json({ message: error.message });
    }
};


  const updatePollStats = async (req, res) => {
    const { pollId } = req.params;
    const { questionResults } = req.body;

    try {
        const poll = await Poll.findById(pollId);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        questionResults.forEach(result => {
            const question = poll.questions.id(result.questionId);

            if (question) {
                result.optionsSelected.forEach(optionIndex => {
                    if (optionIndex >= 0 && optionIndex < question.options.length) {
                        question.options[optionIndex].selectionCount += 1;
                    }
                });
            }
        });

        await poll.save();

        res.status(200).json(
            new ApiResponse(
                200,
                "Poll results submitted successfully",
                poll,
                true
            )
        );
    } catch (error) {
        console.error('Error submitting poll results:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const impressionIncrement = async (req, res) => {
  const { pollId } = req.params;
  try {
      const poll = await Poll.findByIdAndUpdate(pollId, { $inc: { impressions: 1 } }, { new: true });
      if (!poll) {
          return res.status(404).json({ message: 'Poll not found' });
      }
      res.status(200).json(
          new ApiResponse(
              200,
              "Poll impressions incremented successfully",
              poll,
              true
          )
      );
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

  
  module.exports = {
    createPoll,
    getallPoll,
    getPollById,
    viewPoll,
    updatePoll,
    deletePoll,
    updatePollStats,
    impressionIncrement
  };