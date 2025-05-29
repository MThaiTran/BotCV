const { poolConnect, pool, sql } = require('../config/db');

async function getAllJobLocations() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [JobLocation]');
  return result.recordset;
}

async function getJobLocationWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [JobLocation] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [JobLocation];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getJobLocationById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [JobLocation] WHERE ID = @ID');
  return result.recordset[0];
}

async function createJobLocation(data) {
  await poolConnect;
  await pool.request()
    .input('location', data.location)
    .input('JobID', data.JobID)
    .query(`INSERT INTO [JobLocation] (location, JobID) VALUES (@location, @JobID)`);
}

async function updateJobLocation(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('location', data.location)
    .input('JobID', data.JobID)
    .query(`UPDATE [JobLocation] SET location = @location, JobID = @JobID WHERE ID = @ID`);
}

async function deleteJobLocation(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [JobLocation] WHERE ID = @ID');
}

module.exports = {
  getAllJobLocations,
  getJobLocationWithPagination,
  getJobLocationById,
  createJobLocation,
  updateJobLocation,
  deleteJobLocation
}; 