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
                    // Chúng ta sẽ xử lý việc nộp bài trong App.js
                }
            };

            const handleSubmit = () => {
                onExamSubmit(userAnswers);
            };

            if (loading) return <div>Đang tải đề thi...</div>;
            if (error) return <div style={{ color: 'red' }}>{error}</div>;
            if (questions.length === 0) return <div>Không có câu hỏi nào để hiển thị.</div>;

            const currentQuestion = questions[currentQuestionIndex];
            const isLastQuestion = currentQuestionIndex === questions.length - 1;

            return (
                <div style={styles.container}>
                    <h2 style={styles.questionNumber}>Câu hỏi {currentQuestionIndex + 1}/{questions.length}</h2>
                    <h3 style={styles.questionText}>{currentQuestion.question}</h3>
                    <div style={styles.optionsContainer}>
                        {['A', 'B', 'C', 'D'].map(optionKey => (
                            <label key={optionKey} style={styles.optionLabel}>
                                <input
                                    type="radio"
                                    name={`question_${currentQuestion.id}`}
                                    value={currentQuestion[optionKey]}
                                    checked={userAnswers[currentQuestion.id] === currentQuestion[optionKey]}
                                    onChange={() => handleAnswerChange(currentQuestion.id, currentQuestion[optionKey])}
                                    style={styles.radioInput}
                                />
                                {currentQuestion[optionKey]}
                            </label>
                        ))}
                    </div>
                    <div style={styles.buttonContainer}>
                        {!isLastQuestion && (
                            <button onClick={handleNext} style={styles.button}>Tiếp theo</button>
                        )}
                        {isLastQuestion && (
<button onClick={handleSubmit} style={styles.button}>Nộp bài</button>
                        )}
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
                maxWidth: '600px',
                margin: '20px auto',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            },
            questionNumber: {
                fontSize: '1.2em',
                marginBottom: '10px',
                color: '#61dafb'
            },
            questionText: {
                fontSize: '1.5em',
                marginBottom: '20px',
                fontWeight: 'bold'
            },
            optionsContainer: {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '30px'
            },
            optionLabel: {
                backgroundColor: '#3a3f47',
                padding: '12px 15px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            },
            radioInput: {
                marginRight: '8px',
                accentColor: '#61dafb' // Màu của radio button khi được chọn
            },
            buttonContainer: {
                textAlign: 'center'
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
            }
        };

        export default Exam;