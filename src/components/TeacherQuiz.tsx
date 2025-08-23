import React, { useState } from 'react';
import './TeacherQuiz.css';

interface QuizQuestion {
    id: number;
    question: string;
    options: { value: string; label: string }[];
}

interface TeacherQuizProps {
    onComplete: (results: Record<string, string>) => void;
    onClose: () => void;
}

const TeacherQuiz: React.FC<TeacherQuizProps> = ({ onComplete, onClose }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    const questions: QuizQuestion[] = [
        {
            id: 1,
            question: "Mục tiêu học tiếng Anh của bạn là gì?",
            options: [
                { value: "conversation", label: "Giao tiếp thường ngày" },
                { value: "business", label: "Tiếng Anh thương mại" },
                { value: "exam", label: "Luyện thi (IELTS, TOEFL, ...)" },
                { value: "kids", label: "Dạy trẻ em" }
            ]
        },
        {
            id: 2,
            question: "Bạn thích phong cách giảng dạy như thế nào?",
            options: [
                { value: "friendly", label: "Thân thiện, thoải mái" },
                { value: "structured", label: "Có cấu trúc, kế hoạch rõ ràng" },
                { value: "interactive", label: "Tương tác nhiều" },
                { value: "strict", label: "Nghiêm khắc, yêu cầu cao" }
            ]
        },
        {
            id: 3,
            question: "Thời gian học tiếng Anh phù hợp với bạn?",
            options: [
                { value: "morning", label: "Buổi sáng (7h-12h)" },
                { value: "afternoon", label: "Buổi chiều (12h-18h)" },
                { value: "evening", label: "Buổi tối (18h-22h)" },
                { value: "flexible", label: "Linh hoạt" }
            ]
        },
        {
            id: 4,
            question: "Bạn thích giáo viên người nước nào?",
            options: [
                { value: "vietnamese", label: "Việt Nam" },
                { value: "native", label: "Bản ngữ (Anh, Mỹ, Úc...)" },
                { value: "asian", label: "Châu Á (Philippines, Singapore...)" },
                { value: "any", label: "Không quan trọng" }
            ]
        },
        {
            id: 5,
            question: "Mức giá mỗi buổi học phù hợp với bạn?",
            options: [
                { value: "economy", label: "Dưới 200.000đ" },
                { value: "standard", label: "200.000đ - 400.000đ" },
                { value: "premium", label: "400.000đ - 600.000đ" },
                { value: "luxury", label: "Trên 600.000đ" }
            ]
        }
    ];

    const handleAnswer = (value: string) => {
        const newAnswers = { ...answers };
        newAnswers[`q${questions[currentQuestion].id}`] = value;
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const handleComplete = () => {
        onComplete(answers);
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    return (
        <div className="quiz-container">
            <button className="quiz-close" onClick={onClose}>&times;</button>
            {!showResults ? (
                <>
                    <div className="quiz-progress">
                        <div
                            className="quiz-progress-bar"
                            style={{ width: `${(currentQuestion / (questions.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                    <div className="quiz-content">
                        <h2>Tìm giáo viên phù hợp với bạn</h2>
                        <p className="quiz-step">Câu hỏi {currentQuestion + 1} / {questions.length}</p>

                        <div className="quiz-question">
                            <h3>{questions[currentQuestion].question}</h3>
                            <div className="quiz-options">
                                {questions[currentQuestion].options.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`quiz-option ${answers[`q${questions[currentQuestion].id}`] === option.value ? 'selected' : ''}`}
                                        onClick={() => handleAnswer(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-navigation">
                            {currentQuestion > 0 && (
                                <button className="quiz-btn secondary" onClick={handlePrevious}>
                                    Quay lại
                                </button>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="quiz-results">
                    <h2>Cám ơn bạn đã hoàn thành!</h2>
                    <p>Chúng tôi đã tìm thấy các giáo viên phù hợp với tiêu chí của bạn.</p>
                    <button className="quiz-btn primary" onClick={handleComplete}>
                        Xem giáo viên phù hợp
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherQuiz;
