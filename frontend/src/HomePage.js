import React from 'react';
import { useNavigate } from 'react-router-dom';

function Homepage() {
    const navigate = useNavigate();

    // Màu sắc và font chữ đề xuất - Cập nhật để có gradient và tông màu tươi sáng hơn
    const colors = {
        primary: '#4CAF50', // Xanh lá cây
        primaryLight: '#8BC34A', // Xanh lá nhạt hơn
        secondary: '#FFC107', // Vàng cam
        accent: '#2196F3',   // Xanh dương
        backgroundLight: '#F5F9FD', // Nền cực nhạt, gần trắng
        backgroundDark: '#2C3E50', // Xám đậm cho footer
        textPrimary: '#333333',
        textSecondary: '#666666',
        white: '#ffffff',
        gradientStart: '#6DD5ED', // Bầu trời xanh nhạt
        gradientEnd: '#2193B0',   // Xanh nước biển đậm hơn
        gradientGreenStart: '#4CAF50',
        gradientGreenEnd: '#8BC34A',
    };

    const fonts = {
        heading: '"Montserrat", sans-serif', // Font hiện đại, mạnh mẽ
        body: '"Open Sans", sans-serif',     // Font dễ đọc
    };

    // Đảm bảo import font trong public/index.html hoặc App.css
    // Ví dụ: <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

    const sectionStyle = {
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden', // Đảm bảo không tràn ra ngoài
    };

    const headingStyle = {
        fontFamily: fonts.heading,
        fontSize: '3.5em',
        color: colors.textPrimary,
        marginBottom: '20px',
        fontWeight: '700', // Bold
    };

    const subHeadingStyle = {
        fontFamily: fonts.body,
        fontSize: '1.4em',
        color: colors.textSecondary,
        marginBottom: '50px',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto 50px auto',
    };

    const buttonStyle = {
        padding: '16px 35px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        borderRadius: '50px', // Nút bo tròn hơn
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 15px rgba(0,0,0,0.1)',
        textDecoration: 'none',
        color: colors.white,
        display: 'inline-flex', // Để căn giữa icon nếu có
        alignItems: 'center',
        justifyContent: 'center',
    };

    const cardStyle = {
        backgroundColor: colors.white,
        borderRadius: '15px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        flex: 1,
        minWidth: '280px',
        maxWidth: '380px',
        margin: '20px',
        textAlign: 'center', // Căn giữa nội dung trong card
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    // Style cho icon trong card
    const cardIconStyle = {
        fontSize: '3em',
        marginBottom: '20px',
    };

    return (
        <div style={{ fontFamily: fonts.body, backgroundColor: colors.backgroundLight, minHeight: '100vh', color: colors.textPrimary }}>
            {/* Header / Navigation */}
            <header style={{
                backgroundColor: colors.white,
                color: colors.textPrimary,
                padding: '15px 40px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky', // Navbar dính
                top: 0,
                zIndex: 1000,
            }}>
                <h1 style={{ margin: 0, fontSize: '2em', fontFamily: fonts.heading, color: colors.primary }}>Doughnut English</h1>
                <nav>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex' }}>
                        <li style={{ marginLeft: '35px' }}>
                            <a href="#" style={{ color: colors.textPrimary, textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
                               onMouseEnter={e => e.currentTarget.style.color = colors.primary}
                               onMouseLeave={e => e.currentTarget.style.color = colors.textPrimary}>Trang Chủ</a>
                        </li>
                        <li style={{ marginLeft: '35px' }}>
                            <a href="/on-tap" style={{ color: colors.textPrimary, textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
                               onMouseEnter={e => e.currentTarget.style.color = colors.primary}
                               onMouseLeave={e => e.currentTarget.style.color = colors.textPrimary}>Ôn tập</a>
                        </li>
                        <li style={{ marginLeft: '35px' }}>
                            <a href="/test-nhanh" style={{ color: colors.textPrimary, textDecoration: 'none', fontSize: '1.1em', fontWeight: '600', transition: 'color 0.2s ease' }}
                               onMouseEnter={e => e.currentTarget.style.color = colors.primary}
                               onMouseLeave={e => e.currentTarget.style.color = colors.textPrimary}>Kiểm tra</a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Hero Section */}
            <section style={{
                ...sectionStyle,
                backgroundColor: colors.white,
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`, // Gradient background
                color: colors.white,
                padding: '100px 20px',
            }}>
                <h2 style={{ ...headingStyle, fontSize: '4em', color: colors.white }}>
                    Nâng tầm tiếng Anh của bạn với Doughnut!
                </h2>
                <p style={{ ...subHeadingStyle, color: colors.white, opacity: 0.9 }}>
                    Nền tảng học và luyện thi tiếng Anh trực tuyến hiệu quả. Học ngữ pháp chuyên sâu, làm bài tập tương tác và nhận lời khuyên thông minh từ AI.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
                    <button
                        onClick={() => navigate('/on-tap')}
                        style={{
                            ...buttonStyle,
                            backgroundColor: colors.secondary,
                            color: colors.textPrimary,
                            boxShadow: `0 8px 20px rgba(0,0,0,0.2), 0 0 0 0px ${colors.secondary}80`, // Thêm shadow
                            // Khi hover, bóng đổ sẽ lớn hơn
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = `0 12px 25px rgba(0,0,0,0.3), 0 0 0 5px ${colors.secondary}80`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 8px 15px rgba(0,0,0,0.1), 0 0 0 0px ${colors.secondary}80`;
                        }}
                    >
                        Bắt đầu Ôn tập Ngữ pháp
                    </button>
                    <button
                        onClick={() => navigate('/test-nhanh')}
                        style={{
                            ...buttonStyle,
                            backgroundColor: colors.white, // Nút kiểm tra màu trắng
                            color: colors.accent,
                            boxShadow: `0 8px 20px rgba(0,0,0,0.2), 0 0 0 0px ${colors.white}80`,
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = `0 12px 25px rgba(0,0,0,0.3), 0 0 0 5px ${colors.white}80`;
                            e.currentTarget.style.color = colors.primary; // Đổi màu chữ khi hover
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 8px 15px rgba(0,0,0,0.1), 0 0 0 0px ${colors.white}80`;
                            e.currentTarget.style.color = colors.accent;
                        }}
                    >
                        Làm bài Kiểm tra
                    </button>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ ...sectionStyle, backgroundColor: colors.backgroundLight }}>
                <h3 style={{ ...headingStyle, fontSize: '3em' }}>Tại sao chọn Doughnut?</h3>
                <p style={{ ...subHeadingStyle, marginBottom: '60px' }}>
                    Chúng tôi mang đến trải nghiệm học tập độc đáo với những tính năng vượt trội.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                    <div style={{ ...cardStyle }}
                         onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';}}
                         onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';}}>
                        <span style={{ ...cardIconStyle, color: colors.primary }}>📚</span>
                        <h4 style={{ color: colors.textPrimary, fontSize: '1.8em', marginBottom: '15px' }}>Ngữ pháp chuyên sâu</h4>
                        <p style={{ color: colors.textSecondary, lineHeight: '1.7', fontSize: '1.1em' }}>
                            Học và ôn luyện các chủ đề ngữ pháp từ cơ bản đến nâng cao với bài tập được biên soạn kỹ lưỡng bởi chuyên gia.
                        </p>
                    </div>
                    <div style={{ ...cardStyle }}
                         onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';}}
                         onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';}}>
                        <span style={{ ...cardIconStyle, color: colors.accent }}>🤖</span>
                        <h4 style={{ color: colors.textPrimary, fontSize: '1.8em', marginBottom: '15px' }}>AI hỗ trợ thông minh</h4>
                        <p style={{ color: colors.textSecondary, lineHeight: '1.7', fontSize: '1.1em' }}>
                            Nhận gợi ý chi tiết, giải thích câu hỏi và dịch thuật ngữ cảnh ngay lập tức với công nghệ AI tiên tiến của chúng tôi.
                        </p>
                    </div>
                    <div style={{ ...cardStyle }}
                         onMouseEnter={e => {e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';}}
                         onMouseLeave={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';}}>
                        <span style={{ ...cardIconStyle, color: colors.secondary }}>📈</span>
                        <h4 style={{ color: colors.textPrimary, fontSize: '1.8em', marginBottom: '15px' }}>Theo dõi tiến độ trực quan</h4>
                        <p style={{ color: colors.textSecondary, lineHeight: '1.7', fontSize: '1.1em' }}>
                            Dễ dàng theo dõi sự tiến bộ của bạn, điểm mạnh và điểm yếu thông qua các biểu đồ và báo cáo chi tiết.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials or CTA Alternative (Optional - for more content) */}
            <section style={{ ...sectionStyle, backgroundColor: colors.white }}>
                <h3 style={{ ...headingStyle, fontSize: '3em' }}>Học viên nói gì về Doughnut?</h3>
                <p style={{ ...subHeadingStyle, marginBottom: '60px' }}>
                    Hàng ngàn người học đã cải thiện tiếng Anh cùng chúng tôi.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                    {/* Testimonial Card 1 */}
                    <div style={{ ...cardStyle, maxWidth: '450px', backgroundColor: colors.backgroundLight, boxShadow: 'none', border: `1px solid ${colors.primaryLight}40` }}
                         onMouseEnter={e => {e.currentTarget.style.transform = 'scale(1.02)';}}
                         onMouseLeave={e => {e.currentTarget.style.transform = 'scale(1)';}}>
                        <p style={{ fontStyle: 'italic', fontSize: '1.1em', marginBottom: '15px', color: colors.textPrimary }}>
                            "Doughnut đã giúp tôi hệ thống lại ngữ pháp một cách dễ hiểu và hiệu quả. Chức năng AI thực sự hữu ích!"
                        </p>
                        <p style={{ fontWeight: 'bold', color: colors.primary }}>- Phạm Minh Trường, sv năm 3 cho hay </p>
                    </div>
                    {/* Testimonial Card 2 */}
                    <div style={{ ...cardStyle, maxWidth: '450px', backgroundColor: colors.backgroundLight, boxShadow: 'none', border: `1px solid ${colors.accent}40` }}
                         onMouseEnter={e => {e.currentTarget.style.transform = 'scale(1.02)';}}
                         onMouseLeave={e => {e.currentTarget.style.transform = 'scale(1)';}}>
                        <p style={{ fontStyle: 'italic', fontSize: '1.1em', marginBottom: '15px', color: colors.textPrimary }}>
                            "Tôi rất thích cách AI giải thích bài tập. Nó giúp tôi hiểu sâu hơn thay vì chỉ biết đáp án đúng."
                        </p>
                        <p style={{ fontWeight: 'bold', color: colors.accent }}>- Trần Thị B, Người đi làm</p>
                    </div>
                </div>
            </section>


            <section style={{
                ...sectionStyle,
                backgroundColor: colors.primary,
                background: `linear-gradient(90deg, ${colors.gradientGreenStart} 0%, ${colors.gradientGreenEnd} 100%)`, // Gradient xanh lá
                color: colors.white,
                padding: '80px 20px',
            }}>
                <h3 style={{ ...headingStyle, fontSize: '3.2em', color: colors.white }}>Bắt đầu hành trình chinh phục tiếng Anh ngay hôm nay!</h3>
                <p style={{ ...subHeadingStyle, color: colors.white, opacity: 0.9 }}>
                    Đừng chần chừ, hàng ngàn bài tập, giải thích chi tiết và AI thông minh đang chờ đón bạn.
                </p>
                <button
                    onClick={() => navigate('/đăng-ký')}
                    style={{
                        ...buttonStyle,
                        backgroundColor: colors.white,
                        color: colors.primary,
                        boxShadow: `0 8px 20px rgba(0,0,0,0.2), 0 0 0 0px ${colors.white}80`,
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = `0 12px 25px rgba(0,0,0,0.3), 0 0 0 5px ${colors.white}80`;
                        e.currentTarget.style.backgroundColor = colors.secondary; // Đổi màu nền nút khi hover
                        e.currentTarget.style.color = colors.white; // Đổi màu chữ khi hover
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 8px 15px rgba(0,0,0,0.1), 0 0 0 0px ${colors.white}80`;
                        e.currentTarget.style.backgroundColor = colors.white;
                        e.currentTarget.style.color = colors.primary;
                    }}
                >
                    Đăng ký miễn phí ngay!
                </button>
            </section>

            {/* Footer */}
            <footer style={{
                backgroundColor: colors.backgroundDark,
                color: colors.white,
                padding: '40px 20px',
                textAlign: 'center',
                fontSize: '0.9em',
            }}>
                <p>&copy; 2025 Doughnut English. All rights reserved.</p>
                <div style={{ marginTop: '15px' }}>
                    <a href="#" style={{ color: colors.white, textDecoration: 'none', margin: '0 15px', opacity: 0.8, transition: 'opacity 0.2s ease' }}
                       onMouseEnter={e => e.currentTarget.style.opacity = 1}
                       onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>Chính sách bảo mật</a>
                    <span style={{ margin: '0 5px', color: colors.white, opacity: 0.5 }}>|</span>
                    <a href="#" style={{ color: colors.white, textDecoration: 'none', margin: '0 15px', opacity: 0.8, transition: 'opacity 0.2s ease' }}
                       onMouseEnter={e => e.currentTarget.style.opacity = 1}
                       onMouseLeave={e => e.currentTarget.style.opacity = 0.8}>Điều khoản sử dụng</a>
                </div>
            </footer>
        </div>
    );
}

export default Homepage;