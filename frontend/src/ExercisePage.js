import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ChatbotBubble from './ChatbotBubble'; // <--- Import ChatbotBubble mới
import ChatWindow from './ChatWindow'; // <--- Import ChatWindow

function ExercisePage({ type }) {
    const { topic } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [explanation, setExplanation] = useState('');

    // State cho Chat Window
    const [isChatWindowOpen, setIsChatWindowOpen] = useState(false); // <--- Đổi tên state cho rõ ràng
    const [chatContextQuestion, setChatContextQuestion] = useState(null); // <--- Đổi tên state
    const [chatContextGrammarTopic, setChatContextGrammarTopic] = useState(''); // <--- Đổi tên state

        useEffect(() => {
        // Mỗi khi câu hỏi hiện tại thay đổi, đóng cửa sổ chat nếu nó đang mở
        if (isChatWindowOpen) {
            handleCloseChatWindow();
        }
    }, [currentQuestionIndex]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                let apiUrl = '';
                if (type === 'grammar') {
                    apiUrl = `http://localhost:8000/api/exercises/${topic}/`;
                } else if (type === 'reading') {
                    apiUrl = `http://localhost:8000/api/reading-exercises/${topic}/`;
                } else {
                    console.error("Loại bài tập không hợp lệ:", type);
                    setQuestions([]);
                    return;
                }
                
                const response = await axios.get(apiUrl);
                setQuestions(response.data);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowResult(false);
                setIsCorrect(false);
                setExplanation('');
            } catch (error) {
                console.error("Lỗi khi tải câu hỏi:", error);
                setQuestions([]);
            }
        };
        fetchQuestions();
    }, [topic, type]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerChange = (e) => {
        setSelectedAnswer(e.target.value);
        setShowResult(false);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) {
            alert('Vui lòng chọn một đáp án.');
            return;
        }
        if (currentQuestion.Answer === selectedAnswer) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
        setExplanation(currentQuestion.Explain);
        setShowResult(true);
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setExplanation('');
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            alert('Bạn đã hoàn thành tất cả các câu hỏi trong chủ đề này!');
        }
    };

    // Hàm được gọi từ ChatbotBubble để mở ChatWindow
    const handleOpenChatWindow = (context) => {
        setIsChatWindowOpen(true);
        // context chứa question và grammarTopic từ ChatbotBubble
        setChatContextQuestion(context.question);
        setChatContextGrammarTopic(context.grammarTopic);
    };

    // Hàm đóng ChatWindow
    const handleCloseChatWindow = () => {
        setIsChatWindowOpen(false);
        setChatContextQuestion(null);
        setChatContextGrammarTopic('');
    };


    if (questions.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải câu hỏi hoặc không có câu hỏi nào...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Bài tập {type === 'grammar' ? 'Ngữ pháp' : 'Đọc hiểu'}: {topic.replace('-', ' ').toUpperCase()}</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                {type === 'reading' ? (
                    (() => {
                        const parts = currentQuestion.Question.split('\n\n');
                        if (parts.length >= 2 && parts[0].startsWith('Read the passage')) {
                            const passage = parts[1];
                            const actualQuestion = parts.slice(2).join('\n\n');
                            return (
                                <>
                                    <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>{parts[0]}</p>
                                    <div style={{ padding: '10px', border: '1px dashed #ccc', borderRadius: '5px', backgroundColor: '#fff', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
                                        {passage}
                                    </div>
                                    <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{currentQuestion.ID}. {actualQuestion}</p>
                                </>
                            );
                        }
                        return <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{currentQuestion.ID}. {currentQuestion.Question}</p>;
                    })()
                ) : (
                    <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{currentQuestion.ID}. {currentQuestion.Question}</p>
                )}
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['A', 'B', 'C', 'D'].map(option => (
                        <label key={option} style={{ cursor: 'pointer', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: selectedAnswer === option ? '#e0f7fa' : 'transparent' }}>
                            <input
                                type="radio"
                                name="answer"
                                value={option}
                                checked={selectedAnswer === option}
                                onChange={handleAnswerChange}
                                disabled={showResult}
                                style={{ marginRight: '10px' }}
                            />
                            {option}. {currentQuestion[option]}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                {!showResult ? (
                    <button 
                        onClick={handleSubmit} 
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}
                    >
                        Kiểm tra
                    </button>
                ) : (
                    <button 
                        onClick={handleNextQuestion} 
                        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}
                    >
                        Tiếp theo
                    </button>
                )}
            </div>

            {showResult && (
                <div style={{ marginTop: '20px', padding: '15px', border: `1px solid ${isCorrect ? '#28a745' : '#dc3545'}`, borderRadius: '5px', backgroundColor: isCorrect ? '#e6ffe6' : '#ffe6e6' }}>
                    <p style={{ fontWeight: 'bold', color: isCorrect ? '#28a745' : '#dc3545' }}>
                        {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                    </p>
                    <p>Giải thích: {explanation}</p>
                    <p>Đáp án đúng: {currentQuestion.Answer}</p>
                </div>
            )}

            {/* Chỉ hiển thị ChatbotBubble khi có câu hỏi và chủ đề để cung cấp ngữ cảnh */}
            {currentQuestion && topic && (
                <ChatbotBubble 
                    question={currentQuestion} 
                    grammarTopic={topic} // Dùng topic từ useParams cho ngữ pháp
                    onChatOpen={handleOpenChatWindow} 
                />
            )}
            
            {/* Component ChatWindow chính */}
            <ChatWindow 
                isOpen={isChatWindowOpen} 
                onClose={handleCloseChatWindow} 
                currentQuestion={chatContextQuestion} 
                grammarTopic={chatContextGrammarTopic} 
            />
        </div>
    );
}

export default ExercisePage;