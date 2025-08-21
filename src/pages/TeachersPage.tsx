import React, { useState, useEffect } from 'react';
import './TeachersPage.css';
import { Link } from 'react-router-dom';

// Define the Teacher interface based on User schema and Teacher schema
interface Teacher {
    _id: string;
    name: string;
    email: string;
    role: string;
    // Fields from teacher profile
    bio?: string;
    experience?: string | number;
    languages?: string[];
    price?: number;
    rating?: number;
    totalStudents?: number;
    targets?: string[];
    isActive?: boolean;
    // Additional UI fields
    avatar?: string;
    country?: string;
    specialties?: string[];
    introduction?: string;
}

const TeachersPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [specialty, setSpecialty] = useState("");

    // Helper function to standardize teacher data format
    const processTeacherData = (teachers: any[]): Teacher[] => {
        return teachers.map(teacher => ({
            _id: teacher._id,
            name: teacher.name || '',
            email: teacher.email || '',
            role: teacher.role || 'teacher',
            bio: teacher.bio || teacher.introduction || '',
            experience: teacher.experience || '0 năm',
            languages: teacher.languages || ['English'],
            price: teacher.price || 0,
            rating: teacher.rating || 0,
            totalStudents: teacher.totalStudents || 0,
            targets: teacher.targets || teacher.specialties || ['General English'],
            specialties: teacher.specialties || teacher.targets || ['General English'],
            isActive: teacher.isActive !== false,
            avatar: teacher.avatar || `https://avatars.dicebear.com/api/avataaars/${teacher.name || 'teacher'}.svg`,
            country: teacher.country || 'Global',
            introduction: teacher.bio || teacher.introduction || ''
        }));
    };

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                // Fetch all users since the backend doesn't support role filtering yet
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                // Filter out only users with teacher role
                const teacherData = data.filter((user: any) => user.role === 'teacher');
                setTeachers(processTeacherData(teacherData));
            } catch (error) {
                console.error('Error fetching teachers:', error);
                // Provide mock data when API fails
                const mockTeachers = [
                    {
                        _id: '1',
                        name: 'Sarah Johnson',
                        email: 'sarah@example.com',
                        role: 'teacher',
                        avatar: 'https://avatars.dicebear.com/api/avataaars/sarah.svg',
                        country: 'UK',
                        rating: 4.8,
                        specialties: ['IELTS', 'Business English'],
                        experience: '5 years',
                        bio: 'Certified TEFL instructor with 5 years of experience teaching English to students from diverse backgrounds.',
                        languages: ['English', 'French'],
                        price: 250000,
                        totalStudents: 45,
                        isActive: true
                    },
                    {
                        _id: '2',
                        name: 'Michael Chen',
                        email: 'michael@example.com',
                        role: 'teacher',
                        avatar: 'https://avatars.dicebear.com/api/avataaars/michael.svg',
                        country: 'US',
                        rating: 4.9,
                        specialties: ['TOEFL', 'Pronunciation'],
                        experience: '7 years',
                        bio: 'Specializing in TOEFL preparation with a focus on pronunciation and fluency.',
                        languages: ['English', 'Chinese'],
                        price: 280000,
                        totalStudents: 32,
                        isActive: true
                    }
                ];
                setTeachers(processTeacherData(mockTeachers));
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Lọc giáo viên theo tên và chuyên môn (sử dụng targets hoặc specialties)
    const filteredTeachers = teachers.filter(teacher =>
        teacher?.role === 'teacher' && // Ensure only teacher role is displayed
        teacher?.name?.toLowerCase().includes(filter.toLowerCase()) &&
        (specialty === "" || teacher?.targets?.includes(specialty) || teacher?.specialties?.includes(specialty))
    );

    return (
        <div className="teachers-page">
            <div className="teachers-header">
                <h1>Tìm giáo viên phù hợp với bạn</h1>
                <p>Khám phá đội ngũ giáo viên chất lượng cao của chúng tôi, có kinh nghiệm giảng dạy và được chứng nhận quốc tế</p>
            </div>

            <div className="teachers-filter">
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Tìm giáo viên theo tên..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-input"
                    />
                </div>
                <div className="filter-group">
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
            </div>

            {loading ? (
                <div className="loading-indicator">
                    <p>Đang tải danh sách giáo viên...</p>
                </div>
            ) : (
                <div className="teachers-grid">
                    {filteredTeachers.map(teacher => (
                        <div key={teacher._id} className="teacher-card">
                            <div className="teacher-avatar">
                                <img src={teacher.avatar || `https://avatars.dicebear.com/api/avataaars/${teacher.name || 'Teacher'}.svg`} alt={teacher.name || 'Teacher'} />
                                <span className="country-flag">{teacher.country || 'Global'}</span>
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
                                <p className="teacher-intro">{teacher.bio || teacher.introduction || 'Thông tin giới thiệu sẽ được cập nhật sớm.'}</p>
                                <div className="teacher-price">
                                    <strong>Giá: </strong>{(teacher.price || 0).toLocaleString()} VNĐ/buổi
                                </div>
                                <div className="teacher-stats">
                                    <span><strong>{teacher.totalStudents || 0}</strong> học viên đã học</span>
                                    <span><strong>{teacher.languages?.join(', ') || 'English'}</strong></span>
                                </div>
                                <div className="teacher-actions">
                                    <Link to={`/teachers/${teacher._id}`} className="btn-view-profile">Xem hồ sơ</Link>
                                    <button className="btn-book-trial">Đặt học thử</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeachersPage;
