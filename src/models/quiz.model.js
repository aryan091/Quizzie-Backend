const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    correct: {
        type: Boolean,
        default: false,
    },
});

const questionSchema = new mongoose.Schema({
    pollQuestion: {
        type: String,
        required: true,
    },
    optionType: {
        type: String,
        enum: ['text', 'image', 'textImage'],
        required: true,
    },
    options: [optionSchema],
    timer: {
        type: String,
        enum: ['off', '5', '10'],
        default: 'off',
    },
    attempts: {
        type: Number,
        default: 0,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    incorrectAnswers: {
        type: Number,
        default: 0,
    },
});

const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        questions: {
            type: [questionSchema],
            validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        impressions: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

function arrayLimit(val) {
    return val.length <= 5;
}

module.exports = mongoose.model('Quiz', quizSchema);
