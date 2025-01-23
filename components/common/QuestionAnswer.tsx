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
  const [answerMap, setAnswerMap] = useState<{ [key: string]: string }>({});
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
    if (!newQuestion.trim()) {
        toast.error('Please enter your question');
        return;
    }

    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reportId,
                question: newQuestion,
                askedBy: user?.wallet?.address,
                isSubmitterQuestion: !isReviewer
            }),
        });

        if (!response.ok) throw new Error('Failed to submit question');

        setNewQuestion('');
        fetchQuestions();
        toast.success('Question submitted successfully');
    } catch (error) {
        console.error('Error submitting question:', error);
        toast.error('Failed to submit question');
    }
  };

  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerMap[questionId];
    if (!answer?.trim()) {
      toast.error('Please enter your answer');
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer,
          answeredBy: user?.wallet?.address,
          notifiedReviewers: []
        })
      });

      if (!response.ok) throw new Error('Failed to submit answer');

      setAnswerMap(prev => {
        const newMap = { ...prev };
        delete newMap[questionId];
        return newMap;
      });
      toast.success('Answer submitted successfully');
      fetchQuestions();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  };

  const canAnswerQuestion = (question: Question) => {
    if (isReviewer) {
      return question.isSubmitterQuestion && !question.answer;
    } else {
      return !question.isSubmitterQuestion && !question.answer;
    }
  };

  const getQuestionLabel = (question: Question) => {
    if (question.askedBy === user?.wallet?.address) {
      return 'Your Question';
    }
    return question.isSubmitterQuestion ? 'Asked by Submitter' : 'Asked by Reviewer';
  };

  const getAnswerLabel = (question: Question) => {
    if (question.answeredBy === user?.wallet?.address) {
      return 'Your Answer';
    }
    return question.isSubmitterQuestion ? 'Answered by Reviewer' : 'Answered by Submitter';
  };

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-[#B0E9FF]">Any Doubts?</h3>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:border-[#4ECDC4] focus:outline-none"
          />
          <button
            onClick={handleAskQuestion}
            className="px-4 py-2 rounded-lg relative overflow-hidden group"
            style={{
              background: "#020C1099",
              border: "1px solid",
              backdropFilter: "blur(80px)",
              boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-[#B0E9FF]">Ask</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 font-light">No conversations yet. Start by asking a question.</p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question._id}
              className="p-4 rounded-lg relative overflow-hidden"
              style={{
                background: "#020C1099",
                border: "1px solid",
                backdropFilter: "blur(80px)",
                boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-30" />
              <div className="relative space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs text-[#4ECDC4] mb-1 block">{getQuestionLabel(question)}</span>
                    <p className="text-[#B0E9FF] font-light">{question.question}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {question.answer && (
                  <div className="pl-4 border-l-2 border-[#4ECDC4]/30">
                    <span className="text-xs text-[#4ECDC4] mb-1 block">{getAnswerLabel(question)}</span>
                    <p className="text-white font-light">{question.answer}</p>
                  </div>
                )}

                {canAnswerQuestion(question) && (
                  <div className="space-y-2">
                    <textarea
                      value={answerMap[question._id] || ''}
                      onChange={(e) => setAnswerMap(prev => ({ ...prev, [question._id]: e.target.value }))}
                      placeholder="Type your answer..."
                      className="w-full bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:border-[#4ECDC4] focus:outline-none"
                      rows={2}
                    />
                    <button
                      onClick={() => handleAnswerQuestion(question._id)}
                      className="px-4 py-2 rounded-lg relative overflow-hidden group"
                      style={{
                        background: "#020C1099",
                        border: "1px solid",
                        backdropFilter: "blur(80px)",
                        boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative text-[#B0E9FF]">Submit Answer</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 