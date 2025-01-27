import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import QuestionModel from '@/models/Question';

// PATCH /api/questions/[id] - Answer a question or mark as read
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const body = await req.json();
    const { answer, answeredBy, markAsRead } = body;
    const id = (await params).id;
    const question = await QuestionModel.findById(id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // If markAsRead is true, only update isRead status
    if (markAsRead) {
      question.isRead = true;
    } else {
      // Otherwise, handle answer update
      question.answer = answer;
      question.answeredBy = answeredBy;
      question.status = 'answered';
      question.isRead = true; // Mark as read when answered
    }

    await question.save();

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
} 