import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Form submitted! (This is a demo - no data is actually sent)');
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1>Liên hệ với chúng tôi</h1>
                <p>Gửi tin nhắn và chúng tôi sẽ phản hồi sớm nhất có thể</p>
            </div>

            <div className="contact-container">
                <div className="contact-form-container">
                    <h2>Gửi tin nhắn</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Họ tên</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Tiêu đề</label>
                            <input type="text" id="subject" name="subject" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Nội dung</label>
                            <textarea id="message" name="message" rows={5} required></textarea>
                        </div>

                        <button type="submit" className="submit-button">Gửi tin nhắn</button>
                    </form>
                </div>

                <div className="contact-info">
                    <h2>Thông tin liên hệ</h2>
                    <div className="info-item">
                        <h3>Địa chỉ</h3>
                        <p>123 Đường Nguyễn Văn Linh, Quận 7, TP. HCM</p>
                    </div>

                    <div className="info-item">
                        <h3>Email</h3>
                        <p>
                            <a href="mailto:info@example.com">info@example.com</a>
                        </p>
                    </div>

                    <div className="info-item">
                        <h3>Điện thoại</h3>
                        <p>
                            <a href="tel:+84123456789">+84 123 456 789</a>
                        </p>
                    </div>

                    <div className="info-item">
                        <h3>Giờ làm việc</h3>
                        <p>T2-T6: 8:00 - 17:00</p>
                        <p>T7: 9:00 - 12:00</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
