// frontend/src/components/Result.js
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom

const Result = ({ score, totalQuestions, incorrectDetails, onResetExam }) => {
    const [advice, setAdvice] = useState("");
    const [recommendedTopics, setRecommendedTopics] = useState([]); // State mới cho các chủ đề đề xuất
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [adviceError, setAdviceError] = useState(null);

    // Ánh xạ slug sang tên hiển thị tiếng Việt (phải khớp với backend)
    const topicDisplayNames = {
            'hien-tai': 'Các thì hiện tại',
            'qua-khu': 'Các thì quá khứ',
            'tuong-lai': 'Các thì tương lai',
            'bi-dong': 'Câu bị động',
            'so-sanh': 'Cấu trúc so sánh',
            'dieu-kien': 'Câu Điều Kiện',
            'dong-tu-khuyet-thieu': 'Đông từ khuyết thiếu',
            'gia-dinh':'Câu giả định',
            'gian-tiep': 'Câu gián tiếp',
            'tu-loai': 'Từ Loại',
            'menh-de-quan-he':'Mệnh Đề Quan hệ'
    };

    const getAdvice = async () => {
        setLoadingAdvice(true);
        setAdviceError(null);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/advice/`, {
                incorrect_details: incorrectDetails
            });
            setAdvice(response.data.advice);
            setRecommendedTopics(response.data.recommended_topics || []); // Lấy các đề xuất
        } catch (err) {
            setAdviceError("Không thể lấy lời khuyên từ AI. Vui lòng kiểm tra API Google.");
            console.error("Error fetching advice:", err);
            setAdvice("Đã xảy ra lỗi khi tạo lời khuyên. Vui lòng thử lại sau hoặc kiểm tra kết nối với LLM.");
            setRecommendedTopics([]); // Reset nếu có lỗi
        } finally {
            setLoadingAdvice(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Kết quả bài thi</h2>
            <p style={styles.scoreText}>Điểm của bạn: {score}/{totalQuestions}</p>

            {incorrectDetails.length > 0 && (
                <div style={styles.section}>
                    <h3 style={styles.subtitle}>Các câu sai và giải thích:</h3>
                    {incorrectDetails.map((detail, index) => (
                        <div key={index} style={styles.incorrectItem}>
                            <p><strong>Câu hỏi {detail.question_id}:</strong> {detail.question_text}</p>
                            <p><strong>Đáp án của bạn:</strong> {detail.user_answer}</p>
                            <p><strong>Đáp án đúng:</strong> {detail.correct_answer_value}</p>
                            <p><strong>Giải thích:</strong> {detail.explanation}</p>
                            {detail.grammar && <p><strong>Chủ điểm ngữ pháp:</strong> {detail.grammar}</p>}
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.buttonContainer}>
                <button onClick={getAdvice} disabled={loadingAdvice} style={styles.button}>
                    {loadingAdvice ? 'Đang tạo lời khuyên...' : 'Nhận lời khuyên từ AI'}
                </button>
            </div>

            {adviceError && <div style={{ color: 'red', marginTop: '20px' }}>{adviceError}</div>}
            {advice && (
                <div style={styles.section}>
                    <h3 style={styles.subtitle}>Lời khuyên từ AI:</h3>
                    <ReactMarkdown style={styles.adviceText}>{advice}</ReactMarkdown> 
                </div>
            )}

            {/* HIỂN THỊ CÁC LIÊN KẾT ĐỀ XUẤT TẠI ĐÂY */}
            {recommendedTopics.length > 0 && (
                <div style={styles.section}>
                    <h3 style={styles.subtitle}>Các chủ đề mà bạn nên ôn tập:</h3>
                    <div style={styles.recommendedTopicsContainer}>
                        {recommendedTopics.map((topicSlug, index) => (
                            <Link 
                                key={index} 
                                to={`/on-tap/ngu-phap/${topicSlug}`} 
                                style={styles.recommendedTopicLink}
                            >
                                {topicDisplayNames[topicSlug] || topicSlug.replace(/-/g, ' ').toUpperCase()}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            <div style={styles.buttonContainer}>
                <button onClick={onResetExam} style={styles.resetButton}>Làm lại bài thi</button>
            </div>
        </div>
    );
};

const styles = {
    // ... (các styles cũ giữ nguyên) ...
    container: {
        backgroundColor: '#282c34',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        maxWidth: '800px',
        margin: '20px auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    },
    title: {
        fontSize: '2em',
        marginBottom: '15px',
        color: '#61dafb',
        textAlign: 'center'
    },
    scoreText: {
        fontSize: '1.5em',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px'
    },
    section: {
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #3a3f47'
    },
    subtitle: {
        fontSize: '1.3em',
        color: '#61dafb',
        marginBottom: '15px'
    },
    incorrectItem: {
        backgroundColor: '#3a3f47',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '15px',
        lineHeight: '1.6'
    },
    buttonContainer: {
        textAlign: 'center',
        marginTop: '20px'
    },
    button: {
        backgroundColor: '#61dafb',
        color: '#282c34',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '5px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginRight: '10px'
    },
    resetButton: {
        backgroundColor: '#f44336', // Màu đỏ cho nút reset
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '5px',
        fontSize: '1em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginLeft: '10px'
    },
    adviceText: {
        whiteSpace: 'pre-wrap', // Giữ định dạng xuống dòng từ AI
        backgroundColor: '#3a3f47',
        padding: '15px',
        borderRadius: '5px'
    },
    // Styles mới cho các liên kết đề xuất
    recommendedTopicsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '15px',
        justifyContent: 'center'
    },
    recommendedTopicLink: {
        backgroundColor: '#5cb85c', // Màu xanh lá cây để nổi bật
        color: 'white',
        padding: '10px 15px',
        borderRadius: '20px',
        textDecoration: 'none',
        fontSize: '0.95em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#4cae4c',
            transform: 'scale(1.05)'
        }
    }
};

export default Result;