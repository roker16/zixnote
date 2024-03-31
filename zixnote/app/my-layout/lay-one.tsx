"use client"
import React, { useState, useEffect } from 'react';
import './StickyHeader.css'; // Import your CSS file for styling

const StickyHeader = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 240) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`sticky-header ${isSticky ? 'sticky' : ''}`}>
      <div className="content">
        <h1 className={isSticky ? 'sticky-text' : ''}>Sticky Header</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default StickyHeader;
