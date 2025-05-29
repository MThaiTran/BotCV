const { poolConnect, pool, sql } = require('../config/db');

async function getAllJobs() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Job]');
  return result.recordset;
}

async function getJobWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Job] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Job];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getJobById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Job] WHERE ID = @ID');
  return result.recordset[0];
}

async function createJob(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .input('jobExperience', data.jobExperience || null)
    .input('salaryRange', data.salaryRange || null)
    .input('expirationDate', data.expirationDate || null)
    .input('jobDescription', data.jobDescription || null)
    .input('jobLevel', data.jobLevel || null)
    .input('jobEducation', data.jobEducation || null)
    .input('jobFromWork', data.jobFromWork || null)
    .input('jobHireNumber', data.jobHireNumber || null)
    .input('CompanyID', data.CompanyID)
    .query(`INSERT INTO [Job] (name, jobExperience, salaryRange, expirationDate, jobDescription, jobLevel, jobEducation, jobFromWork, jobHireNumber, CompanyID) VALUES (@name, @jobExperience, @salaryRange, @expirationDate, @jobDescription, @jobLevel, @jobEducation, @jobFromWork, @jobHireNumber, @CompanyID)`);
}

async function updateJob(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .input('jobExperience', data.jobExperience || null)
    .input('salaryRange', data.salaryRange || null)
    .input('expirationDate', data.expirationDate || null)
    .input('jobDescription', data.jobDescription || null)
    .input('jobLevel', data.jobLevel || null)
    .input('jobEducation', data.jobEducation || null)
    .input('jobFromWork', data.jobFromWork || null)
    .input('jobHireNumber', data.jobHireNumber || null)
    .input('CompanyID', data.CompanyID)
    .query(`UPDATE [Job] SET name = @name, jobExperience = @jobExperience, salaryRange = @salaryRange, expirationDate = @expirationDate, jobDescription = @jobDescription, jobLevel = @jobLevel, jobEducation = @jobEducation, jobFromWork = @jobFromWork, jobHireNumber = @jobHireNumber, CompanyID = @CompanyID WHERE ID = @ID`);
}

async function deleteJob(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Job] WHERE ID = @ID');
}

module.exports = {
  getAllJobs,
  getJobWithPagination,
  getJobById,
  createJob,
  updateJob,
  deleteJob
}; 