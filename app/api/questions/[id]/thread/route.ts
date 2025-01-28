import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb";
import QuestionModel from "@/models/Question";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const { message, sender } = await req.json();
    const questionId = (await params).id;

    // Find the question and add the thread message
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Add the new message to thread
    question.threadMessages.push({
      message,
      sender,
      timestamp: new Date(),
      isRead: false,
    });

    await question.save();

    return NextResponse.json(question);
  } catch (error) {
    console.error("Error adding thread message:", error);
    return NextResponse.json(
      { error: "Failed to add thread message" },
      { status: 500 }
    );
  }
}

// Get thread messages for a question
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();

    const questionId = (await params).id;
    const question = await QuestionModel.findById(questionId);

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question.threadMessages);
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch thread messages" },
      { status: 500 }
    );
  }
} 