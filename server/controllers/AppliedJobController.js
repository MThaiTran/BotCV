const AppliedJob = require('../models/AppliedJob');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await AppliedJob.getAppliedJobWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await AppliedJob.getAppliedJobById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Applied Job not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await AppliedJob.createAppliedJob(req.body);
    res.status(201).json({ message: 'Applied Job created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await AppliedJob.updateAppliedJob(req.params.id, req.body);
    res.json({ message: 'Applied Job updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await AppliedJob.deleteAppliedJob(req.params.id);
    res.json({ message: 'Applied Job deleted successfully' });
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