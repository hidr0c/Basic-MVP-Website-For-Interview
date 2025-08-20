import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicePage from './pages/ServicePage'
import ContactPage from './pages/ContactPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Navbar links configuration
  const navLinks = [
    { text: 'Trang chủ', url: '#home' },
    { text: 'Giáo viên', url: '#about' },
    { text: 'Khóa học', url: '#services' },
    { text: 'Liên hệ', url: '#contact' }
  ]

  // Handle navigation
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    if (href) {
      const page = href.replace('#', '')
      setCurrentPage(page)
      window.history.pushState({}, '', href)
    }
  }

  // Check hash on load
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const page = hash.replace('#', '')
      setCurrentPage(page)
    }

    // Handle browser back/forward
    const handleHashChange = () => {
      const hash = window.location.hash || '#home'
      const page = hash.replace('#', '')
      setCurrentPage(page)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Render the current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'about':
        return <AboutPage />
      case 'services':
        return <ServicePage />
      case 'contact':
        return <ContactPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="app">
      <Navbar
        brand="EnglishOne"
        links={navLinks.map(link => ({
          ...link,
          onClick: handleNavigation
        }))}
        currentPage={currentPage}
      />
      <main className="content">
        {renderPage()}
      </main>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} EnglishOne - Nền tảng học tiếng Anh 1-1 hàng đầu Việt Nam
        </div>
      </footer>
    </div>
  )
}

export default App
