// src/pages/Admin/AdminUserManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import '../../assets/css/Pages/Admin/AdminUserManagementPage.css';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    profileImage: '',
    registrationDate: ''
  });
  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    status: '',
    company: {
      name: '',
      address: '',
      website: '',
      industry: '',
      description: ''
    }
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllUsers();

      // Log dữ liệu thô để kiểm tra cấu trúc API
      console.log('Raw Users Data:', data);

      // Ánh xạ dữ liệu từ cấu trúc API sang cấu trúc frontend mong muốn
      const mappedUsers = data.map(user => ({
        id: user.ID || user.id, // Ánh xạ ID từ API (hỗ trợ cả ID và id)
        name: user.fullName || user.name || user.email || 'N/A', // Ánh xạ tên (ưu tiên fullName, sau đó name, cuối cùng email nếu không có tên nào)
        email: user.email || 'N/A', // Ánh xạ email
        role: user.userType === 'Employer' ? 'employer' : 'candidate', // Ánh xạ userType sang role
        createdAt: user.registrationDate || user.createdAt || 'N/A', // Ánh xạ ngày đăng ký (hỗ trợ registrationDate và createdAt)
        status: user.status || 'unknown', // Ánh xạ trạng thái (mặc định 'unknown' nếu không có)
        // Giữ lại các thuộc tính khác nếu có và cần dùng
        ...user
      }));

      setUsers(mappedUsers);

    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await adminService.updateUserStatus(userId, newStatus);
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newUser.name.trim()) errors.name = 'Tên không được để trống';
    if (!newUser.email.trim()) errors.email = 'Email không được để trống';
    if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Email không hợp lệ';
    if (!newUser.password) errors.password = 'Mật khẩu không được để trống';
    if (newUser.password.length < 6) errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userDataForApi = {
      email: newUser.email,
      password: newUser.password,
      profileImage: newUser.profileImage,
      userType: newUser.role === 'employer' ? 'Employer' : 'Seeker',
      registrationDate: newUser.registrationDate ? newUser.registrationDate.split('T')[0] : new Date().toISOString().split('T')[0]
    };

    try {
      const createdUser = await adminService.createUser(userDataForApi);
      setUsers([...users, createdUser]);
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'candidate',
        profileImage: '',
        registrationDate: ''
      });
      setFormErrors({});
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setFormErrors({ general: error.response.data.message });
      } else {
        setFormErrors({ general: 'Có lỗi xảy ra khi tạo người dùng' });
      }
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editUser.name.trim()) errors.name = 'Tên không được để trống';
    if (!editUser.email.trim()) errors.email = 'Email không được để trống';
    if (!/\S+@\S+\.\S+/.test(editUser.email)) errors.email = 'Email không hợp lệ';
    if (editUser.role === 'employer') {
      if (!editUser.company.name.trim()) errors['company.name'] = 'Tên công ty không được để trống';
      if (!editUser.company.address.trim()) errors['company.address'] = 'Địa chỉ không được để trống';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const updatedUser = await adminService.updateUser(editUser.id, editUser);
      setUsers(users.map(user => user.id === editUser.id ? updatedUser : user));
      setShowEditModal(false);
      setFormErrors({});
    } catch (error) {
      console.error('Error updating user:', error);
      setFormErrors({ general: 'Có lỗi xảy ra khi cập nhật người dùng' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setEditUser({
        ...editUser,
        company: {
          ...editUser.company,
          [companyField]: value
        }
      });
    } else {
      setEditUser({
        ...editUser,
        [name]: value
      });
    }
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser({ ...user, id: user.ID });
    setShowDeleteModal(true);
  };

  const openEditModal = (user) => {
    const userWithCompany = {
      ...user,
      id: user.ID,
      name: user.fullName || user.name || '',
      company: user.company || {
        name: '',
        address: '',
        website: '',
        industry: '',
        description: ''
      }
    };
    setEditUser(userWithCompany);
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (currentFilter === 'all') return matchesSearch;
    return matchesSearch && user.status === currentFilter;
  });

  return (
    <div className="admin-user-management">
      <div className="page-header">
        <h1>Quản lý tài khoản người dùng</h1>
        <button
          className="add-user-btn"
          onClick={() => setShowAddModal(true)}
        >
          Thêm người dùng
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('active')}
          >
            Đang hoạt động
          </button>
          <button
            className={`filter-btn ${currentFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('suspended')}
          >
            Đã khóa
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Đang tải dữ liệu...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Loại tài khoản</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                    </span>
                  </td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => openEditModal(user)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className={`status-toggle-btn ${user.status === 'active' ? 'suspend' : 'activate'}`}
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(user)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Xác nhận xóa tài khoản</h2>
            <p>Bạn có chắc chắn muốn xóa tài khoản của <strong>{selectedUser?.name}</strong>?</p>
            <p className="warning-text">Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container add-user-modal">
            <h2>Thêm người dùng mới</h2>
            {formErrors.general && (
              <div className="error-message general-error">{formErrors.general}</div>
            )}
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label htmlFor="name">Họ tên</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className={formErrors.name ? 'error' : ''}
                />
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? 'error' : ''}
                />
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className={formErrors.password ? 'error' : ''}
                />
                {formErrors.password && <div className="error-message">{formErrors.password}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="role">Loại tài khoản</label>
                <select
                  id="role"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="candidate">Ứng viên</option>
                  <option value="employer">Nhà tuyển dụng</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="profileImage">Ảnh Profile</label>
                <input
                  type="text"
                  id="profileImage"
                  name="profileImage"
                  value={newUser.profileImage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="registrationDate">Ngày đăng ký</label>
                <input
                  type="datetime-local"
                  id="registrationDate"
                  name="registrationDate"
                  value={newUser.registrationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormErrors({});
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="confirm-btn"
                >
                  Thêm người dùng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container edit-user-modal">
            <h2>Chỉnh sửa thông tin người dùng</h2>
            {formErrors.general && (
              <div className="error-message general-error">{formErrors.general}</div>
            )}
            <form onSubmit={handleEditUser}>
              <div className="form-section">
                <h3>Thông tin cơ bản</h3>
                <div className="form-group">
                  <label htmlFor="edit-name">Họ tên</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editUser.name}
                    onChange={handleEditInputChange}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditInputChange}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role">Loại tài khoản</label>
                  <select
                    id="edit-role"
                    name="role"
                    value={editUser.role}
                    onChange={handleEditInputChange}
                  >
                    <option value="candidate">Ứng viên</option>
                    <option value="employer">Nhà tuyển dụng</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-status">Trạng thái</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={editUser.status}
                    onChange={handleEditInputChange}
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="suspended">Đã khóa</option>
                  </select>
                </div>
              </div>
              {/* Company information section - only show for employers */}
              {editUser.role === 'employer' && (
                <div className="form-section">
                  <h3>Thông tin công ty</h3>
                  <div className="form-group">
                    <label htmlFor="company-name">Tên công ty</label>
                    <input
                      type="text"
                      id="company-name"
                      name="company.name"
                      value={editUser.company.name}
                      onChange={handleEditInputChange}
                      className={formErrors['company.name'] ? 'error' : ''}
                    />
                    {formErrors['company.name'] && <div className="error-message">{formErrors['company.name']}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="company-address">Địa chỉ</label>
                    <input
                      type="text"
                      id="company-address"
                      name="company.address"
                      value={editUser.company.address}
                      onChange={handleEditInputChange}
                      className={formErrors['company.address'] ? 'error' : ''}
                    />
                    {formErrors['company.address'] && <div className="error-message">{formErrors['company.address']}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="company-website">Website</label>
                    <input
                      type="text"
                      id="company-website"
                      name="company.website"
                      value={editUser.company.website}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company-industry">Ngành nghề</label>
                    <input
                      type="text"
                      id="company-industry"
                      name="company.industry"
                      value={editUser.company.industry}
                      onChange={handleEditInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company-description">Mô tả công ty</label>
                    <textarea
                      id="company-description"
                      name="company.description"
                      value={editUser.company.description}
                      onChange={handleEditInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setFormErrors({});
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="confirm-btn"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
