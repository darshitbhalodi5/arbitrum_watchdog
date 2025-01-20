import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: null
  },
  askedBy: {
    type: String,
    required: true // reviewer's wallet address
  },
  answeredBy: {
    type: String,
    default: null // submitter's wallet address
  },
  status: {
    type: String,
    enum: ['pending', 'answered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

export default Question; 