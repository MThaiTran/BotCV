// src/pages/Admin/CompanyManagementPage.jsx
import React, { useState, useEffect } from 'react';
import '../../assets/css/Pages/Admin/CompanyManagementPage.css';
import { adminService } from '../../services/adminService';

const CompanyManagementPage = () => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    contactEmail: '',
    description: '',
    establishmentDate: ''
  });
  const [editCompany, setEditCompany] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    contactEmail: '',
    description: '',
    establishmentDate: '',
    id: null
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllCompanies();

      // Ánh xạ dữ liệu từ cấu trúc API (Backend) sang cấu trúc Frontend mong muốn
      const companiesWithMappedFields = data.map(company => ({
        ...company, // Giữ lại tất cả các thuộc tính gốc từ API
        id: company.ID || company.id, // Ánh xạ ID từ API (ID hoa hoặc id thường)
        // Ánh xạ các trường cho các cột hiển thị:
        name: company.name || company.companyName || 'N/A', // Ánh xạ tên công ty
        industry: company.industry || company.sector || 'N/A', // Ánh xạ lĩnh vực (giả định industry hoặc sector)
        location: company.location || company.address || 'N/A', // Ánh xạ địa điểm (giả định location hoặc address)
        status: company.status || company.companyStatus || 'unknown', // Ánh xạ trạng thái (giả định status hoặc companyStatus)
        // Thêm các ánh xạ khác nếu cần cho các trường khác được sử dụng trên giao diện (ví dụ: website, email liên hệ, v.v.)
        website: company.website || company.companyWebsite || '',
        contactEmail: company.contactEmail || company.companyEmail || '',
        description: company.description || '',
        establishmentDate: company.establishmentDate || null,
        UserAccountID: company.UserAccountID || null, // Giữ lại UserAccountID nếu có
      }));

      setCompanies(companiesWithMappedFields); // Set state với dữ liệu đã ánh xạ

    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]); // Đảm bảo state là mảng rỗng khi lỗi
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newCompany.name.trim()) errors.name = 'Tên công ty không được để trống';
    if (!newCompany.industry.trim()) errors.industry = 'Lĩnh vực không được để trống';
    if (!newCompany.location.trim()) errors.location = 'Địa điểm không được để trống';
    if (newCompany.contactEmail && !/\S+@\S+\.\S+/.test(newCompany.contactEmail)) errors.contactEmail = 'Email không hợp lệ';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Tạo object dữ liệu để gửi đến API, ánh xạ tên trường và thêm UserAccountID
      const companyDataForApi = {
        name: newCompany.name,
        description: newCompany.description,
        companyWebsite: newCompany.website,
        companyEmail: newCompany.contactEmail,
        establishmentDate: newCompany.establishmentDate ? newCompany.establishmentDate : null,
        UserAccountID: 1 // <-- Vẫn cần thay đổi giá trị 1 này sau
      };

      const createdCompanyResponseData = await adminService.createCompany(companyDataForApi); // Lấy response.data

      // Kiểm tra dữ liệu trả về. Nếu thành công (backend trả về object hoặc message),
      // đóng modal, reset form, thông báo và fetch lại danh sách.
      if (createdCompanyResponseData) {
        // Có thể kiểm tra specific message hoặc ID nếu muốn chính xác hơn,
        // nhưng tạm thời kiểm tra có dữ liệu trả về là coi như thành công.

        alert('Công ty đã được tạo thành công!'); // Thông báo thành công
        setShowAddModal(false); // Đóng modal
        setNewCompany({ name: '', industry: '', location: '', website: '', contactEmail: '', description: '', establishmentDate: '' }); // Reset form
        setFormErrors({});

        // Fetch lại toàn bộ danh sách công ty để cập nhật bảng
        fetchCompanies();

      } else {
         // Xử lý trường hợp responseData không hợp lệ (ví dụ: null, undefined)
         throw new Error(createdCompanyResponseData?.message || 'Không nhận được phản hồi thành công từ server sau khi tạo công ty.');
      }

    } catch (error) {
      console.error('Error creating company:', error);
      setFormErrors({ general: error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo công ty' });
      // Không đóng modal để người dùng thấy lỗi
    }
  };

  const handleEditCompany = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editCompany.name.trim()) errors.name = 'Tên công ty không được để trống';
    if (!editCompany.industry.trim()) errors.industry = 'Lĩnh vực không được để trống';
    if (!editCompany.location.trim()) errors.location = 'Địa điểm không được để trống';
    if (editCompany.contactEmail && !/\S+@\S+\.\S+/.test(editCompany.contactEmail)) errors.contactEmail = 'Email không hợp lệ';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Tạo object dữ liệu để gửi đến API, ánh xạ tên trường
      const companyDataForApi = {
        name: editCompany.name,
        description: editCompany.description,
        companyWebsite: editCompany.website,
        companyEmail: editCompany.contactEmail,
        // establishmentDate có thể cần định dạng lại tùy theo yêu cầu API PUT
        establishmentDate: editCompany.establishmentDate ? editCompany.establishmentDate : null,
        // API cập nhật thường không cần UserAccountID
        // UserAccountID: editCompany.UserAccountID // Có thể bỏ qua nếu API không yêu cầu
      };

      const updatedCompany = await adminService.updateCompany(editCompany.id, companyDataForApi); // Gửi object đã ánh xạ
      setCompanies(companies.map(c => c.id === editCompany.id ? updatedCompany : c));
      setShowEditModal(false);
      setEditCompany(null);
      setFormErrors({});
    } catch (error) {
      console.error('Error updating company:', error);
      setFormErrors({ general: 'Có lỗi xảy ra khi cập nhật công ty' });
    }
  };

  const handleDeleteCompany = async () => {
    try {
      await adminService.deleteCompany(selectedCompany.id);
      setCompanies(companies.filter(c => c.id !== selectedCompany.id));
      setShowDeleteModal(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const handleApproveCompany = async (companyId) => {
    try {
      await adminService.updateCompanyStatus(companyId, 'approved');
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: 'approved' } : c));
    } catch (error) {
      console.error('Error approving company:', error);
    }
  };

  const openDeleteModal = (company) => {
    setSelectedCompany({ ...company, id: company.ID });
    setShowDeleteModal(true);
  };

  const openEditModal = (company) => {
    setEditCompany({
      ...company,
      id: company.ID,
      establishmentDate: company.establishmentDate ? company.establishmentDate.split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = (company.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (currentFilter === 'all') return matchesSearch;
    return matchesSearch && company.status === currentFilter;
  });

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditCompany({ ...editCompany, [name]: value });
    } else {
      setNewCompany({ ...newCompany, [name]: value });
    }
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  return (
    <div className="company-management-page">
      <div className="page-header">
        <h1>Quản lý công ty</h1>
        <button className="add-company-btn" onClick={() => setShowAddModal(true)}>Thêm công ty mới</button>
      </div>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Tìm kiếm công ty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button className={currentFilter === 'all' ? 'active' : ''} onClick={() => setCurrentFilter('all')}>Tất cả</button>
          <button className={currentFilter === 'pending' ? 'active' : ''} onClick={() => setCurrentFilter('pending')}>Chờ duyệt</button>
          <button className={currentFilter === 'approved' ? 'active' : ''} onClick={() => setCurrentFilter('approved')}>Đã duyệt</button>
        </div>
      </div>

      {isLoading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <table className="companies-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên công ty</th>
              <th>Email liên hệ</th>
              <th>Website</th>
              <th>Ngày thành lập</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map(company => (
              <tr key={company.id}>
                <td>{company.id}</td>
                <td>{company.name}</td>
                <td>{company.contactEmail || 'N/A'}</td>
                <td>{company.website || 'N/A'}</td>
                <td>{company.establishmentDate ? new Date(company.establishmentDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button onClick={() => openEditModal(company)}>Sửa</button>
                  {company.status === 'pending' && <button onClick={() => handleApproveCompany(company.id)}>Duyệt</button>}
                  <button onClick={() => openDeleteModal(company)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="modal">
          {formErrors.general && (
            <div className="general-error">{formErrors.general}</div>
          )}
          <form onSubmit={handleAddCompany}>
            <h2>Thêm công ty mới</h2>
            <div className="form-group">
              <label htmlFor="name">Tên công ty</label>
              <input
                id="name"
                name="name"
                value={newCompany.name}
                onChange={(e) => handleInputChange(e)}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="industry">Lĩnh vực</label>
              <input
                id="industry"
                name="industry"
                value={newCompany.industry}
                onChange={(e) => handleInputChange(e)}
                className={formErrors.industry ? 'error' : ''}
              />
              {formErrors.industry && <div className="error-message">{formErrors.industry}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="location">Địa điểm</label>
              <input
                id="location"
                name="location"
                value={newCompany.location}
                onChange={(e) => handleInputChange(e)}
                className={formErrors.location ? 'error' : ''}
              />
              {formErrors.location && <div className="error-message">{formErrors.location}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                value={newCompany.website}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Email liên hệ</label>
              <input
                id="contactEmail"
                name="contactEmail"
                value={newCompany.contactEmail}
                onChange={(e) => handleInputChange(e)}
                className={formErrors.contactEmail ? 'error' : ''}
              />
              {formErrors.contactEmail && <div className="error-message">{formErrors.contactEmail}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                value={newCompany.description}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="establishmentDate">Ngày thành lập</label>
              <input
                type="date"
                id="establishmentDate"
                name="establishmentDate"
                value={newCompany.establishmentDate}
                onChange={(e) => handleInputChange(e)}
              />
            </div>
            <div className="button-group">
              <button type="button" className="secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button type="submit" className="primary">Thêm</button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Company Modal */}
      {showEditModal && editCompany && (
        <div className="modal">
          {formErrors.general && (
            <div className="general-error">{formErrors.general}</div>
          )}
          <form onSubmit={handleEditCompany}>
            <h2>Chỉnh sửa công ty</h2>
            <div className="form-group">
              <label htmlFor="edit-name">Tên công ty</label>
              <input
                id="edit-name"
                name="name"
                value={editCompany.name}
                onChange={(e) => handleInputChange(e, true)}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="edit-industry">Lĩnh vực</label>
              <input
                id="edit-industry"
                name="industry"
                value={editCompany.industry}
                onChange={(e) => handleInputChange(e, true)}
                className={formErrors.industry ? 'error' : ''}
              />
              {formErrors.industry && <div className="error-message">{formErrors.industry}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="edit-location">Địa điểm</label>
              <input
                id="edit-location"
                name="location"
                value={editCompany.location}
                onChange={(e) => handleInputChange(e, true)}
                className={formErrors.location ? 'error' : ''}
              />
              {formErrors.location && <div className="error-message">{formErrors.location}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="edit-website">Website</label>
              <input
                id="edit-website"
                name="website"
                value={editCompany.website}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-contactEmail">Email liên hệ</label>
              <input
                id="edit-contactEmail"
                name="contactEmail"
                value={editCompany.contactEmail}
                onChange={(e) => handleInputChange(e, true)}
                className={formErrors.contactEmail ? 'error' : ''}
              />
              {formErrors.contactEmail && <div className="error-message">{formErrors.contactEmail}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="edit-description">Mô tả</label>
              <textarea
                id="edit-description"
                name="description"
                value={editCompany.description}
                onChange={(e) => handleInputChange(e, true)}
              />
            </div>
            <div className="button-group">
              <button type="button" className="secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
              <button type="submit" className="primary">Lưu thay đổi</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCompany && (
        <div className="modal">
          <div className="modal-content delete-modal">
            <h2>Xác nhận xóa công ty</h2>
            <p>Bạn có chắc chắn muốn xóa công ty <strong>"{selectedCompany.name}"</strong>?</p>
            <p className="warning-text">Hành động này không thể hoàn tác.</p>
            <div className="button-group">
              <button className="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</button>
              <button className="danger" onClick={handleDeleteCompany}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagementPage;
