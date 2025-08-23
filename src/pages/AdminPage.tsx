import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminPage.css';

// Icons for improved UI
const icons = {
    dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" />
        <path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z" />
    </svg>,
    users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>,
    teachers: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
    </svg>,
    courses: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
    </svg>,
    payments: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
    </svg>,
    analytics: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M0 0h16v16H0V0zm1 15h14V1H1v14zM5 11V5h1v6H5zm4 0V7h1v4H9zm4-2v-2h1v2h-1z" />
    </svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
    </svg>,
    plus: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>,
    edit: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
    </svg>,
    delete: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>,
    view: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>,
    trending_up: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
    </svg>,
    trending_down: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z" />
    </svg>,
    trending_flat: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
    </svg>
};

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

interface Booking {
    id: string;
    studentName: string;
    teacherName: string;
    date: string;
    time: string;
    status: string;
    amount?: number;
}

interface AdminStats {
    totalUsers: number;
    newUsers: number;
    userGrowth: number;
    totalTeachers: number;
    newTeachers: number;
    teacherGrowth: number;
    totalRevenue: number;
    monthlyRevenue: number;
    revenueGrowth: number;
    bookingCompletionRate: number;
}

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'teachers' | 'courses' | 'payments' | 'settings'>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Additional state for improved functionality
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [courseSearch, setCourseSearch] = useState('');
    const [courseStatusFilter, setCourseStatusFilter] = useState('all');

    // New state for booking management
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

    // New state for modal
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'user' | 'course' | 'teacher' | 'booking'>('user');
    const [modalData, setModalData] = useState<any>(null);

    // New state for statistics
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        newUsers: 0,
        userGrowth: 5.2,
        totalTeachers: 0,
        newTeachers: 0,
        teacherGrowth: 2.1,
        totalRevenue: 0,
        monthlyRevenue: 0,
        revenueGrowth: 8.3,
        bookingCompletionRate: 85
    });

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
        if (tabParam && ['dashboard', 'users', 'teachers', 'courses', 'payments', 'settings'].includes(tabParam)) {
            setActiveTab(tabParam as 'dashboard' | 'users' | 'teachers' | 'courses' | 'payments' | 'settings');
        }

        // Fetch data based on active tab
        fetchData();
    }, [isAuthenticated, user, navigate, location.search]);

    useEffect(() => {
        // Update data when active tab changes
        fetchData();

        // Reset pagination when changing tabs
        setCurrentPage(1);
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            // Set up fetch with timeout to prevent long waits
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            if (activeTab === 'users' || activeTab === 'dashboard') {
                try {
                    const response = await fetch('/api/users', {
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
                    const data = await response.json();
                    setUsers(data);

                    // Update stats
                    const studentsCount = data.filter((u: User) => u.role === 'student').length;
                    const newUsersLastMonth = data.filter((u: User) => {
                        const createdDate = new Date(u.createdAt);
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        return createdDate >= oneMonthAgo;
                    }).length;

                    setStats(prev => ({
                        ...prev,
                        totalUsers: studentsCount,
                        newUsers: newUsersLastMonth
                    }));
                } catch (userErr) {
                    console.error('Error fetching users:', userErr);
                    // If API fails, load mock data
                    setUsers([
                        { id: '1', name: 'Nguyen Van A', email: 'nguyenvana@example.com', role: 'student', createdAt: '2023-01-15' },
                        { id: '2', name: 'Tran Thi B', email: 'tranthib@example.com', role: 'teacher', createdAt: '2023-02-20' },
                        { id: '3', name: 'Le Van C', email: 'levanc@example.com', role: 'student', createdAt: '2023-03-05' },
                        { id: '4', name: 'Pham Thi D', email: 'phamthid@example.com', role: 'admin', createdAt: '2023-01-10' },
                        { id: '5', name: 'Hoang Van E', email: 'hoangvane@example.com', role: 'student', createdAt: '2023-04-25' },
                        { id: '6', name: 'Vu Thi F', email: 'vuthif@example.com', role: 'student', createdAt: '2023-05-12' },
                        { id: '7', name: 'Ngo Van G', email: 'ngovang@example.com', role: 'teacher', createdAt: '2023-03-30' },
                        { id: '8', name: 'Mai Thi H', email: 'maithih@example.com', role: 'student', createdAt: '2023-04-18' },
                        { id: '9', name: 'Dinh Van I', email: 'dinhvani@example.com', role: 'student', createdAt: '2023-05-05' },
                        { id: '10', name: 'Tran Van K', email: 'tranvank@example.com', role: 'teacher', createdAt: '2023-02-10' }
                    ]);
                }
            }

            if (activeTab === 'teachers' || activeTab === 'dashboard') {
                try {
                    const response = await fetch('/api/teachers', {
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`Failed to fetch teachers: ${response.status}`);
                    const data = await response.json();

                    // Update stats for teachers
                    const teachersCount = data.length;
                    const newTeachersLastMonth = data.filter((t: any) => {
                        const createdDate = new Date(t.createdAt);
                        const oneMonthAgo = new Date();
                        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                        return createdDate >= oneMonthAgo;
                    }).length;

                    setStats(prev => ({
                        ...prev,
                        totalTeachers: teachersCount,
                        newTeachers: newTeachersLastMonth
                    }));
                } catch (teacherErr) {
                    console.error('Error fetching teachers:', teacherErr);
                    // If API fails, we already have teacher data in users
                }
            }

            if (activeTab === 'courses' || activeTab === 'dashboard') {
                try {
                    const response = await fetch('/api/courses', {
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);
                    const data = await response.json();
                    setCourses(data);
                } catch (courseErr) {
                    console.error('Error fetching courses:', courseErr);
                    // If API fails, load mock data
                    setCourses([
                        { id: '1', title: 'Tiếng Anh Giao Tiếp Cơ Bản', teacherName: 'Tran Thi B', enrolledStudents: 24, status: 'active' },
                        { id: '2', title: 'Tiếng Nhật N5 - N4', teacherName: 'Yamada Kenji', enrolledStudents: 18, status: 'active' },
                        { id: '3', title: 'Tiếng Pháp cho người mới bắt đầu', teacherName: 'Marie Claire', enrolledStudents: 12, status: 'pending' },
                        { id: '4', title: 'Tiếng Hàn Giao Tiếp', teacherName: 'Park Min Ho', enrolledStudents: 30, status: 'active' },
                        { id: '5', title: 'Tiếng Trung Thương Mại', teacherName: 'Zhang Wei', enrolledStudents: 15, status: 'ended' },
                        { id: '6', title: 'Tiếng Đức A1-A2', teacherName: 'Hans Mueller', enrolledStudents: 10, status: 'pending' },
                        { id: '7', title: 'Tiếng Anh Thương Mại', teacherName: 'John Smith', enrolledStudents: 22, status: 'active' },
                        { id: '8', title: 'Tiếng Hàn K-Pop', teacherName: 'Kim Ji-soo', enrolledStudents: 35, status: 'active' }
                    ]);
                }
            }

            if (activeTab === 'payments' || activeTab === 'dashboard') {
                try {
                    const response = await fetch('/api/bookings', {
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`Failed to fetch bookings: ${response.status}`);
                    const data = await response.json();
                    setBookings(data);

                    // Calculate revenue stats
                    const totalRevenue = data.reduce((sum: number, booking: Booking) =>
                        booking.amount ? sum + booking.amount : sum, 0);

                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const monthlyRevenue = data.reduce((sum: number, booking: Booking) => {
                        const bookingDate = new Date(booking.date);
                        return (bookingDate.getMonth() === currentMonth &&
                            bookingDate.getFullYear() === currentYear &&
                            booking.amount) ?
                            sum + booking.amount : sum;
                    }, 0);

                    const completedBookings = data.filter((b: Booking) => b.status === 'completed').length;
                    const totalBookings = data.length;
                    const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

                    setStats(prev => ({
                        ...prev,
                        totalRevenue,
                        monthlyRevenue,
                        bookingCompletionRate: Math.round(completionRate)
                    }));
                } catch (bookingErr) {
                    console.error('Error fetching bookings:', bookingErr);
                    // If API fails, load mock data
                    setBookings([
                        { id: '1', studentName: 'Nguyen Van A', teacherName: 'Tran Thi B', date: '2023-06-15', time: '10:00 - 11:30', status: 'upcoming', amount: 350000 },
                        { id: '2', studentName: 'Le Van C', teacherName: 'Park Min Ho', date: '2023-06-10', time: '14:00 - 15:30', status: 'completed', amount: 450000 },
                        { id: '3', studentName: 'Hoang Van E', teacherName: 'Yamada Kenji', date: '2023-06-18', time: '09:00 - 10:30', status: 'upcoming', amount: 400000 },
                        { id: '4', studentName: 'Nguyen Van A', teacherName: 'Marie Claire', date: '2023-06-05', time: '16:00 - 17:30', status: 'cancelled', amount: 500000 },
                        { id: '5', studentName: 'Dinh Van I', teacherName: 'Hans Mueller', date: '2023-06-20', time: '18:00 - 19:30', status: 'upcoming', amount: 450000 },
                        { id: '6', studentName: 'Mai Thi H', teacherName: 'Tran Thi B', date: '2023-06-12', time: '10:00 - 11:30', status: 'completed', amount: 350000 },
                        { id: '7', studentName: 'Nguyen Van A', teacherName: 'Zhang Wei', date: '2023-06-25', time: '14:00 - 15:30', status: 'upcoming', amount: 500000 }
                    ]);
                }
            }

            // Only set error if all relevant requests failed
            if (users.length === 0 && courses.length === 0 && bookings.length === 0) {
                setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            }

            clearTimeout(timeoutId);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    // Format currency helper
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'đ');
    };

    const renderDashboard = () => (
        <div className="admin-container">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-description">Xem tổng quan về hoạt động của hệ thống</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <h3 className="stat-title">Học Viên</h3>
                        <div className="stat-icon users">{icons.users}</div>
                    </div>
                    <div className="stat-value">{stats.totalUsers}</div>
                    <div className="stat-description">
                        {icons.trending_up}
                        <span className="trend-up">{stats.newUsers} học viên mới trong tháng này</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <h3 className="stat-title">Giáo Viên</h3>
                        <div className="stat-icon teachers">{icons.teachers}</div>
                    </div>
                    <div className="stat-value">{stats.totalTeachers}</div>
                    <div className="stat-description">
                        {stats.teacherGrowth > 0 ? icons.trending_up : stats.teacherGrowth < 0 ? icons.trending_down : icons.trending_flat}
                        <span className={stats.teacherGrowth > 0 ? "trend-up" : stats.teacherGrowth < 0 ? "trend-down" : "trend-neutral"}>
                            {stats.newTeachers} giáo viên mới trong tháng này
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <h3 className="stat-title">Khóa Học</h3>
                        <div className="stat-icon courses">{icons.courses}</div>
                    </div>
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-description">
                        {icons.trending_up}
                        <span className="trend-up">{courses.filter(c => c.status === 'pending').length} khóa học sắp mở</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <h3 className="stat-title">Doanh Thu</h3>
                        <div className="stat-icon revenue">{icons.payments}</div>
                    </div>
                    <div className="stat-value">
                        {formatCurrency(stats.monthlyRevenue)}
                    </div>
                    <div className="stat-description">
                        {stats.revenueGrowth > 0 ? icons.trending_up : icons.trending_down}
                        <span className={stats.revenueGrowth > 0 ? "trend-up" : "trend-down"}>
                            {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}% so với tháng trước
                        </span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Người Dùng Mới Nhất</h2>
                    <button className="card-action" onClick={() => setActiveTab('users')}>
                        Xem tất cả {icons.trending_flat}
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Họ tên</th>
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
                                                {user.role === 'admin' ? 'Quản trị' :
                                                    user.role === 'teacher' ? 'Giáo viên' : 'Học viên'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h2 className="card-title">Lịch học sắp tới</h2>
                    <button className="card-action" onClick={() => setActiveTab('payments')}>
                        Xem tất cả {icons.trending_flat}
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Học viên</th>
                                    <th>Giáo viên</th>
                                    <th>Ngày học</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.filter(booking => booking.status === 'upcoming').slice(0, 5).map(booking => (
                                    <tr key={booking.id}>
                                        <td>{booking.studentName}</td>
                                        <td>{booking.teacherName}</td>
                                        <td>{new Date(booking.date).toLocaleDateString('vi-VN')}</td>
                                        <td>{booking.time}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status}`}>
                                                {booking.status === 'upcoming' ? 'Sắp tới' :
                                                    booking.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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

    // Filter users based on search and role filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase());

        const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;

        return matchesSearch && matchesRole;
    });

    // Filter courses based on search and status filter
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
            course.teacherName.toLowerCase().includes(courseSearch.toLowerCase());

        const matchesStatus = courseStatusFilter === 'all' || course.status === courseStatusFilter;

        return matchesSearch && matchesStatus;
    });

    const renderUsers = () => (
        <div className="admin-users">
            <div className="section-header">
                <h2>Quản lý người dùng</h2>
                <div className="header-actions">
                    <button className="add-new-btn">
                        <i className="fas fa-plus"></i> Thêm người dùng mới
                    </button>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button
                    className={`filter-btn ${userRoleFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`filter-btn ${userRoleFilter === 'student' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('student')}
                >
                    Học viên
                </button>
                <button
                    className={`filter-btn ${userRoleFilter === 'teacher' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('teacher')}
                >
                    Giáo viên
                </button>
                <button
                    className={`filter-btn ${userRoleFilter === 'admin' ? 'active' : ''}`}
                    onClick={() => setUserRoleFilter('admin')}
                >
                    Quản trị viên
                </button>
            </div>

            <div className="table-container">
                {filteredUsers.length === 0 ? (
                    <div className="no-data">
                        <i className="fas fa-search"></i>
                        <p>Không tìm thấy người dùng nào phù hợp</p>
                        <button className="reset-filter" onClick={() => {
                            setUserSearch('');
                            setUserRoleFilter('all');
                        }}>
                            Đặt lại bộ lọc
                        </button>
                    </div>
                ) : (
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
                            {filteredUsers.map(user => (
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
                )}
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
                        <input
                            type="text"
                            placeholder="Tìm kiếm khóa học..."
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button
                    className={`filter-btn ${courseStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCourseStatusFilter('all')}
                >
                    Tất cả
                </button>
                <button
                    className={`filter-btn ${courseStatusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setCourseStatusFilter('active')}
                >
                    Đang diễn ra
                </button>
                <button
                    className={`filter-btn ${courseStatusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setCourseStatusFilter('pending')}
                >
                    Sắp diễn ra
                </button>
                <button
                    className={`filter-btn ${courseStatusFilter === 'ended' ? 'active' : ''}`}
                    onClick={() => setCourseStatusFilter('ended')}
                >
                    Đã kết thúc
                </button>
            </div>

            <div className="table-container">
                {filteredCourses.length === 0 ? (
                    <div className="no-data">
                        <i className="fas fa-search"></i>
                        <p>Không tìm thấy khóa học nào phù hợp</p>
                        <button className="reset-filter" onClick={() => {
                            setCourseSearch('');
                            setCourseStatusFilter('all');
                        }}>
                            Đặt lại bộ lọc
                        </button>
                    </div>
                ) : (
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
                            {filteredCourses.map(course => (
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
                )}
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
                <h2>Quản lý lịch học</h2>
                <div className="header-actions">
                    <button className="add-new-btn">
                        <i className="fas fa-plus"></i> Thêm buổi học mới
                    </button>
                    <div className="search-box">
                        <input type="text" placeholder="Tìm kiếm lịch học..." />
                        <i className="fas fa-search"></i>
                    </div>
                </div>
            </div>

            <div className="filters">
                <button className="filter-btn active">Tất cả</button>
                <button className="filter-btn">Sắp tới</button>
                <button className="filter-btn">Đã hoàn thành</button>
                <button className="filter-btn">Đã hủy</button>
            </div>

            <div className="table-container">
                {bookings.length === 0 ? (
                    <div className="no-data">
                        <i className="fas fa-calendar"></i>
                        <p>Chưa có lịch học nào được đặt</p>
                    </div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Học viên</th>
                                <th>Giáo viên</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id}>
                                    <td>{booking.id}</td>
                                    <td>{booking.studentName}</td>
                                    <td>{booking.teacherName}</td>
                                    <td>{booking.date}</td>
                                    <td>{booking.time}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'upcoming' ? 'Sắp tới' :
                                                booking.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
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
                )}
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
                        {/* Payment data will be fetched from the API */}
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

    // Pagination component
    const Pagination = ({ totalItems, currentPage, onPageChange }: { totalItems: number, currentPage: number, onPageChange: (page: number) => void }) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return (
            <div className="pagination">
                <div className="page-info">
                    Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems} mục
                </div>
                <div className="page-buttons">
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(1)}
                    >
                        &laquo;
                    </button>
                    <button
                        className="page-btn"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        &lsaquo;
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = currentPage;
                        if (currentPage > 2 && totalPages > 5) {
                            // Keep current page in the middle if possible
                            pageNum = Math.min(Math.max(currentPage - 2, 1), totalPages - 4);
                        } else {
                            pageNum = 1;
                        }
                        pageNum = pageNum + i;

                        return pageNum <= totalPages ? (
                            <button
                                key={pageNum}
                                className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                                onClick={() => onPageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        ) : null;
                    })}

                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        &rsaquo;
                    </button>
                    <button
                        className="page-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(totalPages)}
                    >
                        &raquo;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <div className="admin-logo">
                        English Hub Admin
                    </div>
                </div>

                <div className="admin-nav">
                    <a
                        href="#dashboard"
                        className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
                    >
                        {icons.dashboard}
                        Tổng quan
                    </a>
                    <a
                        href="#users"
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}
                    >
                        {icons.users}
                        Học viên
                    </a>
                    <a
                        href="#teachers"
                        className={`nav-link ${activeTab === 'teachers' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('teachers'); }}
                    >
                        {icons.teachers}
                        Giáo viên
                    </a>
                    <a
                        href="#courses"
                        className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('courses'); }}
                    >
                        {icons.courses}
                        Khóa học
                    </a>
                    <a
                        href="#payments"
                        className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('payments'); }}
                    >
                        {icons.payments}
                        Lịch học & Thanh toán
                    </a>
                    <a
                        href="#settings"
                        className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
                    >
                        {icons.settings}
                        Cài đặt
                    </a>
                </div>
            </div>

            <div className="admin-content">
                {loading ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>{error}</p>
                            <button className="btn-submit" onClick={fetchData}>Thử lại</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'teachers' && renderUsers()}
                        {activeTab === 'courses' && renderCourses()}
                        {activeTab === 'payments' && renderPayments()}
                        {activeTab === 'settings' && (
                            <div className="admin-container">
                                <div className="page-header">
                                    <h1 className="page-title">Cài đặt hệ thống</h1>
                                    <p className="page-description">Quản lý các cài đặt và tùy chỉnh cho hệ thống</p>
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <h2 className="card-title">Cài đặt trang web</h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="admin-form">
                                            <div className="form-group">
                                                <label className="form-label">Tiêu đề trang web</label>
                                                <input type="text" className="form-input" defaultValue="English Hub - Nền tảng kết nối giáo viên và học viên" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Mô tả trang web</label>
                                                <textarea className="form-textarea" defaultValue="Nền tảng kết nối giáo viên và học viên tiếng Anh hiệu quả nhất Việt Nam"></textarea>
                                            </div>
                                            <div className="form-buttons">
                                                <button className="btn-cancel">Hủy</button>
                                                <button className="btn-submit">Lưu thay đổi</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
