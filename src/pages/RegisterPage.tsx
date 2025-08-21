import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            // In a real app, this would be an API call to register
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            // Registration successful, redirect to login
            navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
        } catch (error) {
            console.error('Registration error:', error);
            setError('Đăng ký thất bại. Email có thể đã được sử dụng.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Đăng ký</h1>
                <p className="auth-subtitle">Tạo tài khoản để trải nghiệm các khóa học tiếng Anh chất lượng cao</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập họ và tên của bạn"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Bạn là</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="student">Học viên</option>
                            <option value="teacher">Giáo viên</option>
                        </select>
                    </div>

                    <div className="form-terms">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và{' '}
                            <Link to="/privacy">Chính sách bảo mật</Link>
                        </label>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <div className="auth-social">
                    <p>Hoặc đăng ký với</p>
                    <div className="social-buttons">
                        <button className="social-button google">
                            <i className="fab fa-google"></i> Google
                        </button>
                        <button className="social-button facebook">
                            <i className="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
