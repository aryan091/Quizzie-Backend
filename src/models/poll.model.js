const mongoose = require('mongoose');
const { Schema } = mongoose;

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  selectionCount: {
    type: Number,
    default: 0,
  },
});

const questionSchema = new Schema({
  pollQuestion: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  optionType: {
    type: String,
    enum: ['text', 'image', 'textImage'],
    default: 'text',
  },
});

const pollSchema = new Schema(
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


const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
