import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './EnrolledCoursesPage.css';
import { useAuth } from '../contexts/AuthContext';
import { simulateApiDelay } from '../utils/mockData';

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

// We're now using the User type from AuthContext

const EnrolledCoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'upcoming'>('all');
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        fetchEnrolledCourses(user.id);
    }, [navigate, isAuthenticated, user]);

    const fetchEnrolledCourses = async (userId: string) => {
        setLoading(true);
        try {
            // Try to fetch from API with a timeout to prevent long waiting
            try {
                const token = localStorage.getItem('authToken');
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(`/api/users/${userId}/courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                    setLoading(false);
                    return;
                }
                throw new Error('API response not OK');
            } catch (apiError) {
                console.log('API connection failed, using mock data', apiError);
            }

            // Use mock data when API is not available
            console.log('Using mock data for enrolled courses');

            // Add a realistic delay to simulate API call
            await simulateApiDelay();

            // Convert mockCourses from mockData.ts to the format expected by this component
            const enrolledCourses: Course[] = [
                {
                    id: '1',
                    name: 'IELTS Preparation Course',
                    description: 'Comprehensive preparation for the IELTS exam focusing on all four skills: reading, writing, listening and speaking.',
                    teacherName: 'Sarah Johnson',
                    teacherId: '101',
                    status: 'active',
                    progress: 45,
                    nextLesson: {
                        id: 'lesson-1',
                        title: 'IELTS Writing Task 2',
                        date: '24/08/2023, 15:00'
                    }
                },
                {
                    id: '2',
                    name: 'Business English',
                    description: 'Learn professional English communication skills for workplace and international business contexts.',
                    teacherName: 'Michael Chen',
                    teacherId: '102',
                    status: 'completed',
                    progress: 100
                },
                {
                    id: '3',
                    name: 'Conversational English',
                    description: 'Improve your speaking fluency and confidence through practical conversation practice.',
                    teacherName: 'Emily Watson',
                    teacherId: '103',
                    status: 'upcoming',
                    progress: 0,
                    nextLesson: {
                        id: 'lesson-2',
                        title: 'Introduction & Getting to Know Each Other',
                        date: '28/08/2023, 10:00'
                    }
                }
            ];
            setCourses(enrolledCourses);
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
