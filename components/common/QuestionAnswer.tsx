import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import toast from 'react-hot-toast';

interface Question {
  _id: string;
  question: string;
  answer: string | null;
  askedBy: string;
  answeredBy: string | null;
  status: 'pending' | 'answered';
  createdAt: string;
  isRead?: boolean;
  isSubmitterQuestion?: boolean;
  notifiedReviewers?: string[];
}

interface Props {
  reportId: string;
  isReviewer: boolean;
}

export default function QuestionAnswer({ reportId, isReviewer }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { user } = usePrivy();

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/questions?reportId=${reportId}&userAddress=${user?.wallet?.address}&isReviewer=${isReviewer}`
      );
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    }
  }, [reportId, user?.wallet?.address, isReviewer]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          question: newQuestion,
          askedBy: user?.wallet?.address,
          isSubmitterQuestion: !isReviewer
        })
      });

      if (!response.ok) throw new Error('Failed to create question');

      setNewQuestion('');
      toast.success('Question submitted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to submit question');
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    if (!newAnswer.trim()) return;

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer: newAnswer,
          answeredBy: user?.wallet?.address,
          notifiedReviewers: []
        })
      });

      if (!response.ok) throw new Error('Failed to submit answer');

      setNewAnswer('');
      setSelectedQuestion(null);
      toast.success('Answer submitted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  };

  const markQuestionAsRead = async (questionId: string) => {
    try {
      await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          markAsRead: true,
          notifiedReviewers: user?.wallet?.address ? [user.wallet.address] : []
        })
      });
    } catch (error) {
      console.error('Error marking question as read:', error);
    }
  };

  const handleQuestionSelect = (question: Question) => {
    // For reviewers, allow selecting submitter questions to answer
    // For submitters, only allow selecting unanswered reviewer questions
    if ((isReviewer && question.isSubmitterQuestion && !question.answer) || (!isReviewer && !question.isSubmitterQuestion && !question.answer)) {
      setSelectedQuestion(question);
      if (!question.isRead) {
        markQuestionAsRead(question._id);
        setQuestions(prevQuestions => 
          prevQuestions.map(q => 
            q._id === question._id ? { ...q, isRead: true } : q
          )
        );
      }
    }
  };

  // Filter questions based on user role
  const filteredQuestions = questions.filter(q => 
    isReviewer ? 
      // For reviewers: show questions they asked or submitter questions
      q.askedBy === user?.wallet?.address || q.isSubmitterQuestion :
      // For submitters: show questions from reviewers or their own questions
      !q.isSubmitterQuestion || q.askedBy === user?.wallet?.address
  );

  return (
    <div className="mt-6 border-t border-gray-800 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-semibold text-sm sm:text-base">Questions & Answers</h4>
        {!isReviewer && filteredQuestions.some(q => !q.answer && !q.isRead && !q.isSubmitterQuestion) && (
          <div className="flex items-center">
            <span className="animate-pulse w-2 h-2 bg-[#FF6B6B] rounded-full mr-2"></span>
            <span className="text-[#FF6B6B] text-sm">New questions</span>
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {filteredQuestions.map((q) => (
          <div 
            key={q._id} 
            className={`p-3 rounded-lg ${
              (isReviewer ? q.isSubmitterQuestion : !q.isSubmitterQuestion) && !q.answer
                ? 'cursor-pointer hover:bg-[#4ECDC4]/5 border border-[#4ECDC4]/20'
                : 'hover:bg-[#2C2D31]'
            }`}
            onClick={() => handleQuestionSelect(q)}
          >
            {/* Question */}
            <div className="flex items-start gap-3 justify-end mb-3">
              <div className="bg-[#4ECDC4]/10 rounded-lg p-3 w-full">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {isReviewer ? 
                        (q.isSubmitterQuestion ? "Question from Submitter:" : "Your Question:") :
                        (q.isSubmitterQuestion ? "Your Question:" : "Question from Reviewer:")}
                    </p>
                    <p className="text-[#4ECDC4] text-sm">{q.question}</p>
                  </div>
                  {!isReviewer && !q.answer && !q.isRead && !q.isSubmitterQuestion && (
                    <span className="w-2 h-2 bg-[#FF6B6B] rounded-full flex-shrink-0 mt-1"></span>
                  )}
                </div>
              </div>
            </div>

            {/* Answer (if exists) */}
            {q.answer ? (
              <div className="flex items-start gap-3 ml-6">
                <div className="bg-[#1A1B1E] rounded-lg p-3 w-full border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">
                    {isReviewer ? 
                      (q.isSubmitterQuestion ? "Your Answer:" : "Submitter's Answer:") :
                      (q.isSubmitterQuestion ? "Reviewer's Answer:" : "Your Answer:")}
                  </p>
                  <p className="text-gray-300 text-sm">{q.answer}</p>
                </div>
              </div>
            ) : (
              (isReviewer && q.isSubmitterQuestion && selectedQuestion?._id === q._id) || 
              (!isReviewer && !q.isSubmitterQuestion && selectedQuestion?._id === q._id) ? (
                <div className="flex items-start gap-3 ml-6">
                  <div className="bg-[#1A1B1E] rounded-lg p-3 w-full border border-gray-800 border-dashed">
                    <p className="text-xs text-gray-500">Type your answer below</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-4">
        {selectedQuestion ? (
          <div className="flex flex-col gap-2">
            <div className="bg-[#1A1B1E] p-3 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-1">Replying to:</p>
              <p className="text-sm text-[#4ECDC4]">{selectedQuestion.question}</p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:ring-2 focus:ring-[#4ECDC4] outline-none text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleAnswerQuestion(selectedQuestion._id)}
              />
              <button
                onClick={() => handleAnswerQuestion(selectedQuestion._id)}
                className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:opacity-90 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:ring-2 focus:ring-[#4ECDC4] outline-none text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:opacity-90 text-sm"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 