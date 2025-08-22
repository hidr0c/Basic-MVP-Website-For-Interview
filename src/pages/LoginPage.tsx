import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Mock user data for when API is unavailable
    const mockUserData = {
        user: {
            id: '1',
            name: 'Nguyen Van A',
            email: 'admin@englishhub.com',
            role: 'admin'
        },
        token: 'mock-jwt-token-for-development'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Try to authenticate with the API
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    // Add timeout to prevent long waiting time when API is down
                    signal: AbortSignal.timeout(5000)
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Đăng nhập thất bại');
                }

                const data = await response.json();

                // Use Auth context to login with API data
                login(data.user, data.token);

                // Redirect to home page
                navigate('/');
                return;
            } catch (apiError) {
                console.error('API connection error:', apiError);
                console.log('Using mock data for login...');

                // For development: Check if the credentials match our mock data
                if (email === 'admin@englishhub.com' && password === 'admin') {
                    // Use mock data when API is down
                    login(mockUserData.user, mockUserData.token);
                    navigate('/');
                    return;
                } else if (email === 'user@englishhub.com' && password === 'user') {
                    // Regular user mock data
                    const regularUser = {
                        ...mockUserData,
                        user: {
                            ...mockUserData.user,
                            id: '2',
                            name: 'Nguyen Van B',
                            email: 'user@englishhub.com',
                            role: 'user'
                        }
                    };
                    login(regularUser.user, regularUser.token);
                    navigate('/');
                    return;
                }
                // If credentials don't match mock data, show error
                throw new Error('Email hoặc mật khẩu không chính xác');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Email hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Đăng nhập</h1>
                <p className="auth-subtitle">Đăng nhập để tiếp tục học tập cùng chúng tôi</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
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

                    <div className="form-actions">
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                        </div>
                        <Link to="/forgot-password" className="forgot-password">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
