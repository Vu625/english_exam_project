import React, { useState } from 'react';
        import axios from 'axios';

        const Result = ({ score, totalQuestions, incorrectDetails, onResetExam }) => {
            const [advice, setAdvice] = useState("");
            const [loadingAdvice, setLoadingAdvice] = useState(false);
            const [adviceError, setAdviceError] = useState(null);

            const getAdvice = async () => {
                setLoadingAdvice(true);
                setAdviceError(null);
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/advice/`, {
                        incorrect_details: incorrectDetails
                    });
setAdvice(response.data.advice);
                } catch (err) {
                    setAdviceError("Không thể lấy lời khuyên từ AI. Vui lòng kiểm tra API Google.");
                    console.error("Error fetching advice:", err);
                    setAdvice("Đã xảy ra lỗi khi tạo lời khuyên. Vui lòng thử lại sau hoặc kiểm tra kết nối với LLM.");
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
                                    <p><strong>Câu hỏi:</strong> {detail.question_text}</p>
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
                            <p style={styles.adviceText}>{advice}</p>
                        </div>
                    )}
                    
                    <div style={styles.buttonContainer}>
                        <button onClick={onResetExam} style={styles.resetButton}>Làm lại bài thi</button>
                    </div>
                </div>
            );
        };

        const styles = {
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
            }
        };

        export default Result
