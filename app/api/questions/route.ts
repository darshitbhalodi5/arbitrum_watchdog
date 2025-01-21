import { NextResponse } from 'next/server';
import {connect} from '@/lib/mongodb';
import Question from '@/models/Question';

// POST /api/questions - Create a new question
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const { reportId, question, askedBy } = body;

    const newQuestion = await Question.create({
      reportId,
      question,
      askedBy
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

// GET /api/questions - Get questions for a report
export async function GET(req: Request) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);
    const reportId = searchParams.get('reportId');
    const userAddress = searchParams.get('userAddress');
    const isReviewer = searchParams.get('isReviewer') === 'true';

    if (!reportId || !userAddress) {
      return NextResponse.json({ error: 'Report ID and user address are required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = { reportId };
    
    // If user is a reviewer, only show their own questions
    // If user is a submitter, show questions asked to them
    if (isReviewer) {
      query = { ...query, askedBy: userAddress };
    } else {
      // For submitter, find questions where they are the submitter
      query = { ...query, $or: [{ answeredBy: userAddress }, { answeredBy: null }] };
    }

    const questions = await Question.find(query).sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
} 