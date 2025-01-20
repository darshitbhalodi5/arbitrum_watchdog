import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (reportId) {
      fetchQuestions();
    }
  }, [reportId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?reportId=${reportId}`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    }
  };

  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          question: newQuestion,
          askedBy: user?.wallet?.address
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
          answeredBy: user?.wallet?.address
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

  return (
    <div className="mt-6 border-t border-gray-800 pt-6">
      <h4 className="text-white font-semibold text-sm sm:text-base mb-4">Questions & Answers</h4>
      
      {/* Chat Messages */}
      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
        {questions.map((q) => (
          <div key={q._id} className="space-y-3">
            {/* Question */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-[#4ECDC4]/10 rounded-lg p-3 max-w-[80%]">
                <p className="text-[#4ECDC4] text-sm">{q.question}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(q.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Answer (if exists) */}
            {q.answer && (
              <div className="flex items-start gap-3">
                <div className="bg-[#1A1B1E] rounded-lg p-3 max-w-[80%] border border-gray-800">
                  <p className="text-gray-300 text-sm">{q.answer}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(q.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="mt-4">
        {isReviewer ? (
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
        ) : (
          questions.some(q => !q.answer) && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:ring-2 focus:ring-[#4ECDC4] outline-none text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && selectedQuestion) {
                    handleAnswerQuestion(selectedQuestion._id);
                  }
                }}
                onClick={() => {
                  const unansweredQuestion = questions.find(q => !q.answer);
                  if (unansweredQuestion) {
                    setSelectedQuestion(unansweredQuestion);
                  }
                }}
              />
              <button
                onClick={() => selectedQuestion && handleAnswerQuestion(selectedQuestion._id)}
                className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:opacity-90 text-sm"
              >
                Send
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
} 