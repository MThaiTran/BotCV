const Company = require('../models/Company');
const AppliedJob = require('../models/AppliedJob');
const SeekerProfile = require('../models/SeekerProfile');
const Job = require('../models/Job');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await Company.getCompanyWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await Company.getCompanyById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Company not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await Company.createCompany(req.body);
    res.status(201).json({ message: 'Company created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await Company.updateCompany(req.params.id, req.body);
    res.json({ message: 'Company updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await Company.deleteCompany(req.params.id);
    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCompanyCandidates(req, res) {
  try {
    const companyId = req.params.id;
    const candidates = await Company.getCompanyCandidates(companyId);
    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ứng viên',
      error: error.message
    });
  }
}

async function getCompanyJobs(req, res) {
  try {
    const companyId = req.params.id;
    const jobs = await Company.getCompanyJobs(companyId);
    res.status(200).json({
      success: true,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách công việc',
      error: error.message
    });
  }
}

async function getCompanyAppliedJobs(req, res) {
  try {
    const companyId = req.params.id;
    const appliedJobs = await Company.getCompanyAppliedJobs(companyId);
    res.status(200).json({
      success: true,
      data: appliedJobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ứng tuyển',
      error: error.message
    });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getCompanyCandidates,
  getCompanyJobs,
  getCompanyAppliedJobs
};
