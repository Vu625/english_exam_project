import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Component cho Chatbot (sẽ phát triển sau)
function Chatbot({ question, grammarTopic, onChatOpen }) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        // Hiển thị gợi ý chatbot sau 5 giây nếu không có tương tác
        const id = setTimeout(() => {
            setMessage("Bạn cần tôi giải thích câu này không?");
            setIsVisible(true);
        }, 5000);
        setTimerId(id);

        return () => clearTimeout(id); // Dọn dẹp timer khi component unmount
    }, [question]); // Reset timer khi câu hỏi thay đổi

    const handleBubbleClick = () => {
        setIsVisible(false);
        clearTimeout(timerId); // Xóa timer khi mở chat
        onChatOpen({ question, grammarTopic }); // Gọi hàm mở cửa sổ chat trong ExercisePage
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
            {isVisible && (
                <div 
                    style={{
                        backgroundColor: '#e0f7fa', 
                        border: '1px solid #00bcd4', 
                        borderRadius: '10px', 
                        padding: '10px 15px', 
                        maxWidth: '250px', 
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                    onClick={handleBubbleClick}
                >
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#00796b' }}>{message}</p>
                </div>
            )}
            <button 
                style={{
                    backgroundColor: '#00bcd4', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '50px', 
                    height: '50px', 
                    fontSize: '1.5em', 
                    cursor: 'pointer', 
                    marginTop: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}
                onClick={handleBubbleClick}
            >
                💬
            </button>
        </div>
    );
}


function ChatWindow({ isOpen, onClose, currentQuestion, grammarTopic }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Cần reset chatMessages khi mở lại cửa sổ chat
    useEffect(() => {
        if (isOpen) {
            setChatMessages([]); // Xóa tin nhắn cũ khi cửa sổ chat mở
        }
    }, [isOpen]);

    const handleChatButtonClick = async (buttonType) => {
        let userMessage = '';
        let promptToSend = '';

        switch (buttonType) {
            case 'translate':
                userMessage = 'Dịch câu hỏi này';
                promptToSend = `Dịch câu tiếng Anh này sang tiếng Việt: "${currentQuestion.Question}"`;
                break;
            case 'hint':
                userMessage = 'Gợi ý cho tôi';
                promptToSend = `Hãy đưa ra một gợi ý nhỏ để giải quyết câu hỏi ngữ pháp này mà không tiết lộ đáp án. Câu hỏi: "${currentQuestion.Question}". Các lựa chọn: A: "${currentQuestion.A}", B: "${currentQuestion.B}", C: "${currentQuestion.C}", D: "${currentQuestion.D}"`;
                break;
            case 'explain_grammar':
                userMessage = 'Nói lại cho tôi phần ngữ pháp này đi, tôi quên mất rồi';
                // Đảm bảo grammarTopic có giá trị để tránh prompt rỗng
                const topicForGrammar = grammarTopic || "ngữ pháp tiếng Anh"; // Fallback nếu không có topic
                promptToSend = `Hãy giải thích lại chi tiết về chủ đề ngữ pháp: "${topicForGrammar}".`;
                break;
            // Thêm trường hợp cho lời giải thích cặn kẽ sau khi kiểm tra nếu cần
            case 'explain_after_check':
                userMessage = 'Giải thích chi tiết đáp án';
                promptToSend = `Tôi vừa trả lời câu hỏi "${currentQuestion.Question}". Đáp án đúng là "${currentQuestion.Answer}". Hãy giải thích cặn kẽ lý do tại sao đáp án đó đúng và phân tích các lựa chọn sai nếu có thể. Tập trung vào các quy tắc ngữ pháp liên quan đến "${grammarTopic}".`;
                break;
            default:
                return;
        }

        setChatMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Gửi prompt trực tiếp đến backend
            const response = await axios.post('http://localhost:8000/api/advice/', {
                chatbot_prompt: promptToSend // <--- Dữ liệu mới
            });
            setChatMessages(prev => [...prev, { sender: 'ai', text: response.data.advice }]);
        } catch (error) {
            console.error("Lỗi khi hỏi AI:", error);
            setChatMessages(prev => [...prev, { sender: 'ai', text: "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', bottom: '90px', right: '20px',
            width: '350px', height: '450px', backgroundColor: 'white',
            border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', zIndex: 1001
        }}>
            <div style={{ padding: '10px', backgroundColor: '#00bcd4', color: 'white', borderTopLeftRadius: '9px', borderTopRightRadius: '9px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Chatbot</strong>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2em', cursor: 'pointer' }}>X</button>
            </div>
            <div style={{ flexGrow: 1, padding: '10px', overflowY: 'auto', borderBottom: '1px solid #eee' }}>
                {chatMessages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                        <span style={{ 
                            display: 'inline-block', 
                            padding: '8px 12px', 
                            borderRadius: '15px', 
                            backgroundColor: msg.sender === 'user' ? '#e0f7fa' : '#c8e6c9', 
                            color: 'black' 
                        }}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                {isLoading && <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>Đang tải...</p>}
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button onClick={() => handleChatButtonClick('translate')} style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Dịch câu hỏi này</button>
                <button onClick={() => handleChatButtonClick('hint')} style={{ padding: '8px', backgroundColor: '#FFC107', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Gợi ý cho tôi</button>
                <button onClick={() => handleChatButtonClick('explain_grammar')} style={{ padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Nói lại phần ngữ pháp này đi</button>
                {/* Thêm nút giải thích chi tiết sau khi kiểm tra nếu cần */}
                {/* {showResult && <button onClick={() => handleChatButtonClick('explain_after_check')}>Giải thích chi tiết</button>} */}
            </div>
        </div>
    );
}
// ... (phần còn lại của ExercisePage.js không thay đổi) ...

function ExercisePage({ type }) { // <--- THÊM type vào đây
    const { topic } = useParams(); // Lấy topic từ URL (e.g., 'hien-tai', 'doan-van')
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [chatWindowOpen, setChatWindowOpen] = useState(false);
    const [currentChatQuestion, setCurrentChatQuestion] = useState(null);
    const [currentGrammarTopic, setCurrentGrammarTopic] = useState('');


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                let apiUrl = '';
                if (type === 'grammar') {
                    apiUrl = `http://localhost:8000/api/exercises/${topic}/`;
                } else if (type === 'reading') {
                    apiUrl = `http://localhost:8000/api/reading-exercises/${topic}/`; // DÙNG ENDPOINT MỚI
                } else {
                    console.error("Loại bài tập không hợp lệ:", type);
                    setQuestions([]);
                    return;
                }
                
                const response = await axios.get(apiUrl);
                setQuestions(response.data);
                setCurrentQuestionIndex(0); // Bắt đầu lại từ câu đầu tiên
                setSelectedAnswer(null);
                setShowResult(false);
                setIsCorrect(false);
                setExplanation('');
            } catch (error) {
                console.error("Lỗi khi tải câu hỏi:", error);
                setQuestions([]); // Đặt lại câu hỏi nếu có lỗi
            }
        };
        fetchQuestions();
    }, [topic, type]); // Chạy lại khi topic HOẶC type thay đổi

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
            // Có thể chuyển hướng về trang lựa chọn chủ đề
        }
    };

    const handleOpenChat = ({ question, grammarTopic }) => {
        setCurrentChatQuestion(question);
        setCurrentGrammarTopic(grammarTopic); // Sẽ là "Reading - Main Idea" hoặc "Reading - Detail" cho bài đọc
        setChatWindowOpen(true);
    };

    const handleCloseChat = () => {
        setChatWindowOpen(false);
        // setChatMessages([]); // Đã di chuyển logic này vào useEffect trong ChatWindow
    };

    if (questions.length === 0) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải câu hỏi hoặc không có câu hỏi nào...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {/* Cập nhật tiêu đề để phản ánh loại bài tập */}
            <h2>Bài tập {type === 'grammar' ? 'Ngữ pháp' : 'Đọc hiểu'}: {topic.replace('-', ' ').toUpperCase()}</h2>
            
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                {/* HIỂN THỊ CÂU HỎI VÀ ĐOẠN VĂN MỘT CÁCH PHÙ HỢP */}
                {type === 'reading' ? (
                    // Nếu là bài đọc, chia câu hỏi thành đoạn văn và câu hỏi phụ
                    // Giả định Question có dạng "Read the passage:\n\n[Đoạn văn]\n\n[Câu hỏi phụ]"
                    // Bạn có thể cần điều chỉnh cách parse nếu định dạng khác
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
                        // Fallback nếu định dạng không khớp, hiển thị toàn bộ Question
                        return <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{currentQuestion.ID}. {currentQuestion.Question}</p>;
                    })()
                ) : (
                    // Mặc định cho bài tập ngữ pháp
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

            {/* Chatbot Bubble and Window */}
            <Chatbot 
                question={currentQuestion} 
                grammarTopic={currentQuestion.Grammar} 
                onChatOpen={handleOpenChat} 
            />
            <ChatWindow 
                isOpen={chatWindowOpen} 
                onClose={handleCloseChat} 
                currentQuestion={currentChatQuestion} 
                grammarTopic={currentGrammarTopic} 
            />
        </div>
    );
}

export default ExercisePage;

