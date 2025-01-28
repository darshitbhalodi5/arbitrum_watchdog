import mongoose, { Document } from "mongoose";

interface IQuestion extends Document {
  reportId: string;
  question: string;
  answer: string | null;
  askedBy: string;
  answeredBy: string | null;
  status: "pending" | "answered";
  isRead: boolean;
  isSubmitterQuestion: boolean;
  notifiedReviewers: string[];
  parentId: string | null;  // Reference to parent question for threads
  threadMessages: {
    message: string;
    sender: string;
    timestamp: Date;
    isRead: boolean;
  }[];
  createdAt: string;
}

const threadMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: null,
    },
    askedBy: {
      type: String,
      required: true,
    },
    answeredBy: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSubmitterQuestion: {
      type: Boolean,
      required: true,
    },
    notifiedReviewers: {
      type: [String],
      default: [],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },
    threadMessages: {
      type: [threadMessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionModel =
  (mongoose.models.Question as mongoose.Model<IQuestion>) ||
  mongoose.model<IQuestion>("Question", questionSchema);

export type { IQuestion };

export default QuestionModel;
