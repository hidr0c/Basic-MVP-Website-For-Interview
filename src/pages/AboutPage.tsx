import React, { useState, useEffect } from 'react';
import './AboutPage.css';

// Define the Teacher interface
interface Teacher {
    _id: string;
    name: string;
    avatar: string;
    country: string;
    rating: number;
    specialties: string[];
    experience: number;
    introduction: string;
}

const AboutPage: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const [specialty, setSpecialty] = useState("");

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/teachers');
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    // Lọc giáo viên theo tên và chuyên môn
    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(filter.toLowerCase()) &&
        (specialty === "" || teacher.specialties.includes(specialty))
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
                                <img src={teacher.avatar} alt={teacher.name} />
                                <span className="country-flag">{teacher.country}</span>
                            </div>
                            <div className="teacher-info">
                                <h2>{teacher.name}</h2>
                                <div className="teacher-rating">
                                    <span className="stars">{'★'.repeat(Math.floor(teacher.rating))}{'☆'.repeat(5 - Math.floor(teacher.rating))}</span>
                                    <span className="rating-number">{teacher.rating}</span>
                                </div>
                                <div className="teacher-experience">
                                    <strong>{teacher.experience} năm</strong> kinh nghiệm giảng dạy
                                </div>
                                <div className="teacher-specialties">
                                    {teacher.specialties.map((spec, index) => (
                                        <span key={index} className="specialty-tag">{spec}</span>
                                    ))}
                                </div>
                                <p className="teacher-intro">{teacher.introduction}</p>
                                <div className="teacher-actions">
                                    <button className="btn-view-profile">Xem hồ sơ</button>
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

export default AboutPage;
