import React from 'react';
import { Link } from 'react-router-dom';

function VocabularyTopicSelectionPage() {
    const topics = [
        { name: 'Gia đình', path: 'gia-dinh' },
        { name: 'Động vật', path: 'dong-vat' },
        { name: 'Thức ăn', path: 'thuc-an' },
        { name: 'Du lịch', path: 'du-lich' },
        // Thêm các chủ đề từ vựng khác tại đây
    ];

    // Màu sắc và font chữ được tham chiếu từ Homepage để đảm bảo nhất quán
    const colors = {
        primary: '#4CAF50',
        secondary: '#FFC107',
        textPrimary: '#333333',
        backgroundLight: '#F5F9FD',
        white: '#ffffff',
    };

    const fonts = {
        heading: '"Montserrat", sans-serif',
        body: '"Open Sans", sans-serif',
    };

    const buttonStyle = {
        padding: '16px 35px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: colors.white,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary, // Sử dụng màu primary cho nút chủ đề
        margin: '10px', // Khoảng cách giữa các nút
    };

    return (
        <div style={{
            fontFamily: fonts.body,
            backgroundColor: colors.backgroundLight,
            minHeight: '100vh',
            color: colors.textPrimary,
            textAlign: 'center',
            padding: '50px 20px'
        }}>
            <h2 style={{
                fontFamily: fonts.heading,
                fontSize: '2.5em',
                color: colors.textPrimary,
                marginBottom: '40px',
            }}>
                Chọn chủ đề từ vựng để ôn tập:
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {topics.map((topic) => (
                    <Link
                        key={topic.path}
                        to={`/on-tap/tu-vung/${topic.path}`}
                        style={buttonStyle}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = `0 12px 25px rgba(0,0,0,0.3), 0 0 0 5px ${colors.primary}80`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 8px 15px rgba(0,0,0,0.1), 0 0 0 0px ${colors.primary}80`;
                        }}
                    >
                        {topic.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VocabularyTopicSelectionPage;