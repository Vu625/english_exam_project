import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exam = ({ onExamSubmit, questions, setQuestions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // {questionId: answerValue}
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Đảm bảo REACT_APP_API_URL được định nghĩa trong file .env của bạn
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions/`);
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                setError("Không thể tải đề thi. Vui lòng thử lại sau.");
                setLoading(false);
                console.error("Error fetching questions:", err);
            }
        };
        if (questions.length === 0) { // Chỉ tải nếu chưa có câu hỏi
            fetchQuestions();
        } else {
            setLoading(false);
        }
    }, [questions, setQuestions]);

    const handleAnswerChange = (questionId, answerValue) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerValue
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // Đã hết câu hỏi, hiển thị nút nộp bài
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleSubmit = () => {
        onExamSubmit(userAnswers);
    };

    if (loading) return <div style={styles.loadingError}>Đang tải đề thi...</div>;
    if (error) return <div style={{ ...styles.loadingError, color: '#ff6b6b' }}>{error}</div>;
    if (questions.length === 0) return <div style={styles.loadingError}>Không có câu hỏi nào để hiển thị.</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.questionNumber}>
                    Câu hỏi {currentQuestionIndex + 1}/{questions.length}
                </h2>
            </div>

            <div style={styles.questionCard}>
                <h3 style={styles.questionText}>{currentQuestion.question}</h3>
                <div style={styles.optionsGridContainer}> {/* Đổi từ optionsContainer sang optionsGridContainer */}
                    {/* Đáp án A và B */}
                    <div style={styles.optionsColumn}>
                        {['A', 'B'].map(optionKey => (
                            <label
                                key={optionKey}
                                style={{
                                    ...styles.optionLabel,
                                    backgroundColor: userAnswers[currentQuestion.id] === currentQuestion[optionKey]
                                        ? styles.optionLabel.activeBackgroundColor
                                        : styles.optionLabel.backgroundColor
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`question_${currentQuestion.id}`}
                                    value={currentQuestion[optionKey]}
                                    checked={userAnswers[currentQuestion.id] === currentQuestion[optionKey]}
                                    onChange={() => handleAnswerChange(currentQuestion.id, currentQuestion[optionKey])}
                                    style={styles.hiddenRadioInput}
                                />
                                <span style={styles.optionKey}>{optionKey}: </span> {currentQuestion[optionKey]}
                            </label>
                        ))}
                    </div>

                    {/* Đáp án C và D */}
                    <div style={styles.optionsColumn}>
                        {['C', 'D'].map(optionKey => (
                            <label
                                key={optionKey}
                                style={{
                                    ...styles.optionLabel,
                                    backgroundColor: userAnswers[currentQuestion.id] === currentQuestion[optionKey]
                                        ? styles.optionLabel.activeBackgroundColor
                                        : styles.optionLabel.backgroundColor
                                }}
                            >
                                <input
                                    type="radio"
                                    name={`question_${currentQuestion.id}`}
                                    value={currentQuestion[optionKey]}
                                    checked={userAnswers[currentQuestion.id] === currentQuestion[optionKey]}
                                    onChange={() => handleAnswerChange(currentQuestion.id, currentQuestion[optionKey])}
                                    style={styles.hiddenRadioInput}
                                />
                                <span style={styles.optionKey}>{optionKey}: </span> {currentQuestion[optionKey]}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div style={styles.navigationContainer}>
                {!isFirstQuestion && (
                    <button onClick={handlePrev} style={styles.navButton}>
                        <svg style={styles.navIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                        Trở về câu trước
                    </button>
                )}
                <div style={styles.spacer}></div>
                {!isLastQuestion && (
                    <button onClick={handleNext} style={styles.navButton}>
                        Tiếp theo
                        <svg style={styles.navIconRight} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    </button>
                )}
                {isLastQuestion && (
                    <button onClick={handleSubmit} style={{ ...styles.navButton, ...styles.submitButton }}>
                        Nộp bài
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1E252C',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    },
    header: {
        width: '100%',
        maxWidth: '700px',
        marginBottom: '20px',
        textAlign: 'left',
        paddingLeft: '20px',
    },
    questionNumber: {
        fontSize: '1.4em',
        color: '#61DAFB',
        fontWeight: '600',
        marginBottom: '15px',
    },
    loadingError: {
        color: '#fff',
        fontSize: '1.2em',
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#282c34',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
    questionCard: {
        backgroundColor: '#282C34',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
        maxWidth: '700px',
        width: '100%',
        marginBottom: '30px',
        border: '1px solid #3A3F47',
    },
    questionText: {
        fontSize: '1.6em',
        color: '#E0E0E0',
        marginBottom: '25px',
        fontWeight: 'bold',
        lineHeight: '1.5',
    },
    // *** Thay đổi quan trọng ở đây cho container chứa 2 cột ***
    optionsGridContainer: {
        display: 'flex', // Sử dụng flexbox để tạo 2 cột
        justifyContent: 'space-between', // Đẩy các cột ra hai bên
        gap: '20px', // Khoảng cách giữa 2 cột
        flexWrap: 'wrap', // Cho phép xuống dòng nếu màn hình nhỏ
    },
    optionsColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px', // Khoảng cách giữa các lựa chọn trong cùng một cột
        flex: '1 1 48%', // Mỗi cột chiếm khoảng 48% chiều rộng, cho phép co giãn
        minWidth: '250px', // Đảm bảo cột không quá nhỏ trên màn hình hẹp
    },
    // *** optionLabel vẫn giữ nguyên, nhưng sẽ nằm trong optionsColumn ***
    optionLabel: {
        backgroundColor: '#3A3F47',
        padding: '15px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        display: 'flex',
        alignItems: 'center',
        color: '#F0F0F0',
        fontSize: '1.1em',
        position: 'relative',
        '&:hover': {
            backgroundColor: '#4A4F57',
            transform: 'translateY(-2px)',
        },
        activeBackgroundColor: '#4CAF50', // Màu nền khi lựa chọn được chọn (màu xanh lá)
    },
    optionKey: {
        fontWeight: 'bold',
        marginRight: '8px',
        color: '#61DAFB',
    },
    hiddenRadioInput: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none',
    },
    navigationContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '700px',
        marginTop: '20px',
        gap: '20px',
    },
    navButton: {
        backgroundColor: '#61DAFB',
        color: '#282C34',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '30px',
        fontSize: '1.05em',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        minWidth: '150px',
        boxShadow: '0 4px 10px rgba(97, 218, 251, 0.3)',
        '&:hover': {
            backgroundColor: '#52c0e8',
            transform: 'translateY(-3px)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
        },
    },
    navIcon: {
        width: '24px',
        height: '24px',
        fill: '#282C34',
    },
    navIconRight: {
        width: '24px',
        height: '24px',
        fill: '#282C34',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
        '&:hover': {
            backgroundColor: '#45a049',
        },
    },
    spacer: {
        flexGrow: 1,
    }
};

export default Exam;