// frontend/src/ChatbotBubble.js
import React, { useState, useEffect } from 'react';

function ChatbotBubble({ question, grammarTopic, onChatOpen }) {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        // Reset timer và ẩn bubble khi câu hỏi thay đổi hoặc khi component mount/unmount
        clearTimeout(timerId); 
        setIsVisible(false); // Ẩn bubble khi câu hỏi mới tải

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
        // Gọi hàm để mở cửa sổ chat trong ExercisePage và truyền dữ liệu
        onChatOpen({ question, grammarTopic }); 
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
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        marginBottom: '10px' // Khoảng cách với nút 💬
                    }}
                    onClick={handleBubbleClick}
                >
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#00796b' }}>{message}</p>
                </div>
            )}
            <button 
                style={{
                    backgroundColor: '#007bff', // Đổi màu để đồng bộ với ExercisePage
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '60px', // Lớn hơn một chút
                    height: '60px', 
                    fontSize: '2em', // Kích thước icon
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
                onClick={handleBubbleClick}
            >
                💬
            </button>
        </div>
    );
}

export default ChatbotBubble;