const { poolConnect, pool, sql } = require('../config/db');

async function getAllCompanies() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [Company]');
  return result.recordset;
}

async function getCompanyWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [Company] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [Company];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getCompanyById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [Company] WHERE ID = @ID');
  return result.recordset[0];
}

async function createCompany(data) {
  await poolConnect;
  await pool.request()
    .input('name', data.name)
    .input('description', data.description || null)
    .input('establishmentDate', data.establishmentDate || null)
    .input('companyWebsite', data.companyWebsite || null)
    .input('companyEmail', data.companyEmail || null)
    .input('UserAccountID', data.UserAccountID)
    .query(`INSERT INTO [Company] (name, description, establishmentDate, companyWebsite, companyEmail, UserAccountID) VALUES (@name, @description, @establishmentDate, @companyWebsite, @companyEmail, @UserAccountID)`);
}

async function updateCompany(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('name', data.name)
    .input('description', data.description || null)
    .input('establishmentDate', data.establishmentDate || null)
    .input('companyWebsite', data.companyWebsite || null)
    .input('companyEmail', data.companyEmail || null)
    .input('UserAccountID', data.UserAccountID)
    .query(`UPDATE [Company] SET name = @name, description = @description, establishmentDate = @establishmentDate, companyWebsite = @companyWebsite, companyEmail = @companyEmail, UserAccountID = @UserAccountID WHERE ID = @ID`);
}

async function deleteCompany(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [Company] WHERE ID = @ID');
}

async function getCompanyCandidates(companyId) {
  await poolConnect;
  const result = await pool.request()
    .input('CompanyID', sql.Int, companyId)
    .query(`
      SELECT 
        aj.ID as appliedJobId,
        aj.appliedDate,
        j.ID as jobId,
        sp.*
      FROM Job j
      INNER JOIN AppliedJob aj ON j.ID = aj.JobID
      INNER JOIN SeekerProfile sp ON aj.SeekerProfileID = sp.ID
      WHERE j.CompanyID = @CompanyID
    `);
  return result.recordset;
}

async function getCompanyJobs(companyId) {
  await poolConnect;
  const result = await pool.request()
    .input('CompanyID', sql.Int, companyId)
    .query(`
      SELECT 
        j.*,
        c.name as CompanyName

      FROM Job j
      INNER JOIN Company c ON j.CompanyID = c.ID
      WHERE j.CompanyID = @CompanyID
    `);
  return result.recordset;
}

async function getCompanyAppliedJobs(companyId) {
  await poolConnect;
  
  const result = await pool.request()
    .input('CompanyID', sql.Int, companyId)
    .query(`
      SELECT 
        aj.ID,
        aj.appliedDate,
        j.ID as jobId
      FROM AppliedJob aj
      INNER JOIN Job j ON aj.JobID = j.ID
      WHERE j.CompanyID = @CompanyID
    `);

  return result.recordset;
}

module.exports = {
  getAllCompanies,
  getCompanyWithPagination,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyCandidates,
  getCompanyJobs,
  getCompanyAppliedJobs
};
