const JobCategory = require('../models/JobCategory');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await JobCategory.getJobCategoryWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await JobCategory.getJobCategoryById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Job Category not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await JobCategory.createJobCategory(req.body);
    res.status(201).json({ message: 'Job Category created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await JobCategory.updateJobCategory(req.params.id, req.body);
    res.json({ message: 'Job Category updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await JobCategory.deleteJobCategory(req.params.id);
    res.json({ message: 'Job Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
}; 