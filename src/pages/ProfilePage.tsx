import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        setName(user.name);
        setEmail(user.email);
    }, [user, isAuthenticated, navigate]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isEditMode && newPassword && newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const payload: any = { name };

            // Only include password fields if we're changing the password
            if (newPassword) {
                payload.currentPassword = currentPassword;
                payload.newPassword = newPassword;
            }

            const response = await fetch(`/api/users/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Cập nhật thông tin thất bại');
            }

            const data = await response.json();

            // Update local storage with new user data
            const updatedUser = { ...user, name: data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Cập nhật thông tin thành công');
            setIsEditMode(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Cập nhật thông tin thất bại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Hồ sơ cá nhân</h1>
                <p>Quản lý thông tin cá nhân của bạn</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="profile-card">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <span>{user?.name?.charAt(0) || '?'}</span>
                    </div>
                    <div className="profile-details">
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                        <span className="profile-role">
                            {user?.role === 'student' ? 'Học viên' :
                                user?.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
                        </span>
                    </div>
                </div>

                <div className="profile-actions">
                    {!isEditMode ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsEditMode(true)}
                        >
                            Chỉnh sửa thông tin
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsEditMode(false);
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                                setName(user?.name || '');
                            }}
                        >
                            Hủy
                        </button>
                    )}
                </div>

                <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                        <label htmlFor="name">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditMode}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled={true}
                            required
                        />
                        <small>Email không thể thay đổi</small>
                    </div>

                    {isEditMode && (
                        <>
                            <h3>Đổi mật khẩu (tùy chọn)</h3>
                            <div className="form-group">
                                <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                        </>
                    )}

                    {isEditMode && (
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
