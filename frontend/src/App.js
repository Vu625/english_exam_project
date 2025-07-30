import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestNhanhPage from './TestNhanhPage';
import HomePage from './HomePage';
import ExerciseSelectionPage from './ExerciseSelectionPage';
import GrammarTopicSelectionPage from './GrammarTopicSelectionPage';
import ExercisePage from './ExercisePage'; // <--- Thêm dòng này

function App() {
  return (
    <Router>
      {/* Header/Navigation */}
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Trang Chủ</Link>
        <Link to="/test-nhanh" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Test Nhanh</Link>
        <Link to="/on-tap" style={{ margin: '0 10px', textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>Ôn tập</Link>
      </nav>

      {/* Router Outlet */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test-nhanh" element={<TestNhanhPage />} />
        <Route path="/on-tap" element={<ExerciseSelectionPage />} />
        <Route path="/on-tap/ngu-phap" element={<GrammarTopicSelectionPage />} />
        {/* Các Route cho từng loại bài tập ngữ pháp */}
        <Route path="/on-tap/ngu-phap/:topic" element={<ExercisePage />} /> {/* <--- Thêm dòng này */}
      </Routes>
    </Router>
  );
}

export default App;