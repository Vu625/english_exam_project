// frontend/src/ChatWindow.js (Đảm bảo file này đúng và không bị thay đổi)
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // THÊM DÒNG NÀY

function ChatWindow({ isOpen, onClose, currentQuestion, grammarTopic }) {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef(null);
    const [loading, setLoading] = useState(false);

        // THÊM DÒNG NÀY ĐỂ DEBUG
    console.log("ChatWindow - Loading state:", loading);
    console.log("ChatWindow - Current User:", currentUser);

    // Effect để tải lịch sử chat khi cửa sổ mở HOẶC khi người dùng thay đổi (đăng nhập/đăng xuất)
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (isOpen && currentUser) { // Chỉ tải khi cửa sổ mở VÀ có người dùng đăng nhập
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8000/api/chat/?user_id=${currentUser.uid}`);
                    setMessages(response.data.history);
                } catch (error) {
                    console.error("Lỗi khi tải lịch sử chat:", error);
                    setMessages([]); // Xóa lịch sử nếu có lỗi
                } finally {
                    setLoading(false);
                }
            } else if (!currentUser) {
                setMessages([]); // Xóa lịch sử nếu không có người dùng đăng nhập
            }
        };

        fetchChatHistory();
    }, [isOpen, currentUser]); // Thêm currentUser vào dependency array

    // Effect để scroll xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    // frontend/src/ChatWindow.js

// ... (các import và state khác không đổi) ...

    const handleSendMessage = async (messageToSend = input.trim()) => { // <--- THÊM messageToSend = input.trim()
    // Nếu messageToSend rỗng hoặc không có người dùng, thoát
    if (messageToSend === '' || !currentUser) return;

    // Sử dụng messageToSend thay vì input.trim()
    const newMessage = { role: "user", parts: [{ text: messageToSend }] };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInput(''); // Xóa input field sau khi gửi, vì tin nhắn đã được gửi

    setLoading(true);

    try {
        const requestData = {
            user_id: currentUser.uid,
            message: messageToSend, // Gửi messageToSend
            current_question_data: currentQuestion ? {
                ID: currentQuestion.ID,
                Question: currentQuestion.Question,
                A: currentQuestion.A,
                B: currentQuestion.B,
                C: currentQuestion.C,
                D: currentQuestion.D,
                Answer: currentQuestion.Answer,
                Explain: currentQuestion.Explain
            } : null,
            grammar_topic: grammarTopic || null
        };

        const response = await axios.post('http://localhost:8000/api/chat/', requestData);
        
        const botMessage = { role: "model", parts: [{ text: response.data.response }] };
        setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
        setMessages(prevMessages => [...prevMessages, { role: "model", parts: [{ text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau." }] }]);
    } finally {
        setLoading(false);
    }
};

// ... (phần còn lại của component không đổi) ...

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Gửi khi nhấn Enter, không gửi nếu nhấn Shift + Enter
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

        // --- THÊM HÀM MỚI CHO CÁC NÚT HÀNH ĐỘNG NHANH ---
    const sendQuickMessage = (quickMessage) => {
        // Có thể thêm logic để xác nhận hoặc tùy chỉnh quickMessage nếu cần
        handleSendMessage(quickMessage);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                borderTopLeftRadius: '9px',
                borderTopRightRadius: '9px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span>AI Tutor</span>
                <button onClick={onClose} style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.2em',
                    cursor: 'pointer'
                }}>
                    &times;
                </button>
            </div>

            {/* Chat Body */}
            <div style={{ flexGrow: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}>
                {/* Hiển thị context ban đầu nếu có */}
                {currentQuestion && (
                    <div style={{
                        backgroundColor: '#e0e0e0',
                        padding: '8px',
                        borderRadius: '5px',
                        marginBottom: '10px',
                        fontSize: '0.9em'
                    }}>
                        <p><strong>Câu hỏi liên quan:</strong> {currentQuestion.Question}</p>
                        <p><strong>Chủ đề ngữ pháp:</strong> {grammarTopic}</p>
                        <p style={{fontStyle: 'italic'}}>Bạn có thể hỏi tôi về câu hỏi này hoặc chủ đề ngữ pháp liên quan.</p>
                    </div>
                )}
                
                {messages.length === 0 && !loading && (
                    <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Chào bạn! Hãy hỏi tôi bất kỳ câu hỏi nào về tiếng Anh nhé.
                    </p>
                )}
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            backgroundColor: msg.role === 'user' ? '#dcf8c6' : '#fff',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            maxWidth: '75%',
                            wordWrap: 'break-word',
                            boxShadow: '0 1px 0.5px rgba(0,0,0,0.1)'
                        }}>
                            {msg.role === 'user' ? (
                                msg.parts.map((part, pIdx) => {
                                    const fullText = part.text;
                                    const userMsgPrefix = "Câu hỏi của người dùng: ";
                                    const startIndex = fullText.indexOf(userMsgPrefix);
                                    if (startIndex !== -1) {
                                        return <span key={pIdx}>{fullText.substring(startIndex + userMsgPrefix.length)}</span>;
                                    }
                                    return <span key={pIdx}>{fullText}</span>;
                                })
                            ) : (
                                <ReactMarkdown>
                                    {msg.parts.map(part => part.text).join('\n')}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '8px 12px',
                            borderRadius: '15px',
                            maxWidth: '75%',
                            wordWrap: 'break-word',
                            boxShadow: '0 1px 0.5px rgba(0,0,0,0.1)',
                            fontStyle: 'italic',
                            color: '#666'
                        }}>
                            <span className="typing-indicator">...</span> {/* Thêm class để sau này có thể tạo animation */}
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            
            {/* Quick Action Buttons - THÊM PHẦN NÀY VÀO */}
            {currentQuestion && ( // Chỉ hiển thị nếu có câu hỏi hiện tại
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap', // Cho phép các nút xuống dòng
                    gap: '5px', // Khoảng cách giữa các nút
                    padding: '10px',
                    borderTop: '1px solid #eee',
                    backgroundColor: '#f9f9f9'
                }}>
                    <button
                        onClick={() => sendQuickMessage("Giải thích câu hỏi này cho tôi.")}
                        style={quickActionButtonStyle}
                        disabled={loading}
                    >
                        Giải thích câu này
                    </button>
                    <button
                        onClick={() => sendQuickMessage("Cho tôi một gợi ý nhỏ.")}
                        style={quickActionButtonStyle}
                        disabled={loading}
                    >
                        Cho gợi ý
                    </button>
                    {grammarTopic && ( // Chỉ hiển thị nếu có chủ đề ngữ pháp
                        <button
                            onClick={() => sendQuickMessage(`Giải thích ngữ pháp "${grammarTopic}" cho tôi.`)}
                            style={quickActionButtonStyle}
                            disabled={loading}
                        >
                            Giải thích ngữ pháp "{grammarTopic}"
                        </button>
                    )}
                    <button
                        onClick={() => sendQuickMessage("Dịch câu hỏi và các đáp án")}
                        style={quickActionButtonStyle}
                        disabled={loading}
                    >
                        Dịch câu này.
                    </button>
                </div>
            )}
            
            {/* Input Area */}
            <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex' }}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    rows="2"
                    style={{
                        flexGrow: 1,
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        resize: 'none',
                        marginRight: '10px'
                    }}
                    disabled={loading || !currentUser}
                />
                <button
                    onClick={() => handleSendMessage()} // Gọi hàm handleSendMessage không đối số để gửi input
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        opacity: (loading || !currentUser) ? 0.7 : 1
                    }}
                    disabled={loading || !currentUser}
                >
                    Gửi
                </button>
            </div>
            {!currentUser && (
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: '10px',
                    color: '#333',
                    fontSize: '1.1em',
                    fontWeight: 'bold'
                }}>
                    <p>Vui lòng <Link to="/login" onClick={onClose} style={{color: '#007bff'}}>đăng nhập</Link> để sử dụng AI Tutor.</p>
                </div>
            )}
        </div>
    );
}

// Style cho các nút hành động nhanh
const quickActionButtonStyle = {
    padding: '6px 10px',
    backgroundColor: '#e9ecef',
    border: '1px solid #ced4da',
    borderRadius: '20px', // Nút bo tròn
    cursor: 'pointer',
    fontSize: '0.85em',
    color: '#333',
    whiteSpace: 'nowrap', // Ngăn không cho chữ xuống dòng trong nút
    flexShrink: 0 // Ngăn nút bị co lại
};

export default ChatWindow;