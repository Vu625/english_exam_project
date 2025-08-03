import React from 'react';
import { Link } from 'react-router-dom';

function ExerciseSelectionPage() {
    // Màu sắc và font chữ được tham chiếu từ Homepage để đảm bảo nhất quán
    const colors = {
        primary: '#4CAF50',
        secondary: '#FFC107',
        textPrimary: '#333333',
        backgroundLight: '#F5F9FD',
        white: '#ffffff',
        accent: '#2196F3',
    };

    const fonts = {
        heading: '"Montserrat", sans-serif',
        body: '"Open Sans", sans-serif',
    };

    const linkStyle = {
        padding: '15px 30px',
        borderRadius: '50px', // Bo tròn hơn
        textDecoration: 'none',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.white, // Mặc định màu chữ trắng
        backgroundColor: colors.primary, // Màu nền cho nút
        border: 'none', // Bỏ border
    };

    const linkHoverStyle = {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 25px rgba(0,0,0,0.3)',
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
                Chọn loại bài tập ôn tập:
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <Link
                    to="/on-tap/tu-vung-chon-chu-de" // Đổi path để dẫn đến trang chọn chủ đề từ vựng
                    style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHoverStyle, { backgroundColor: colors.secondary, color: colors.textPrimary })} // Đổi màu khi hover
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle, { backgroundColor: colors.primary, color: colors.white })} // Trở về màu cũ
                >
                    Từ vựng
                </Link>
                <Link
                    to="/on-tap/ngu-phap"
                    style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHoverStyle, { backgroundColor: colors.secondary, color: colors.textPrimary })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle, { backgroundColor: colors.primary, color: colors.white })}
                >
                    Ngữ Pháp
                </Link>
                <Link
                    to="/on-tap/doc-hieu/doan-van"
                    style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHoverStyle, { backgroundColor: colors.secondary, color: colors.textPrimary })}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle, { backgroundColor: colors.primary, color: colors.white })}
                >
                    Đọc hiểu
                </Link>
            </div>
        </div>
    );
}

export default ExerciseSelectionPage;