import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TeacherDetailPage.css';

interface Teacher {
    _id: string;
    name: string;
    email: string;
    role: string;
    bio?: string;
    experience?: string | number;
    languages?: string[];
    price?: number;
    rating?: number;
    totalStudents?: number;
    targets?: string[];
    isActive?: boolean;
    avatar?: string;
    country?: string;
    specialties?: string[];
    introduction?: string;
    education?: string[];
    certifications?: string[];
    availableSlots?: string[];
}

const TeacherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                // In a real app, this would be a fetch to `/api/users/${id}` or `/api/teachers/${id}`
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch teacher details');
                }
                const data = await response.json();

                // Process the teacher data
                setTeacher({
                    ...data,
                    avatar: data.avatar || `https://avatars.dicebear.com/api/avataaars/${data.name || 'Teacher'}.svg`,
                    country: data.country || 'Global',
                    languages: data.languages || ['English'],
                    specialties: data.specialties || data.targets || ['General English'],
                    targets: data.targets || data.specialties || ['General English'],
                    education: data.education || ['Bachelor of Arts in English Literature'],
                    certifications: data.certifications || ['TEFL Certified'],
                    availableSlots: data.availableSlots || [
                        '2025-08-22T09:00:00',
                        '2025-08-22T14:00:00',
                        '2025-08-23T10:00:00',
                        '2025-08-23T15:00:00',
                        '2025-08-24T09:00:00',
                    ]
                });
            } catch (error) {
                console.error('Error fetching teacher details:', error);
                // Provide mock data when API fails
                setTeacher({
                    _id: id || '1',
                    name: 'Sarah Johnson',
                    email: 'sarah@example.com',
                    role: 'teacher',
                    avatar: 'https://avatars.dicebear.com/api/avataaars/sarah.svg',
                    country: 'UK',
                    rating: 4.8,
                    specialties: ['IELTS', 'Business English'],
                    targets: ['IELTS', 'Business English'],
                    experience: '5 years',
                    bio: 'Certified TEFL instructor with 5 years of experience teaching English to students from diverse backgrounds. I specialize in preparing students for the IELTS exam and teaching Business English. My teaching approach is communicative and focused on real-world applications of language skills. I believe in creating a supportive learning environment where students feel comfortable practicing and making mistakes.',
                    languages: ['English', 'French'],
                    price: 250000,
                    totalStudents: 45,
                    isActive: true,
                    education: [
                        'Bachelor of Arts in English Literature - Oxford University',
                        'Master of Education - Cambridge University'
                    ],
                    certifications: [
                        'TEFL Certification',
                        'IELTS Examiner Certification',
                        'Cambridge Business English Trainer'
                    ],
                    availableSlots: [
                        '2025-08-22T09:00:00',
                        '2025-08-22T14:00:00',
                        '2025-08-23T10:00:00',
                        '2025-08-23T15:00:00',
                        '2025-08-24T09:00:00',
                    ]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [id]);

    // Helper function to format date and time
    const formatDateTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    // Group available slots by date
    const groupSlotsByDate = () => {
        if (!teacher?.availableSlots) return {};

        const grouped: Record<string, string[]> = {};
        teacher.availableSlots.forEach(slot => {
            const { date } = formatDateTime(slot);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(slot);
        });
        return grouped;
    };

    const handleBookLesson = () => {
        if (!selectedSlot) {
            alert('Vui lòng chọn một khung giờ học');
            return;
        }
        // In a real app, this would send a request to the backend
        alert(`Đã đặt lịch học thử với giáo viên ${teacher?.name} vào ${formatDateTime(selectedSlot).date} lúc ${formatDateTime(selectedSlot).time}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải thông tin giáo viên...</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="error-container">
                <h2>Không tìm thấy thông tin giáo viên</h2>
                <p>Giáo viên không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
                <Link to="/teachers" className="btn-back">Quay lại danh sách giáo viên</Link>
            </div>
        );
    }

    const groupedSlots = groupSlotsByDate();

    return (
        <div className="teacher-detail-page">
            <div className="breadcrumbs">
                <Link to="/">Trang chủ</Link> &gt;
                <Link to="/teachers"> Giáo viên</Link> &gt;
                <span>{teacher.name}</span>
            </div>

            <div className="teacher-detail-container">
                <div className="teacher-profile">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <img src={teacher.avatar} alt={teacher.name} />
                        </div>
                        <div className="profile-info">
                            <h1>{teacher.name}</h1>
                            <div className="profile-meta">
                                <div className="country">
                                    <i className="fas fa-globe-americas"></i> {teacher.country}
                                </div>
                                <div className="rating">
                                    <span className="stars">{'★'.repeat(Math.floor(teacher.rating || 0))}{'☆'.repeat(5 - Math.floor(teacher.rating || 0))}</span>
                                    <span className="rating-number">{teacher.rating || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-highlights">
                        <div className="highlight-item">
                            <div className="highlight-value">{teacher.experience}</div>
                            <div className="highlight-label">Kinh nghiệm</div>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-value">{teacher.totalStudents}</div>
                            <div className="highlight-label">Học viên</div>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-value">{(teacher.price || 0).toLocaleString()} VNĐ</div>
                            <div className="highlight-label">Giá/buổi</div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Giới thiệu</h2>
                        <p>{teacher.bio}</p>
                    </div>

                    <div className="profile-section">
                        <h2>Chuyên môn</h2>
                        <div className="tags">
                            {teacher.specialties?.map((specialty, index) => (
                                <span key={index} className="specialty-tag">{specialty}</span>
                            ))}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Ngôn ngữ</h2>
                        <div className="tags">
                            {teacher.languages?.map((language, index) => (
                                <span key={index} className="language-tag">{language}</span>
                            ))}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>Học vấn</h2>
                        <ul className="profile-list">
                            {teacher.education?.map((edu, index) => (
                                <li key={index}>{edu}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="profile-section">
                        <h2>Chứng chỉ</h2>
                        <ul className="profile-list">
                            {teacher.certifications?.map((cert, index) => (
                                <li key={index}>{cert}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="booking-sidebar">
                    <div className="booking-card">
                        <h2>Đặt buổi học thử</h2>
                        <p>Chọn thời gian phù hợp để học thử với giáo viên {teacher.name}</p>

                        <div className="booking-slots">
                            <h3>Chọn thời gian</h3>
                            {Object.entries(groupedSlots).map(([date, slots]) => (
                                <div key={date} className="slot-date-group">
                                    <div className="slot-date">{date}</div>
                                    <div className="slot-times">
                                        {slots.map(slot => {
                                            const { time } = formatDateTime(slot);
                                            return (
                                                <button
                                                    key={slot}
                                                    className={`slot-time ${selectedSlot === slot ? 'selected' : ''}`}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="booking-price">
                            <div className="price-label">Giá buổi học thử:</div>
                            <div className="price-value">MIỄN PHÍ</div>
                        </div>

                        <button
                            className="btn-book-lesson"
                            onClick={handleBookLesson}
                            disabled={!selectedSlot}
                        >
                            Đặt lịch học thử
                        </button>

                        <div className="booking-note">
                            <p>Lưu ý: Buổi học thử kéo dài 30 phút và hoàn toàn miễn phí</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDetailPage;
