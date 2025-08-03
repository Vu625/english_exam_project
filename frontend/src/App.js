// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import TestNhanhPage from './TestNhanhPage';
import HomePage from './HomePage';
import ExerciseSelectionPage from './ExerciseSelectionPage';
import GrammarTopicSelectionPage from './GrammarTopicSelectionPage';
import ExercisePage from './ExercisePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { AuthProvider, useAuth } from './AuthContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import VocabularyTopicSelectionPage from './VocabularyTopicSelectionPage'; // Đảm bảo đã import

// Component Header để hiển thị trạng thái đăng nhập và nút đăng xuất
function AppHeader() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert('Đăng xuất thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <nav style={{ padding: '15px 40px', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
      <h1 style={{ margin: 0, fontSize: '2em', fontFamily: '"Montserrat", sans-serif', color: '#4CAF50' }}>Doughnut English</h1>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
        <li style={{ marginLeft: '35px' }}>
          <Link to="/" style={{ color: '#333333', textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4CAF50'}
            onMouseLeave={e => e.currentTarget.style.color = '#333333'}>Trang Chủ</Link>
        </li>
        <li style={{ marginLeft: '35px' }}>
          <Link to="/on-tap" style={{ color: '#333333', textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4CAF50'}
            onMouseLeave={e => e.currentTarget.style.color = '#333333'}>Ôn tập</Link>
        </li>
        <li style={{ marginLeft: '35px' }}>
          <Link to="/test-nhanh" style={{ color: '#333333', textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4CAF50'}
            onMouseLeave={e => e.currentTarget.style.color = '#333333'}>Kiểm tra</Link>
        </li>
      </ul>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        {!loading && (
          currentUser ? (
            <>
              <span style={{ marginRight: '15px', color: '#333333', fontWeight: '600' }}>Chào mừng, {currentUser.email}</span>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#2196F3', textDecoration: 'none', fontSize: '1.0em', fontWeight: 'bold', marginRight: '15px', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#1a7bd8'}
                onMouseLeave={e => e.currentTarget.style.color = '#2196F3'}>Đăng nhập</Link>
              <Link to="/register" style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '1.0em',
                fontWeight: 'bold',
                transition: 'background-color 0.2s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#45a049'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4CAF50'}>Đăng ký</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}

// Component ProtectedRoute để bảo vệ các route
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Đang tải...</div>; // Hoặc một spinner loading
  }

  return currentUser ? children : null; // Chỉ render children nếu người dùng đã đăng nhập
}


function App() {
  return (
    <Router>
      <AuthProvider> {/* Bọc toàn bộ ứng dụng bằng AuthProvider */}
        <AppHeader /> {/* Sử dụng AppHeader */}
        {/* Router Outlet */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Route mới */}
          <Route path="/register" element={<RegisterPage />} /> {/* Route mới */}

          {/* Các route được bảo vệ: Chỉ có thể truy cập nếu đã đăng nhập */}
          <Route
            path="/test-nhanh"
            element={
              <ProtectedRoute>
                <TestNhanhPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/on-tap"
            element={
              <ProtectedRoute>
                <ExerciseSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/on-tap/ngu-phap"
            element={
              <ProtectedRoute>
                <GrammarTopicSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/on-tap/ngu-phap/:topic"
            element={
              <ProtectedRoute>
                <ExercisePage type="grammar" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/on-tap/doc-hieu/:topic"
            element={
              <ProtectedRoute>
                <ExercisePage type="reading" />
              </ProtectedRoute>
            }
          />

          {/* NEW: Các routes cho phần Từ vựng */}
          <Route
            path="/on-tap/tu-vung-chon-chu-de"
            element={
              <ProtectedRoute>
                <VocabularyTopicSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/on-tap/tu-vung/:topic"
            element={
              <ProtectedRoute>
                <ExercisePage type="vocabulary" />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;