// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Exam from './components/Exam';
import Result from './components/Result';
import axios from 'axios';
import './App.css'; // Để thêm CSS global nếu cần

function App() {
    const [showResult, setShowResult] = useState(false);
    const [examResult, setExamResult] = useState(null);
    const [questions, setQuestions] = useState([]); // Lưu trữ câu hỏi đã tải
            const [loadingSubmit, setLoadingSubmit] = useState(false);
            const [submitError, setSubmitError] = useState(null);

            const handleExamSubmit = async (userAnswers) => {
                setLoadingSubmit(true);
                setSubmitError(null);
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/submit/`, {
                        answers: userAnswers
                    });
                    setExamResult(response.data);
                    setShowResult(true);
                } catch (err) {
                    setSubmitError("Không thể nộp bài. Vui lòng thử lại.");
                    console.error("Error submitting exam:", err);
                } finally {
                    setLoadingSubmit(false);
                }
            };

            const handleResetExam = () => {
                setShowResult(false);
                setExamResult(null);
                setQuestions([]); // Xóa câu hỏi để tải lại từ đầu
                setLoadingSubmit(false);
                setSubmitError(null);
            };

            return (
                <div className="App">
                    <header className="App-header">
                        <h1>Ứng dụng luyện thi tiếng Anh</h1>
                    </header>
                    <main>
                        {submitError && <div style={{ color: 'red', textAlign: 'center' }}>{submitError}</div>}
                        {loadingSubmit && <div style={{ textAlign: 'center' }}>Đang nộp bài...</div>}
                        
                        {!showResult ? (
                            <Exam 
                                onExamSubmit={handleExamSubmit} 
                                questions={questions} 
                                setQuestions={setQuestions} 
                            />
                        ) : (
                            examResult && (
                                <Result
                                    score={examResult.score}
                                    totalQuestions={examResult.total_questions}
                                    incorrectDetails={examResult.incorrect_details}
                                    onResetExam={handleResetExam}
                                />
                            )
                        )}
                    </main>
                </div>
            );
        }

        export default App;
            