import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminPage.css';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface Course {
    id: string;
    title: string;
    teacherName: string;
    enrolledStudents: number;
    status: string;
}

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'courses' | 'payments'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if user is admin
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        // Check for tab query parameter
        const queryParams = new URLSearchParams(location.search);
        const tabParam = queryParams.get('tab');
        if (tabParam && ['dashboard', 'users', 'courses', 'payments'].includes(tabParam)) {
            setActiveTab(tabParam as 'dashboard' | 'users' | 'courses' | 'payments');
        }

        // Fetch data based on active tab
        fetchData();
    }, [isAuthenticated, user, navigate, location.search]);

    useEffect(() => {
        // Update data when active tab changes
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users' || activeTab === 'dashboard') {
                // Fetch users data - in a real app, this would be an API call
                // Mocking data for demo purposes
                const mockUsers: User[] = [
                    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', role: 'student', createdAt: '2023-06-15' },
                    { id: '2', name: 'Trần Thị B', email: 'tranthib@gmail.com', role: 'student', createdAt: '2023-07-22' },
                    { id: '3', name: 'Lê Văn C', email: 'levanc@gmail.com', role: 'teacher', createdAt: '2023-05-10' },
                    { id: '4', name: 'Phạm Thị D', email: 'phamthid@gmail.com', role: 'student', createdAt: '2023-08-05' },
                    { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', role: 'teacher', createdAt: '2023-04-18' },
                ];
                setUsers(mockUsers);
            }

            if (activeTab === 'courses' || activeTab === 'dashboard') {
                // Fetch courses data - in a real app, this would be an API call
                // Mocking data for demo purposes
                const mockCourses: Course[] = [
                    { id: '1', title: 'IELTS Preparation', teacherName: 'Lê Văn C', enrolledStudents: 45, status: 'active' },
                    { id: '2', title: 'Business English', teacherName: 'Hoàng Văn E', enrolledStudents: 32, status: 'active' },
                    { id: '3', title: 'English for Kids', teacherName: 'Lê Văn C', enrolledStudents: 28, status: 'pending' },
                    { id: '4', title: 'TOEIC Mastery', teacherName: 'Hoàng Văn E', enrolledStudents: 56, status: 'active' },
                    { id: '5', title: 'Conversational English', teacherName: 'Lê Văn C', enrolledStudents: 39, status: 'completed' },
                ];
                setCourses(mockCourses);
            }
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const renderDashboard = () => (
        <div className="admin-dashboard">
            <h2>Tổng quan quản trị</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Học viên</h3>
                        <p className="stat-number">{courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}</p>
                        <p className="stat-trend positive">+12 học viên mới</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon courses">
                        <i className="fas fa-book"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Khóa học</h3>
                        <p className="stat-number">{courses.length}</p>
                        <p className="stat-trend positive">+1 khóa học mới</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon teachers">
                        <i className="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Giáo viên</h3>
                        <p className="stat-number">{users.filter(u => u.role === 'teacher').length}</p>
                        <p className="stat-trend neutral">Không thay đổi</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="stat-content">
                        <h3>Doanh thu</h3>
                        <p className="stat-number">
                            {(courses.reduce((sum, course) => sum + course.enrolledStudents, 0) * 2.5).toFixed(1)}M VNĐ
                        </p>
                        <p className="stat-trend positive">+23.8M VNĐ so với tháng trước</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-row">
                <div className="dashboard-column">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Người dùng mới gần đây</h3>
                            <button className="view-all-btn" onClick={() => setActiveTab('users')}>Xem tất cả</button>
                        </div>
                        <div className="card-content">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Ngày tạo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice(0, 5).map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role === 'student' ? 'Học viên' :
                                                        user.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
                                                </span>
                                            </td>
                                            <td>{user.createdAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="dashboard-column">
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3>Khóa học phổ biến</h3>
                            <button className="view-all-btn" onClick={() => setActiveTab('courses')}>Xem tất cả</button>
                        </div>
                        <div className="card-content">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Tên khóa học</th>
                                        <th>Giáo viên</th>
                                        <th>Số học viên</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.slice(0, 5).map(course => (
                                        <tr key={course.id}>
                                            <td>{course.title}</td>
                                            <td>{course.teacherName}</td>
                                            <td>{course.enrolledStudents}</td>
                                            <td>
                                                <span className={`status-badge ${course.status}`}>
                                                    {course.status === 'active' ? 'Đang diễn ra' :
                                                        course.status === 'pending' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="admin-users">
            <div className="section-header">
                <h2>Quản lý người dùng</h2>
                <div className="header-actions">
                    <button className="add-new-btn">
                        <i className="fas fa-plus"></i> Thêm người dùng mới
                    </button>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm người dùng..." />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button className="filter-btn active">Tất cả</button>
                <button className="filter-btn">Học viên</button>
                <button className="filter-btn">Giáo viên</button>
                <button className="filter-btn">Quản trị viên</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <input type="checkbox" />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role === 'student' ? 'Học viên' :
                                            user.role === 'teacher' ? 'Giáo viên' : 'Quản trị viên'}
                                    </span>
                                </td>
                                <td>{user.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn edit">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn delete">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="page-btn prev">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-ellipsis">...</span>
                <button className="page-btn">10</button>
                <button className="page-btn next">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="admin-courses">
            <div className="section-header">
                <h2>Quản lý khóa học</h2>
                <div className="header-actions">
                    <button className="add-new-btn">
                        <i className="fas fa-plus"></i> Thêm khóa học mới
                    </button>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm khóa học..." />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button className="filter-btn active">Tất cả</button>
                <button className="filter-btn">Đang diễn ra</button>
                <button className="filter-btn">Sắp diễn ra</button>
                <button className="filter-btn">Đã kết thúc</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>ID</th>
                            <th>Tên khóa học</th>
                            <th>Giáo viên</th>
                            <th>Số học viên</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>
                                    <input type="checkbox" />
                                </td>
                                <td>{course.id}</td>
                                <td>{course.title}</td>
                                <td>{course.teacherName}</td>
                                <td>{course.enrolledStudents}</td>
                                <td>
                                    <span className={`status-badge ${course.status}`}>
                                        {course.status === 'active' ? 'Đang diễn ra' :
                                            course.status === 'pending' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn view">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="action-btn edit">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="action-btn delete">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="page-btn prev">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-ellipsis">...</span>
                <button className="page-btn">10</button>
                <button className="page-btn next">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );

    const renderPayments = () => (
        <div className="admin-payments">
            <div className="section-header">
                <h2>Quản lý thanh toán</h2>
                <div className="header-actions">
                    <button className="add-new-btn">
                        <i className="fas fa-plus"></i> Thêm thanh toán mới
                    </button>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm thanh toán..." />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button className="filter-btn active">Tất cả</button>
                <button className="filter-btn">Thành công</button>
                <button className="filter-btn">Đang xử lý</button>
                <button className="filter-btn">Thất bại</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ngày</th>
                            <th>Học viên</th>
                            <th>Khóa học</th>
                            <th>Phương thức</th>
                            <th>Số tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>P12345</td>
                            <td>22/08/2023</td>
                            <td>Nguyễn Văn A</td>
                            <td>IELTS Preparation</td>
                            <td>Thẻ tín dụng</td>
                            <td>4,500,000 ₫</td>
                            <td><span className="payment-status success">Thành công</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn download">
                                        <i className="fas fa-download"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>P12346</td>
                            <td>21/08/2023</td>
                            <td>Trần Thị B</td>
                            <td>Business English</td>
                            <td>Chuyển khoản</td>
                            <td>3,800,000 ₫</td>
                            <td><span className="payment-status processing">Đang xử lý</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn check">
                                        <i className="fas fa-check"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>P12347</td>
                            <td>20/08/2023</td>
                            <td>Lê Văn D</td>
                            <td>English for Kids</td>
                            <td>MoMo</td>
                            <td>2,500,000 ₫</td>
                            <td><span className="payment-status success">Thành công</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn download">
                                        <i className="fas fa-download"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>P12348</td>
                            <td>19/08/2023</td>
                            <td>Phạm Thị C</td>
                            <td>TOEIC Mastery</td>
                            <td>Thẻ tín dụng</td>
                            <td>5,200,000 ₫</td>
                            <td><span className="payment-status failed">Thất bại</span></td>
                            <td>
                                <div className="action-buttons">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn retry">
                                        <i className="fas fa-redo"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="page-btn prev">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn next">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    );

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>EnglishHub Admin</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <i className="fas fa-tachometer-alt"></i>
                        <span>Tổng quan</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <i className="fas fa-users"></i>
                        <span>Người dùng</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <i className="fas fa-book"></i>
                        <span>Khóa học</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payments')}
                    >
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Thanh toán</span>
                    </button>
                </nav>
            </div>

            <div className="admin-content">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : error ? (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{error}</p>
                        <button onClick={fetchData}>Thử lại</button>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'courses' && renderCourses()}
                        {activeTab === 'payments' && renderPayments()}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
