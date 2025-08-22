import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TeacherDetailPage from './pages/TeacherDetailPage';
import TeachersPage from './pages/TeachersPage';
import EnrolledCoursesPage from './pages/EnrolledCoursesPage';
import CourseRegistrationPage from './pages/CourseRegistrationPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/:id" element={<TeacherDetailPage />} />
          <Route path="/enrolled-courses" element={<EnrolledCoursesPage />} />
          <Route path="/course-registration" element={<CourseRegistrationPage />} />
          <Route path="/admin-dashboard" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} EnglishHub - Nền tảng học tiếng Anh 1-1 hàng đầu Việt Nam
        </div>
      </footer>
    </div>
  );
}

export default App;
