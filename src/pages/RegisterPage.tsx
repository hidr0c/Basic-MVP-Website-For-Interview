import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            // API call to register
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role: 'student' }),
                credentials: 'include',
            });

            if (!response.ok) {
                let errorMessage = 'Đăng ký thất bại';
                try {
                    const data = await response.json();
                    errorMessage = data.message || errorMessage;
                } catch (e) {
                    // If we can't parse JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                console.error('Registration failed with status:', response.status, errorMessage);
                throw new Error(errorMessage);
            }

            // Registration successful, redirect to login
            navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
        } catch (error) {
            console.error('Registration error:', error);

            // Check if the error is due to email already in use
            if (error instanceof Error && error.message.includes('Email already exists')) {
                setError('Email đã được sử dụng. Vui lòng sử dụng email khác.');
            } else if (error instanceof Error) {
                setError(`Đăng ký thất bại: ${error.message}`);
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại sau.');
            }
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
