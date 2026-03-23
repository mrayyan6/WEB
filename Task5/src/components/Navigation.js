import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={isActive('/about')}>
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className={isActive('/contact')}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
