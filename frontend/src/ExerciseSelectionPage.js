import React from 'react';
import { Link } from 'react-router-dom';

function ExerciseSelectionPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chọn loại bài tập ôn tập:</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Link to="/on-tap/tu-vung" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
          Từ vựng (sắp ra mắt)
        </Link>
        <Link to="/on-tap/ngu-phap" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
          Ngữ Pháp
        </Link>
      </div>
    </div>
  );
}

export default ExerciseSelectionPage;