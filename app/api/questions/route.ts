import { NextResponse } from 'next/server';
import {connect} from '@/lib/mongodb';
import { QuestionModel } from '@/models/Question';
import { ReportModel } from '@/models/Report';

// POST /api/questions - Create a new question
export async function POST(req: Request) {
  try {
    await connect();
    const body = await req.json();
    const { reportId, question, askedBy, isSubmitterQuestion } = body;

    // Get report to check if it exists and get reviewer addresses
    const report = await ReportModel.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Create the question
    const newQuestion = await QuestionModel.create({
      reportId,
      question,
      askedBy,
      isSubmitterQuestion: isSubmitterQuestion || false,
      // If it's a submitter question, add all reviewer addresses to notifiedReviewers
      notifiedReviewers: isSubmitterQuestion ? report.votes.map(v => v.reviewerAddress) : []
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
    const query: any = { reportId };
    
    if (isReviewer) {
      // For reviewers, show questions they asked or submitter questions
      query.$or = [
        { askedBy: userAddress },
        { isSubmitterQuestion: true }
      ];
    } else {
      // For submitters, show all questions for their report
      query.reportId = reportId;
    }

    const questions = await QuestionModel.find(query).sort({ createdAt: -1 });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
} 