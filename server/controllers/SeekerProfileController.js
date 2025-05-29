const SeekerProfile = require('../models/SeekerProfile');

async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const result = await SeekerProfile.getSeekerProfileWithPagination(page, limit);
    res.json({ page, limit, totalPages: Math.ceil(result.total / limit), totalRecords: result.total, data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const item = await SeekerProfile.getSeekerProfileById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Seeker Profile not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    await SeekerProfile.createSeekerProfile(req.body);
    res.status(201).json({ message: 'Seeker Profile created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    await SeekerProfile.updateSeekerProfile(req.params.id, req.body);
    res.json({ message: 'Seeker Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await SeekerProfile.deleteSeekerProfile(req.params.id);
    res.json({ message: 'Seeker Profile deleted successfully' });
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
