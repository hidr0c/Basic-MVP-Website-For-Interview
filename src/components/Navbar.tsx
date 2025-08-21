import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is logged in on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user from localStorage', error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = () => {
        // Clear auth data from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsUserMenuOpen(false);
        navigate('/');
    };

    // Define navigation links
    const navLinks = [
        { text: 'Trang chủ', path: '/' },
        { text: 'Giáo viên', path: '/teachers' },
        { text: 'Khóa học', path: '/services' },
        { text: 'Liên hệ', path: '/contact' },
    ];

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    EnglishOne
                </Link>

                <button
                    className="navbar-toggle"
                    aria-label="Toggle navigation"
                    onClick={toggleMenu}
                >
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                </button>

                <nav className={`navbar-menu ${isOpen ? 'open' : ''}`}>
                    <ul className="navbar-nav">
                        {navLinks.map((link, index) => (
                            <li key={index} className="nav-item">
                                <Link
                                    to={link.path}
                                    className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-auth">
                        {user ? (
                            <div className="user-menu-container">
                                <button
                                    className="user-menu-button"
                                    onClick={toggleUserMenu}
                                    aria-label="User menu"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <div className="user-avatar">
                                        <span>{user.name.charAt(0)}</span>
                                    </div>
                                    <span className="user-name">{user.name}</span>
                                    <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'rotate' : ''}`}></i>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="user-dropdown">
                                        <div className="user-info">
                                            <div className="user-avatar large">
                                                <span>{user.name.charAt(0)}</span>
                                            </div>
                                            <div className="user-details">
                                                <p className="user-fullname">{user.name}</p>
                                                <p className="user-email">{user.email}</p>
                                            </div>
                                        </div>

                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                                                    <i className="fas fa-user"></i> Hồ sơ cá nhân
                                                </Link>
                                            </li>
                                            {user.role === 'student' && (
                                                <li>
                                                    <Link to="/my-lessons" onClick={() => setIsUserMenuOpen(false)}>
                                                        <i className="fas fa-book"></i> Bài học của tôi
                                                    </Link>
                                                </li>
                                            )}
                                            {user.role === 'teacher' && (
                                                <li>
                                                    <Link to="/teaching-schedule" onClick={() => setIsUserMenuOpen(false)}>
                                                        <i className="fas fa-calendar"></i> Lịch dạy học
                                                    </Link>
                                                </li>
                                            )}
                                            <li className="dropdown-divider"></li>
                                            <li>
                                                <button onClick={handleLogout} className="dropdown-button">
                                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="nav-login" onClick={() => setIsOpen(false)}>
                                    Đăng nhập
                                </Link>
                                <Link to="/register" className="nav-register" onClick={() => setIsOpen(false)}>
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
