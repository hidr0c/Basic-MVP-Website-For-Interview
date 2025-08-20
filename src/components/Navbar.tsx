import React, { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
    brand: string;
    links: Array<{
        text: string;
        url: string;
        onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    }>;
    currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ brand, links, currentPage }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <a href="#home" className="navbar-brand">
                    {brand}
                </a>

                <button
                    className="navbar-toggle"
                    aria-label="Toggle navigation"
                    onClick={toggleMenu}
                >
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                    <span className="hamburger"></span>
                </button>

                <nav className={`navbar-menu ${isOpen ? 'open' : ''}`}>
                    <ul className="navbar-nav">
                        {links.map((link, index) => (
                            <li key={index} className="nav-item">
                                <a
                                    href={link.url}
                                    className={`nav-link ${currentPage === link.url.replace('#', '') ? 'active' : ''}`}
                                    onClick={(e) => {
                                        setIsOpen(false);
                                        if (link.onClick) {
                                            link.onClick(e);
                                        }
                                    }}
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
