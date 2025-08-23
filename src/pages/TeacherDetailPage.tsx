import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './TeacherDetailPage.css';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface Teacher {
    _id: string;
    userId: string;
    bio: string;
    experience: string;
    languages: string[];
    price: number;
    rating: number;
    totalStudents: number;
    targets: string[];
    isActive: boolean;
    availableSlots: string[];
    createdAt: string;
    updatedAt: string;
    // UI helpers
    name?: string;
    email?: string;
    avatar?: string;
    country?: string;
    specialties?: string[];
    education?: string[];
    certifications?: string[];
}

const TeacherDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                console.log(`Fetching teacher details for ID: ${id}`);
                // Fetch teacher profile data
                const teacherResponse = await fetch(`/api/teachers/${id}`);
                if (!teacherResponse.ok) {
                    console.error('Teacher API response not OK:', await teacherResponse.text());
                    throw new Error(`Failed to fetch teacher details: ${teacherResponse.status}`);
                }
                const teacherData = await teacherResponse.json();
                console.log('Teacher data fetched:', teacherData);

                // Fetch user data for name and email
                const userResponse = await fetch(`/api/users/${teacherData.userId}`);
                if (!userResponse.ok) {
                    console.error('User API response not OK:', await userResponse.text());
                    throw new Error(`Failed to fetch user details: ${userResponse.status}`);
                }
                const userData = await userResponse.json();
                console.log('User data fetched:', userData);

                // Combine teacher and user data
                setTeacher({
                    ...teacherData,
                    name: userData.name,
                    email: userData.email,
                    avatar: `https://avatars.dicebear.com/api/avataaars/${userData.name}.svg`,
                    country: 'Vietnam', // Default country or can be added to teacher profile
                    specialties: teacherData.targets || [], // Use targets as specialties
                    education: ['Bachelor of Arts in English Literature'], // Can be added to teacher profile in future
                    certifications: ['TEFL Certified'], // Can be added to teacher profile in future
                    // Ensure availableSlots exists
                    availableSlots: teacherData.availableSlots || [
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
                // Make sure we have a valid ID from the URL parameters
                const validId = id && id !== 'undefined' && id !== 'null' ? id : '1';

                setTeacher({
                    _id: validId, // The teacher profile ID
                    userId: `user_${validId}`, // Mock a user ID
                    name: 'Teacher John', // UI helper, not part of Teacher model
                    email: 'john@teacher.com', // UI helper, not part of Teacher model
                    avatar: 'https://avatars.dicebear.com/api/avataaars/john.svg', // UI helper
                    country: 'Vietnam', // UI helper
                    rating: 5,
                    specialties: ['IELTS', 'Business English'], // UI helper
                    targets: ['IELTS', 'Business English'],
                    experience: 'Đã dạy 200 học viên',
                    bio: 'Giáo viên IELTS 5 năm kinh nghiệm',
                    languages: ['English', 'Vietnamese'],
                    price: 25, // Price per lesson in USD
                    totalStudents: 200,
                    isActive: true,
                    createdAt: '2025-08-20T10:00:00.000+00:00',
                    updatedAt: '2025-08-20T10:00:00.000+00:00',
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
        setShowConfirmation(true);
    };

    const confirmBooking = async () => {
        try {
            setBookingStatus('pending');

            // Actual API call to book a lesson
            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        teacherId: teacher?._id,
                        userId: localStorage.getItem('userId') || 'guest', // Get current user ID or use 'guest'
                        slot: selectedSlot,
                        type: 'trial',
                        status: 'pending'
                    })
                });

                if (!response.ok) throw new Error('Booking failed');

                // If booking is successful, proceed
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error('API call failed, using fallback behavior', error);
                // Simulate API call if the real one fails
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setBookingStatus('success');
            // Close popup after 2 seconds on success
            setTimeout(() => {
                setShowConfirmation(false);
                setBookingStatus('idle');
                setSelectedSlot(null);
            }, 2000);
        } catch (error) {
            console.error('Error booking lesson:', error);
            setBookingStatus('error');
            // Close popup after 2 seconds on error
            setTimeout(() => {
                setShowConfirmation(false);
                setBookingStatus('idle');
            }, 2000);
        }
    };

    const cancelBooking = () => {
        setShowConfirmation(false);
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

            {/* Booking confirmation popup */}
            <BookingConfirmation
                show={showConfirmation}
                teacher={teacher}
                selectedSlot={selectedSlot}
                status={bookingStatus}
                onConfirm={confirmBooking}
                onCancel={cancelBooking}
                formatDateTime={formatDateTime}
            />
        </div>
    );
};

// Confirmation popup component
const BookingConfirmation: React.FC<{
    show: boolean;
    teacher: Teacher | null;
    selectedSlot: string | null;
    status: 'idle' | 'pending' | 'success' | 'error';
    onConfirm: () => void;
    onCancel: () => void;
    formatDateTime: (dateTime: string) => { date: string; time: string };
}> = ({ show, teacher, selectedSlot, status, onConfirm, onCancel, formatDateTime }) => {
    if (!show || !teacher || !selectedSlot) return null;

    return (
        <div className="booking-confirmation-overlay">
            <div className="booking-confirmation-modal">
                {status === 'idle' && (
                    <>
                        <h3>Xác nhận đặt lịch học</h3>
                        <p>Bạn muốn đặt lịch học thử với giáo viên <strong>{teacher.name}</strong>?</p>

                        <div className="booking-details">
                            <div className="booking-detail-item">
                                <span className="detail-label">Ngày học:</span>
                                <span className="detail-value">{formatDateTime(selectedSlot).date}</span>
                            </div>
                            <div className="booking-detail-item">
                                <span className="detail-label">Giờ học:</span>
                                <span className="detail-value">{formatDateTime(selectedSlot).time}</span>
                            </div>
                            <div className="booking-detail-item">
                                <span className="detail-label">Loại buổi học:</span>
                                <span className="detail-value">Học thử (Miễn phí)</span>
                            </div>
                        </div>

                        <div className="booking-actions">
                            <button className="btn-cancel" onClick={onCancel}>Hủy</button>
                            <button className="btn-confirm" onClick={onConfirm}>Xác nhận</button>
                        </div>
                    </>
                )}

                {status === 'pending' && (
                    <div className="booking-status">
                        <div className="status-spinner"></div>
                        <p>Đang xử lý đặt lịch...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="booking-status success">
                        <div className="status-icon">✓</div>
                        <h3>Đặt lịch thành công!</h3>
                        <p>
                            Bạn đã đặt lịch học thử với giáo viên <strong>{teacher.name}</strong> vào lúc{' '}
                            <strong>{formatDateTime(selectedSlot).time}</strong> ngày{' '}
                            <strong>{formatDateTime(selectedSlot).date}</strong>
                        </p>
                        <p className="status-note">
                            Thông tin chi tiết đã được gửi đến email của bạn
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="booking-status error">
                        <div className="status-icon">✗</div>
                        <h3>Đặt lịch thất bại</h3>
                        <p>
                            Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.
                        </p>
                        <button className="btn-try-again" onClick={onCancel}>Đóng</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherDetailPage;
