import React from 'react';
import Logo from '../assets/img/saflog_logo.png';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="Nav_wrap">
      <NavLink className="logo" to="/upload">
        <img src={Logo} alt="Logo" />
      </NavLink>

      <div className="nav_items">
        <NavLink to="/upload">동영상 업로드</NavLink>
        <NavLink to="/register">얼굴 등록</NavLink>
        <NavLink to="/generate">동영상 생성</NavLink>
        <NavLink to="/review">동영상 검수</NavLink>
        <NavLink to="/download">다운로드</NavLink>
      </div>
    </nav>
  );
};

export default Nav;