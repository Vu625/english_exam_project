import React from 'react';
import { Link } from 'react-router-dom';

function GrammarTopicSelectionPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chọn chủ đề ngữ pháp:</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Link to="/on-tap/ngu-phap/hien-tai" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
          Các thì Hiện Tại
        </Link>
        <Link to="/on-tap/ngu-phap/qua-khu" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
          Các thì Quá Khứ
        </Link>
        {/* Thêm các chủ đề khác ở đây sau này */}
      </div>
    </div>
  );
}

export default GrammarTopicSelectionPage;