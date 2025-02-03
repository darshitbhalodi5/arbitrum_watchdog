import mongoose, { Document } from "mongoose";
import { Vote } from "@/types/vote";
import { MisuseRange } from "@/types/report";

interface IReport extends Document {
  additionalPaymentConfirmations: number;
  basePaymentConfirmations: number;
  _id: string;
  title: string;
  telegramHandle?: string;
  submitterAddress: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  severity?: "high" | "medium" | "low";
  misuseRange: MisuseRange;
  votes: Vote[];
  kycStatus: "pending" | "completed";
  basePaymentStatus: "pending" | "completed" | "rejected";
  additionalPaymentStatus: "pending" | "completed" | "rejected";
  createdAt: string;
}

const voteSchema = new mongoose.Schema({
  reviewerAddress: {
    type: String,
    required: true,
  },
  vote: {
    type: String,
    enum: ["approved", "rejected"],
    required: true,
  },
  severity: {
    type: String,
    enum: ["high", "medium", "low"],
  },
  reviewerComment: String,
  basePaymentSent: {
    type: Boolean,
    default: false,
  },
  additionalPaymentSent: {
    type: Boolean,
    default: false,
  },
});

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    telegramHandle: {
      type: String,
      required: false,
      sparse: true
    },
    submitterAddress: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    severity: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    misuseRange: {
      type: String,
      enum: ["<5k", "5-20k", "20-50k", "50-100k", "100-500k", "500k+"],
      required: true,
    },
    votes: {
      type: [voteSchema],
      default: [],
    },
    kycStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    basePaymentStatus: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
    additionalPaymentStatus: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Export the mongoose model
export const ReportModel =
  (mongoose.models.Report as mongoose.Model<IReport>) ||
  mongoose.model<IReport>("Report", reportSchema);

// Export the interface type
export type { IReport };
