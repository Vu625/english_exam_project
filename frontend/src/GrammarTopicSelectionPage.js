// frontend/src/GrammarTopicSelectionPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function GrammarTopicSelectionPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chọn chủ đề ngữ pháp:</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}> {/* Thêm flexWrap để các nút xuống dòng nếu nhiều */}
        <Link to="/on-tap/ngu-phap/hien-tai" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Các thì Hiện Tại
        </Link>
        <Link to="/on-tap/ngu-phap/qua-khu" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Các thì Quá Khứ
        </Link>
        <Link to="/on-tap/ngu-phap/tuong-lai" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Các thì Tương Lai
        </Link>
        <Link to="/on-tap/ngu-phap/bi-dong" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Câu bị động
        </Link>
        <Link to="/on-tap/ngu-phap/gia-dinh" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Câu giả định
        </Link>
        <Link to="/on-tap/ngu-phap/gian-tiep" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Câu gián tiếp
        </Link>
        <Link to="/on-tap/ngu-phap/dieu-kien" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Câu điều kiện
        </Link>
        <Link to="/on-tap/ngu-phap/dong-tu-khuyet-thieu" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Động từ khuyết thiếu
        </Link>
        <Link to="/on-tap/ngu-phap/menh-de-quan-he" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Mệnh Đề Quan hệ
        </Link>
        <Link to="/on-tap/ngu-phap/so-sanh" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          So Sánh
        </Link>
        <Link to="/on-tap/ngu-phap/tu-loai" style={{ padding: '15px 30px', border: '1px solid #ccc', borderRadius: '5px', textDecoration: 'none', color: 'black', fontWeight: 'bold', minWidth: '150px', textAlign: 'center' }}>
          Từ Loại
        </Link>
        
      </div>
    </div>
  );
}

export default GrammarTopicSelectionPage;