import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EnrolledCoursesPage.css';

interface Course {
    id: string;
    name: string;
    description: string;
    teacherName: string;
    teacherId: string;
    status: 'active' | 'completed' | 'upcoming';
    progress: number;
    nextLesson?: {
        id: string;
        title: string;
        date: string;
    };
}

interface User {
    id: string;
    name: string;
}

const EnrolledCoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            fetchEnrolledCourses(userData.id);
        } catch (error) {
            console.error('Error parsing user from localStorage', error);
            navigate('/login');
        }
    }, [navigate]);

    const fetchEnrolledCourses = async (userId: string) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/users/${userId}/courses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải khóa học');
            }

            const data = await response.json();
            setCourses(data);
        } catch (error) {
            setError('Đã xảy ra lỗi khi tải khóa học');
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = filter === 'all'
        ? courses
        : courses.filter(course => course.status === filter);

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Đang học';
            case 'completed': return 'Đã hoàn thành';
            case 'upcoming': return 'Sắp diễn ra';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'active': return 'status-active';
            case 'completed': return 'status-completed';
            case 'upcoming': return 'status-upcoming';
            default: return '';
        }
    };

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h1>Khóa học đã đăng ký</h1>
                <p>Quản lý các khóa học của bạn</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="courses-filters">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                    onClick={() => setFilter('active')}
                >
                    Đang học
                </button>
                <button
                    className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setFilter('upcoming')}
                >
                    Sắp diễn ra
                </button>
                <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Đã hoàn thành
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : filteredCourses.length === 0 ? (
                <div className="empty-courses">
                    <p>Bạn chưa đăng ký khóa học nào{filter !== 'all' ? ' trong danh mục này' : ''}</p>
                    <Link to="/courses" className="btn btn-primary">Khám phá khóa học</Link>
                </div>
            ) : (
                <div className="courses-list">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="course-card">
                            <div className="course-info">
                                <h3>{course.name}</h3>
                                <p className="course-teacher">Giáo viên: <Link to={`/teachers/${course.teacherId}`}>{course.teacherName}</Link></p>
                                <p className="course-description">{course.description}</p>

                                <div className="course-progress">
                                    <span className="progress-text">{course.progress}% hoàn thành</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="course-status">
                                    <span className={`status-badge ${getStatusClass(course.status)}`}>
                                        {getStatusText(course.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="course-actions">
                                {course.status === 'active' && course.nextLesson && (
                                    <div className="next-lesson">
                                        <h4>Buổi học tiếp theo</h4>
                                        <p>{course.nextLesson.title}</p>
                                        <p className="next-lesson-date">{course.nextLesson.date}</p>
                                        <Link to={`/lessons/${course.nextLesson.id}`} className="btn btn-secondary">
                                            Vào học
                                        </Link>
                                    </div>
                                )}

                                <Link to={`/courses/${course.id}`} className="btn btn-outline">
                                    Chi tiết khóa học
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrolledCoursesPage;
