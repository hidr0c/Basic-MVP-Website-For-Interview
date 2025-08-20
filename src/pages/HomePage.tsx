import React from 'react';
import './HomePage.css';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <h1>Học tiếng Anh 1-1 với giáo viên bản xứ</h1>
                <p>Nền tảng kết nối người học với giáo viên chất lượng cao, học mọi lúc mọi nơi</p>
                <div className="hero-buttons">
                    <button className="cta-button primary">Đặt lịch học thử</button>
                    <button className="cta-button secondary">Tìm giáo viên</button>
                </div>
            </section>

            <section className="features">
                <h2>Tại sao chọn EnglishOne?</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <div className="feature-icon">👩‍🏫</div>
                        <h3>Giáo viên chất lượng</h3>
                        <p>100% giáo viên được chứng nhận TESOL/CELTA và có kinh nghiệm giảng dạy tối thiểu 3 năm</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Học 1 kèm 1</h3>
                        <p>Lớp học riêng tư, tương tác trực tiếp, giáo viên tập trung hoàn toàn cho bạn</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⏱️</div>
                        <h3>Linh hoạt thời gian</h3>
                        <p>Đặt lịch học bất kỳ lúc nào, hủy hoặc đổi lịch trước 12 giờ</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2>Cách thức hoạt động</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Tìm giáo viên</h3>
                        <p>Duyệt qua hàng trăm giáo viên và lọc theo kỹ năng, thời gian rảnh, và chuyên môn</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>Đặt buổi học thử</h3>
                        <p>Trải nghiệm buổi học đầu tiên miễn phí để đánh giá phương pháp giảng dạy</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Đăng ký khóa học</h3>
                        <p>Chọn gói học phù hợp với nhu cầu và mục tiêu của bạn</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
