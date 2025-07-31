// src/App.js
// import React from 'react';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import TestNhanhPage from './TestNhanhPage';
import HomePage from './HomePage';
import ExerciseSelectionPage from './ExerciseSelectionPage';
import GrammarTopicSelectionPage from './GrammarTopicSelectionPage';
import ExercisePage from './ExercisePage';
import LoginPage from './LoginPage'; // <--- Import LoginPage
import RegisterPage from './RegisterPage'; // <--- Import RegisterPage
import { AuthProvider, useAuth } from './AuthContext'; // <--- Import AuthProvider và useAuth
import { auth } from './firebase'; // <--- Import auth để đăng xuất
import { signOut } from 'firebase/auth'; // <--- Import signOut

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
    <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Trang Chủ</Link>
      <Link to="/test-nhanh" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Test Nhanh</Link>
      <Link to="/on-tap" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Ôn tập</Link>

      <div style={{ marginLeft: 'auto', marginRight: '20px' }}>
        {!loading && (
          currentUser ? (
            <>
              <span style={{ marginRight: '15px' }}>Chào mừng, {currentUser.email}</span>
              <button
                onClick={handleLogout}
                style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Đăng nhập</Link>
              <Link to="/register" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Đăng ký</Link>
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;