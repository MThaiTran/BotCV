const { poolConnect, pool, sql } = require('../config/db');

async function getAllCVs() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [CV]');
  return result.recordset;
}

async function getCVWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [CV] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [CV];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getCVById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [CV] WHERE ID = @ID');
  return result.recordset[0];
}

async function createCV(data) {
  await poolConnect;
  await pool.request()
    .input('CVFilePath', data.CVFilePath)
    .input('SeekerProfileID', data.SeekerProfileID)
    .query(`INSERT INTO [CV] (CVFilePath, SeekerProfileID) VALUES (@CVFilePath, @SeekerProfileID)`);
}

async function updateCV(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('CVFilePath', data.CVFilePath)
    .input('SeekerProfileID', data.SeekerProfileID)
    .query(`UPDATE [CV] SET CVFilePath = @CVFilePath, SeekerProfileID = @SeekerProfileID WHERE ID = @ID`);
}

async function deleteCV(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [CV] WHERE ID = @ID');
}

module.exports = {
  getAllCVs,
  getCVWithPagination,
  getCVById,
  createCV,
  updateCV,
  deleteCV
}; 