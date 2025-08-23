import React, { useState, useEffect } from 'react';
import './TeachersPage.css';
import { Link } from 'react-router-dom';
import TeacherQuiz from '../components/TeacherQuiz';

// Combined interface for UI display
interface Teacher {
    _id: string;       // Teacher profile ID
    userId: string;    // User ID
    name: string;      // From User
    email: string;     // From User
    bio: string;
    experience: string;
    languages: string[];
    price: number;
    rating: number;
    totalStudents: number;
    targets: string[];
    isActive: boolean;
    availableSlots: string[];
    // UI helpers
    avatar?: string;
    country?: string;
    specialties?: string[];
}

const TeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [nameFilter, setNameFilter] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [languageFilter, setLanguageFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [recommendedTeachers, setRecommendedTeachers] = useState<Teacher[]>([]);
    const [showRecommended, setShowRecommended] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleOpenModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
        setSelectedSlot(null); // Reset selected slot when opening modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    };

    // Helper function to standardize teacher data format from combined data
    const processTeacherData = (teacherProfiles: any[], users: any[]): Teacher[] => {
        return teacherProfiles.map(profile => {
            // Find matching user for this teacher profile
            const user = users.find(u => u._id === profile.userId);
            if (!user) {
                // If no user is found, use default values to prevent crashes
                return {
                    _id: profile._id,
                    userId: profile.userId,
                    name: 'Unknown Teacher',
                    email: 'unknown@example.com',
                    bio: profile.bio || '',
                    experience: profile.experience || '0 năm',
                    languages: profile.languages || ['English'],
                    price: profile.price || 0,
                    rating: profile.rating || 0,
                    totalStudents: profile.totalStudents || 0,
                    targets: profile.targets || ['General English'],
                    specialties: profile.targets || ['General English'],
                    isActive: profile.isActive !== false,
                    availableSlots: profile.availableSlots || [],
                    avatar: `https://avatars.dicebear.com/api/avataaars/unknown.svg`,
                    country: 'Unknown'
                };
            }

            return {
                _id: profile._id,
                userId: profile.userId,
                name: user.name,
                email: user.email,
                bio: profile.bio || '',
                experience: profile.experience || '0 năm',
                languages: profile.languages || ['English'],
                price: profile.price || 0,
                rating: profile.rating || 0,
                totalStudents: profile.totalStudents || 0,
                targets: profile.targets || ['General English'],
                specialties: profile.targets || ['General English'], // Use targets as specialties
                isActive: profile.isActive !== false,
                availableSlots: profile.availableSlots || [],
                avatar: `https://avatars.dicebear.com/api/avataaars/${user.name || 'teacher'}.svg`,
                country: 'Vietnam' // Default country
            };
        });
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Fetch teacher profiles
                const teacherProfilesResponse = await fetch('/api/teachers');
                if (!teacherProfilesResponse.ok) {
                    throw new Error('Failed to fetch teacher profiles');
                }
                const teacherProfiles = await teacherProfilesResponse.json();

                // Fetch all users to ensure we can match them
                const usersResponse = await fetch('/api/users');
                if (!usersResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await usersResponse.json();

                // Process and combine the data
                setTeachers(processTeacherData(teacherProfiles, userData));
            } catch (error) {
                console.error('Error fetching teachers:', error);
                // Provide mock data when API fails
                const mockTeacherProfiles = [
                    {
                        _id: '68a550d66c5a347aaf3d1052',
                        userId: '68a550d66c5a347aaf3d1050',
                        bio: 'Giáo viên IELTS 5 năm kinh nghiệm',
                        experience: 'Đã dạy 200 học viên',
                        languages: ['English', 'Vietnamese'],
                        price: 25,
                        rating: 5,
                        totalStudents: 200,
                        targets: ['IELTS', 'Business English'],
                        isActive: true,
                        availableSlots: [
                            '2025-08-22T09:00:00',
                            '2025-08-22T14:00:00'
                        ],
                        createdAt: '2025-08-20T10:00:00.000+00:00',
                        updatedAt: '2025-08-20T10:00:00.000+00:00'
                    },
                    {
                        _id: '68a550d66c5a347aaf3d1054',
                        userId: '68a550d66c5a347aaf3d1051',
                        bio: 'Chuyên gia về phát âm và giao tiếp',
                        experience: 'Đã dạy 150 học viên',
                        languages: ['English', 'Chinese'],
                        price: 30,
                        rating: 4.9,
                        totalStudents: 150,
                        targets: ['Pronunciation', 'Communication'],
                        isActive: true,
                        availableSlots: [
                            '2025-08-22T10:00:00',
                            '2025-08-23T15:00:00'
                        ],
                        createdAt: '2025-08-20T10:00:00.000+00:00',
                        updatedAt: '2025-08-20T10:00:00.000+00:00'
                    }
                ];

                const mockUserData = [
                    {
                        _id: '68a550d66c5a347aaf3d1050',
                        name: 'Teacher John',
                        email: 'john@teacher.com',
                        role: 'teacher',
                        createdAt: '2025-08-20T10:00:00.000+00:00',
                        updatedAt: '2025-08-20T10:00:00.000+00:00'
                    },
                    {
                        _id: '68a550d66c5a347aaf3d1051',
                        name: 'Teacher Jane',
                        email: 'jane@teacher.com',
                        role: 'teacher',
                        createdAt: '2025-08-20T10:00:00.000+00:00',
                        updatedAt: '2025-08-20T10:00:00.000+00:00'
                    }
                ];

                // Use the mock data
                setTeachers(processTeacherData(mockTeacherProfiles, mockUserData));
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Handle quiz completion
    const handleQuizComplete = (results: Record<string, string>) => {
        // Logic to find recommended teachers based on quiz results
        const filteredList = teachers.filter(teacher => {
            // Example logic - customize based on your actual teacher properties
            let score = 0;

            // Check teaching goals (q1)
            if (results.q1 === "exam" && teacher.targets?.includes("IELTS")) score += 3;
            if (results.q1 === "business" && teacher.targets?.includes("Business English")) score += 3;

            // Check price range (q5)
            if (results.q5 === "economy" && teacher.price <= 200000) score += 2;
            if (results.q5 === "standard" && teacher.price > 200000 && teacher.price <= 400000) score += 2;
            if (results.q5 === "premium" && teacher.price > 400000 && teacher.price <= 600000) score += 2;
            if (results.q5 === "luxury" && teacher.price > 600000) score += 2;

            return score >= 2; // Teachers with score of 2 or more are considered matches
        });

        setRecommendedTeachers(filteredList.length > 0 ? filteredList : teachers.slice(0, 3));
        setShowRecommended(true);
        setIsQuizOpen(false);
    };

    const handleToggleAdvancedFilters = () => {
        setShowAdvancedFilters(!showAdvancedFilters);
    };

    const filteredTeachers = teachers.filter(teacher => {
        // Basic filters
        const nameMatch = teacher?.name?.toLowerCase().includes(nameFilter.toLowerCase());
        const specialtyMatch = specialty === "" || teacher?.targets?.includes(specialty) || teacher?.specialties?.includes(specialty);

        // Advanced filters
        const priceMatch = teacher.price >= priceRange[0] && teacher.price <= priceRange[1];
        const languageMatch = languageFilter === "" || teacher?.languages?.includes(languageFilter);
        const countryMatch = countryFilter === "" || teacher?.country?.includes(countryFilter);

        // Apply all filters
        return nameMatch && specialtyMatch && priceMatch && languageMatch && countryMatch;
    });

    // Display teachers - either recommended or filtered
    return (
        <div className="teachers-page">
            {isQuizOpen && (
                <div className="quiz-overlay">
                    <div className="quiz-wrapper">
                        <TeacherQuiz
                            onComplete={handleQuizComplete}
                            onClose={() => setIsQuizOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="teachers-header">
                <h1>Tìm giáo viên phù hợp với bạn</h1>
                <p>Khám phá đội ngũ giáo viên chất lượng cao của chúng tôi, có kinh nghiệm giảng dạy và được chứng nhận quốc tế</p>
                <button
                    className="quiz-button"
                    onClick={() => setIsQuizOpen(true)}
                >
                    Làm bài Quiz để tìm giáo viên phù hợp
                </button>
            </div>

            <div className="teachers-filter">
                <div className="filter-header">
                    <h3 className="filter-title">Bộ lọc tìm kiếm</h3>
                    <button
                        className="filter-toggle"
                        onClick={handleToggleAdvancedFilters}
                    >
                        {showAdvancedFilters ? 'Ẩn bộ lọc nâng cao' : 'Hiện bộ lọc nâng cao'}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 12L2 6L3.4 4.6L8 9.2L12.6 4.6L14 6L8 12Z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Tên giáo viên</label>
                    <input
                        type="text"
                        placeholder="Tìm giáo viên theo tên..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Chuyên môn</label>
                    <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Tất cả chuyên môn</option>
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="Business English">Business English</option>
                        <option value="Conversation">Conversation</option>
                        <option value="Kids">Kids</option>
                        <option value="Pronunciation">Pronunciation</option>
                        <option value="Grammar">Grammar</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Academic English">Academic English</option>
                        <option value="Exam Preparation">Exam Preparation</option>
                    </select>
                </div>

                {showAdvancedFilters && (
                    <div className="advanced-filters">
                        <div className="filter-group">
                            <label className="filter-label">Ngôn ngữ</label>
                            <select
                                value={languageFilter}
                                onChange={(e) => setLanguageFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tất cả ngôn ngữ</option>
                                <option value="English">Tiếng Anh</option>
                                <option value="Vietnamese">Tiếng Việt</option>
                                <option value="Chinese">Tiếng Trung</option>
                                <option value="Japanese">Tiếng Nhật</option>
                                <option value="Korean">Tiếng Hàn</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Quốc gia</label>
                            <select
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Tất cả quốc gia</option>
                                <option value="Vietnam">Việt Nam</option>
                                <option value="US">Mỹ</option>
                                <option value="UK">Anh</option>
                                <option value="Australia">Úc</option>
                                <option value="Philippines">Philippines</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Mức giá (VNĐ)</label>
                            <div className="price-range">
                                <input
                                    type="range"
                                    min={0}
                                    max={1000000}
                                    step={50000}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                />
                                <span className="price-display">
                                    {priceRange[1].toLocaleString()} VNĐ
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showRecommended && (
                <div className="recommended-section">
                    <div className="recommended-header">
                        <h2>Giáo viên phù hợp với bạn</h2>
                        <button
                            className="clear-recommended"
                            onClick={() => setShowRecommended(false)}
                        >
                            Xem tất cả giáo viên
                        </button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="loading-indicator">
                    <p>Đang tải danh sách giáo viên...</p>
                </div>
            ) : (
                <div className="teachers-grid">
                    {(showRecommended ? recommendedTeachers : filteredTeachers).map(teacher => (
                        <div key={teacher._id} className="teacher-card">
                            <div className="teacher-avatar">
                                <img src={teacher.avatar || `https://avatars.dicebear.com/api/avataaars/${teacher.name || 'Teacher'}.svg`} alt={teacher.name || 'Teacher'} />
                                <span className="country-flag">{teacher.country || 'Global'}</span>
                                {showRecommended && <span className="recommended-badge">Phù hợp với bạn</span>}
                            </div>
                            <div className="teacher-info">
                                <h2>{teacher.name}</h2>
                                <div className="teacher-rating">
                                    <span className="stars">{'★'.repeat(Math.floor(teacher.rating || 0))}{'☆'.repeat(5 - Math.floor(teacher.rating || 0))}</span>
                                    <span className="rating-number">{teacher.rating || 0}</span>
                                </div>
                                <div className="teacher-experience">
                                    <strong>{teacher.experience || '0 năm'}</strong> kinh nghiệm giảng dạy
                                </div>
                                <div className="teacher-specialties">
                                    {/* Use targets or specialties, depending on what's available */}
                                    {(teacher.targets || teacher.specialties)?.map((spec, index) => (
                                        <span key={index} className="specialty-tag">{spec}</span>
                                    )) || <span className="specialty-tag">General English</span>}
                                </div>
                                <p className="teacher-intro">{teacher.bio || 'Thông tin giới thiệu sẽ được cập nhật sớm.'}</p>
                                <div className="teacher-price">
                                    <strong>Giá: </strong>{(teacher.price || 0).toLocaleString()} VNĐ/buổi
                                </div>
                                <div className="teacher-stats">
                                    <span><strong>{teacher.totalStudents || 0}</strong> học viên đã học</span>
                                    <span><strong>{teacher.languages?.join(', ') || 'English'}</strong></span>
                                </div>
                                <div className="teacher-actions">
                                    <button onClick={() => handleOpenModal(teacher)} className="btn-book-trial">Đặt lịch học thử</button>
                                    <Link to={`/teachers/${teacher._id}`} className="btn-view-profile">Xem hồ sơ</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedTeacher && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                        <div className="modal-header">
                            <h2>Đặt lịch học thử miễn phí với {selectedTeacher.name}</h2>
                            <p className="modal-subtitle">Buổi học thử 30 phút hoàn toàn miễn phí để bạn làm quen với giáo viên</p>
                        </div>

                        <div className="modal-body">
                            <div className="teacher-details">
                                <div className="modal-teacher-profile">
                                    <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="modal-avatar" />
                                    <div className="modal-teacher-info">
                                        <h3>{selectedTeacher.name}</h3>
                                        <div className="teacher-rating">
                                            <span className="stars">{'★'.repeat(Math.floor(selectedTeacher.rating || 0))}{'☆'.repeat(5 - Math.floor(selectedTeacher.rating || 0))}</span>
                                            <span className="rating-number">{selectedTeacher.rating || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-teacher-stats">
                                    <div className="modal-stat-item">
                                        <strong>Kinh nghiệm:</strong> {selectedTeacher.experience}
                                    </div>
                                    <div className="modal-stat-item">
                                        <strong>Chuyên môn:</strong> {selectedTeacher.specialties?.join(', ')}
                                    </div>
                                    <div className="modal-stat-item">
                                        <strong>Ngoại ngữ:</strong> {selectedTeacher.languages?.join(', ')}
                                    </div>
                                    <div className="modal-stat-item">
                                        <strong>Đã dạy:</strong> {selectedTeacher.totalStudents} học viên
                                    </div>
                                    <div className="modal-stat-item highlighted">
                                        <strong>Học phí sau học thử:</strong> {selectedTeacher.price.toLocaleString()} VNĐ/buổi
                                    </div>
                                </div>

                                <div className="free-trial-info">
                                    <div className="trial-badge">Học thử miễn phí</div>
                                    <p>Bạn sẽ được học thử 30 phút miễn phí với giáo viên để đánh giá phong cách giảng dạy và mức độ phù hợp trước khi quyết định học chính thức.</p>
                                </div>
                            </div>

                            <div className="time-slots">
                                <h3>Chọn thời gian học thử:</h3>
                                {selectedTeacher.availableSlots.length > 0 ? (
                                    <div className="slots-container">
                                        {selectedTeacher.availableSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                className={`slot-button ${selectedSlot === slot ? 'selected' : ''}`}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {new Date(slot).toLocaleString('vi-VN', {
                                                    weekday: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                })}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Giáo viên hiện không có lịch trống.</p>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <p className="booking-note">Bằng cách đặt lịch, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> của chúng tôi</p>
                            <button
                                className="btn-confirm-booking"
                                disabled={!selectedSlot}
                                onClick={() => alert(`Đã đặt lịch học thử với ${selectedTeacher.name} vào ${new Date(selectedSlot || '').toLocaleString('vi-VN')}`)}
                            >
                                Đặt lịch học thử miễn phí
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachersPage;
