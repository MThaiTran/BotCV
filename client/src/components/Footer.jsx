// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Components/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__column">
            <h3>Về BotCV</h3>
            <ul>
              <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
              <li><Link to="/lien-he">Liên hệ</Link></li>
              <li><Link to="/dieu-khoan">Điều khoản dịch vụ</Link></li>
              <li><Link to="/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Dành cho ứng viên</h3>
            <ul>
              <li><Link to="/tim-viec-lam">Tìm việc làm</Link></li>
              <li><Link to="/cv">Tạo CV</Link></li>
              <li><Link to="/bai-viet-huong-dan">Hướng dẫn viết CV</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Dành cho nhà tuyển dụng</h3>
            <ul>
              <li><Link to="/dang-tin-tuyen-dung">Đăng tin tuyển dụng</Link></li>
              <li><Link to="/tim-ho-so">Tìm hồ sơ</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h3>Kết nối với chúng tôi</h3>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()}. BotCV Vietnam JSC. All Rights Reserved.</p>
          <p>BotCV - Hệ sinh thái nhân sự tiên phong ứng dụng công nghệ tại Việt Nam</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
