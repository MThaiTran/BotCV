const { poolConnect, pool, sql } = require('../config/db');

async function getAllAppliedJobs() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [AppliedJob]');
  return result.recordset;
}

async function getAppliedJobWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [AppliedJob] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [AppliedJob];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getAppliedJobById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [AppliedJob] WHERE ID = @ID');
  return result.recordset[0];
}

async function createAppliedJob(data) {
  await poolConnect;
  await pool.request()
    .input('appliedDate', data.appliedDate)
    .input('SeekerProfileID', data.SeekerProfileID)
    .input('JobID', data.JobID)
    .query(`INSERT INTO [AppliedJob] (appliedDate, SeekerProfileID, JobID) VALUES (@appliedDate, @SeekerProfileID, @JobID)`);
}

async function updateAppliedJob(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('appliedDate', data.appliedDate)
    .input('SeekerProfileID', data.SeekerProfileID)
    .input('JobID', data.JobID)
    .query(`UPDATE [AppliedJob] SET appliedDate = @appliedDate, SeekerProfileID = @SeekerProfileID, JobID = @JobID WHERE ID = @ID`);
}

async function deleteAppliedJob(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [AppliedJob] WHERE ID = @ID');
}

module.exports = {
  getAllAppliedJobs,
  getAppliedJobWithPagination,
  getAppliedJobById,
  createAppliedJob,
  updateAppliedJob,
  deleteAppliedJob
}; 