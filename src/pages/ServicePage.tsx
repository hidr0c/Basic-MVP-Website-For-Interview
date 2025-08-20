import React, { useState, useEffect } from 'react';
import './ServicePage.css';

// Define the Course interface
interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    teacher: {
        name: string;
        avatar: string;
    };
}

const ServicePage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/lessons');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="service-page">
            <div className="service-header">
                <h1>Khám phá các khóa học</h1>
                <p>Chọn lựa từ hàng trăm khóa học chất lượng cao của chúng tôi</p>
            </div>

            {loading ? (
                <div className="loading-indicator">
                    <p>Đang tải các khóa học...</p>
                </div>
            ) : (
                <div className="services-grid">
                    {courses.map(course => (
                        <div key={course._id} className="service-card">
                            <div className="service-icon">
                                <img src={`https://avatars.dicebear.com/api/initials/${course.title}.svg`} alt={course.title} />
                            </div>
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                            <div className="course-details">
                                <p><strong>Giáo viên:</strong> {course.teacher.name}</p>
                                <p><strong>Giá:</strong> {course.price.toLocaleString()} VNĐ</p>
                            </div>
                            <a href="#" className="service-link">Xem chi tiết</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicePage;
