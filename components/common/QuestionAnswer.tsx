import { Question } from "@/types/qna";
import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";

interface QuestionAnswerProps {
  reportId: string;
  isReviewer: boolean;
  onRefresh?: () => Promise<void>;
}

const QuestionAnswer = ({ reportId, isReviewer, onRefresh }: QuestionAnswerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [threadMessage, setThreadMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerMap, setAnswerMap] = useState<{ [key: string]: string }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { user } = usePrivy();

  // Function to fetch questions
  const fetchQuestions = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/questions?reportId=${reportId}&userAddress=${user?.wallet?.address}&isReviewer=${isReviewer}`
      );
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch questions");
    }
  }, [reportId, user?.wallet?.address, isReviewer]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await fetchQuestions();
      if (onRefresh) {
        await onRefresh();
      }
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Error refreshing chat:", error);
      toast.error("Failed to refresh chat");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to add thread message
  const handleThreadMessage = async () => {
    if (!selectedQuestion || !threadMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${selectedQuestion._id}/thread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: threadMessage,
          sender: user?.wallet?.address,
        }),
      });

      if (!response.ok) throw new Error("Failed to add thread message");

      setThreadMessage("");
      fetchQuestions();
      toast.success("Message added to thread");
    } catch (error) {
      console.error("Error adding thread message:", error);
      toast.error("Failed to add message");
    }
  };

  // Function to ask question
  const handleAskQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter your question");
      return;
    }

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          question: newQuestion,
          askedBy: user?.wallet?.address,
          isSubmitterQuestion: !isReviewer,
          parentId: selectedQuestion?._id || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit question");

      setNewQuestion("");
      fetchQuestions();
      toast.success("Question submitted successfully");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit question");
    }
  };

  // Function to answer question
  const handleAnswerQuestion = async (questionId: string) => {
    const answer = answerMap[questionId];
    if (!answer?.trim()) {
      toast.error("Please enter your answer");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer,
          answeredBy: user?.wallet?.address,
          notifiedReviewers: [],
        }),
      });

      if (!response.ok) throw new Error("Failed to submit answer");

      setAnswerMap((prev) => {
        const newMap = { ...prev };
        delete newMap[questionId];
        return newMap;
      });
      fetchQuestions();
      toast.success("Answer submitted successfully");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    }
  };

  // Render thread messages
  const renderThreadMessages = (question: Question) => {
    if (!question.threadMessages?.length) return null;

    return (
      <div className="pl-8 mt-2 space-y-3">
        {question.threadMessages.map((msg, index) => {
          const isCurrentUser = msg.sender === user?.wallet?.address;
          return (
            <div
              key={index}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  isCurrentUser
                    ? 'bg-[#4ECDC4]/20 rounded-tr-none'
                    : 'bg-[#1A1B1E]/80 rounded-tl-none'
                }`}
              >
                <div className={`flex justify-between items-start gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* <span className="text-xs text-[#4ECDC4]">
                    {isCurrentUser ? 'You' : (msg.sender === question.askedBy ? 'Submitter' : 'Reviewer')}
                  </span> */}
                  <span className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${isCurrentUser ? 'text-[#B0E9FF]' : 'text-white'}`}>
                  {msg.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Condition to answer question
  const canAnswerQuestion = (question: Question) => {
    if (isReviewer) {
      return question.isSubmitterQuestion && !question.answer;
    } else {
      return !question.isSubmitterQuestion && !question.answer;
    }
  };

  // Question label for good experiance to both submitter and reviewer
  const getQuestionLabel = (question: Question) => {
    if (question.askedBy === user?.wallet?.address) {
      return "You";
    }
    return question.isSubmitterQuestion
      ? "Submitter"
      : "Reviewer";
  };

  // Answer label for good experiance to both submitter and reviewer
  const getAnswerLabel = (question: Question) => {
    if (question.answeredBy === user?.wallet?.address) {
      return "You";
    }
    return question.isSubmitterQuestion
      ? "Reviewer"
      : "Submitter";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">Questions & Answers</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1A1B1E] text-[#4ECDC4] hover:bg-[#2C2D31] transition-colors disabled:opacity-50 text-sm"
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Question Input */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={selectedQuestion ? "Add follow-up question..." : "Type your question here..."}
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
            <span className="relative text-[#B0E9FF]">
              {selectedQuestion ? "Add to Thread" : "Ask"}
            </span>
          </button>
          {selectedQuestion && (
            <button
              onClick={() => setSelectedQuestion(null)}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Questions and Answers List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#ffffff] font-light">
              No conversations yet. Start by asking a question.
            </p>
          </div>
        ) : (
          questions.filter(q => !q.parentId).map((question) => (
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
                {/* Question */}
                <div className={`flex ${question.askedBy === user?.wallet?.address ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    question.askedBy === user?.wallet?.address
                      ? 'bg-[#4ECDC4]/20 rounded-tr-none'
                      : 'bg-[#1A1B1E]/80 rounded-tl-none'
                  }`}>
                    <div className={`flex justify-between items-start gap-2 ${
                      question.askedBy === user?.wallet?.address ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <span className="text-xs text-[#4ECDC4]">
                        {getQuestionLabel(question)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(question.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      question.askedBy === user?.wallet?.address ? 'text-[#B0E9FF]' : 'text-white'
                    }`}>
                      {question.question}
                    </p>
                  </div>
                </div>

                {/* Answer */}
                {question.answer && (
                  <div className={`flex ${question.answeredBy === user?.wallet?.address ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      question.answeredBy === user?.wallet?.address
                        ? 'bg-[#4ECDC4]/20 rounded-tr-none'
                        : 'bg-[#1A1B1E]/80 rounded-tl-none'
                    }`}>
                      <div className={`flex justify-between items-start gap-2 ${
                        question.answeredBy === user?.wallet?.address ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <span className="text-xs text-[#4ECDC4]">
                          {getAnswerLabel(question)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(question.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        question.answeredBy === user?.wallet?.address ? 'text-[#B0E9FF]' : 'text-white'
                      }`}>
                        {question.answer}
                      </p>
                    </div>
                  </div>
                )}

                {/* Thread Messages */}
                {renderThreadMessages(question)}

                {/* Thread Message Input */}
                {selectedQuestion?._id === question._id && question.answer && (
                  <div className="mt-2 pl-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={threadMessage}
                        onChange={(e) => setThreadMessage(e.target.value)}
                        placeholder="Add to thread..."
                        className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-3 py-1.5 text-sm border border-gray-800 focus:border-[#4ECDC4] focus:outline-none"
                      />
                      <button
                        onClick={handleThreadMessage}
                        className="px-3 py-1.5 rounded-lg border border-[#ffffff] bg-[#1A1B1E] text-[#4ECDC4] hover:bg-[#2C2D31] text-sm"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {/* Thread Actions */}
                <div className="flex justify-end gap-2">
                  {question.answer && (
                    <button
                      onClick={() => setSelectedQuestion(selectedQuestion?._id === question._id ? null : question)}
                      className="text-sm text-[#4ECDC4] hover:text-[#45b8b0]"
                    >
                      {selectedQuestion?._id === question._id ? "Cancel" : "Continue to Thread"}
                    </button>
                  )}
                </div>

                {/* Answer Input */}
                {canAnswerQuestion(question) && (
                  <div className="space-y-2">
                    <textarea
                      value={answerMap[question._id] || ""}
                      onChange={(e) =>
                        setAnswerMap((prev) => ({
                          ...prev,
                          [question._id]: e.target.value,
                        }))
                      }
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
                      <span className="relative text-[#B0E9FF]">
                        Submit Answer
                      </span>
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
};

export default QuestionAnswer;