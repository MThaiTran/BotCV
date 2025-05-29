import React, { useState }  from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import '../assets/css/Pages/HomePage.css';
import Button from '../components/Button';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    type: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchFilters.keyword) queryParams.append('keyword', searchFilters.keyword);
    if (searchFilters.location) queryParams.append('location', searchFilters.location);
    if (searchFilters.type) queryParams.append('type', searchFilters.type);
    
    navigate(`/jobs?${queryParams.toString()}`);
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <h1>Tạo CV xịn - Việc làm chất</h1>
            <p className="hero__subtitle">
              BotCV - Nền tảng tuyển dụng hàng đầu tại Việt Nam, kết nối ứng viên và doanh nghiệp uy tín, 
              với hàng nghìn việc làm mới mỗi ngày
            </p>
            <div className="hero__buttons">
              <Link to="/jobs" className="btn btn--primary">Tìm việc ngay</Link>
              <Link to="/profile/cv" className="btn btn--outline">Tạo CV</Link>
            </div>
          </div>
          <div className="hero__image">
            <img src="../../public/img/goc1.jpg" alt="BotCV Hero" />
          </div>
        </div>
      </section>

      <section className="job-search">
        <div className="container">
          <div className="job-search__form">
            <h2>Tìm việc phù hợp với bạn</h2>
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-form__group">
                <input 
                  type="text" 
                  name="keyword"
                  placeholder="Nhập từ khóa, vị trí, công ty..." 
                  className="search-form__input"
                  value={searchFilters.keyword}
                  onChange={handleInputChange}
                />
                
                <select 
                  name="location"
                  className="search-form__select"
                  value={searchFilters.location}
                  onChange={handleInputChange}
                >
                  <option value="">Tất cả địa điểm</option>
                  <option value="ha-noi">Hà Nội</option>
                  <option value="ho-chi-minh">Hồ Chí Minh</option>
                  <option value="da-nang">Đà Nẵng</option>
                </select>
                
                <select 
                  name="type"
                  className="search-form__select"
                  value={searchFilters.type}
                  onChange={handleInputChange}
                >
                  <option value="">Tất cả loại hình</option>
                  <option value="full-time">Toàn thời gian</option>
                  <option value="part-time">Bán thời gian</option>
                  <option value="remote">Làm từ xa</option>
                </select>
                
                <Button type="submit" variant="primary">Tìm kiếm</Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="container">
          <h2 className="section-title">Tại sao nên tìm việc làm tại BotCV?</h2>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <i className="feature-icon-job"></i>
              </div>
              <h3>Việc làm chất lượng</h3>
              <p>Hàng ngàn tin tuyển dụng chất lượng cao được cập nhật thường xuyên để đáp ứng nhu cầu tìm việc của ứng viên.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="feature-icon-cv"></i>
              </div>
              <h3>Công cụ viết CV đẹp miễn phí</h3>
              <p>Nhiều mẫu CV đẹp, phù hợp nhu cầu ứng tuyển các vị trí khác nhau. Dễ dàng chỉnh sửa và tạo CV online nhanh chóng.</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="feature-icon-support"></i>
              </div>
              <h3>Hỗ trợ người tìm việc</h3>
              <p>Nhà tuyển dụng chủ động tìm kiếm và liên hệ với bạn qua hệ thống kết nối ứng viên thông minh.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="job-categories">
        <div className="container">
          <h2 className="section-title">Khám phá việc làm theo ngành nghề</h2>
          <div className="categories">
            <Link to="/jobs?category=it" className="category-item">
              <h3>Công nghệ thông tin</h3>
              <span className="job-count">1,500+ việc làm</span>
            </Link>
            <Link to="/jobs?category=sales" className="category-item">
              <h3>Kinh doanh / Bán hàng</h3>
              <span className="job-count">1,200+ việc làm</span>
            </Link>
            <Link to="/jobs?category=marketing" className="category-item">
              <h3>Marketing / Truyền thông</h3>
              <span className="job-count">950+ việc làm</span>
            </Link>
            <Link to="/jobs?category=design" className="category-item">
              <h3>Design / Sáng tạo</h3>
              <span className="job-count">1,232+ việc làm</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
