import React from 'react';
import './Header.css';
import PersonIcon from '@mui/icons-material/Person';

const Header = () => {
  return (
    <div className="header">
      <div className="header-title">Doctor's Dashboard</div>
      <div className="header-user">
        <span className="header-greeting">Hello DC</span>
        <div className="header-logo">
          <PersonIcon className="logo-icon" />
        </div>
      </div>
    </div>
  );
};

export default Header;
