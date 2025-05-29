const { poolConnect, pool, sql } = require('../config/db');

async function getAllSeekerProfiles() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [SeekerProfile]');
  return result.recordset;
}

async function getSeekerProfileWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [SeekerProfile] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [SeekerProfile];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getSeekerProfileById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [SeekerProfile] WHERE ID = @ID');
  return result.recordset[0];
}

async function createSeekerProfile(data) {
  await poolConnect;
  await pool.request()
    .input('fullName', data.fullName)
    .input('phoneNumber', data.phoneNumber || null)
    .input('emailContact', data.emailContact || null)
    .input('UserAccountID', data.UserAccountID)
    .query(`INSERT INTO [SeekerProfile] (fullName, phoneNumber, emailContact, UserAccountID) VALUES (@fullName, @phoneNumber, @emailContact, @UserAccountID)`);
}

async function updateSeekerProfile(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('fullName', data.fullName)
    .input('phoneNumber', data.phoneNumber || null)
    .input('emailContact', data.emailContact || null)
    .input('UserAccountID', data.UserAccountID)
    .query(`UPDATE [SeekerProfile] SET fullName = @fullName, phoneNumber = @phoneNumber, emailContact = @emailContact, UserAccountID = @UserAccountID WHERE ID = @ID`);
}

async function deleteSeekerProfile(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [SeekerProfile] WHERE ID = @ID');
}

module.exports = {
  getAllSeekerProfiles,
  getSeekerProfileWithPagination,
  getSeekerProfileById,
  createSeekerProfile,
  updateSeekerProfile,
  deleteSeekerProfile
};
