const { poolConnect, pool, sql } = require('../config/db');

async function getAllWishlistJobs() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [WishlistJob]');
  return result.recordset;
}

async function getWishlistJobWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [WishlistJob] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [WishlistJob];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getWishlistJobById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [WishlistJob] WHERE ID = @ID');
  return result.recordset[0];
}

async function createWishlistJob(data) {
  await poolConnect;
  await pool.request()
    .input('addedDate', data.addedDate)
    .input('SeekerProfileID', data.SeekerProfileID)
    .input('JobID', data.JobID)
    .query(`INSERT INTO [WishlistJob] (addedDate, SeekerProfileID, JobID) VALUES (@addedDate, @SeekerProfileID, @JobID)`);
}

async function updateWishlistJob(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('addedDate', data.addedDate)
    .input('SeekerProfileID', data.SeekerProfileID)
    .input('JobID', data.JobID)
    .query(`UPDATE [WishlistJob] SET addedDate = @addedDate, SeekerProfileID = @SeekerProfileID, JobID = @JobID WHERE ID = @ID`);
}

async function deleteWishlistJob(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [WishlistJob] WHERE ID = @ID');
}

module.exports = {
  getAllWishlistJobs,
  getWishlistJobWithPagination,
  getWishlistJobById,
  createWishlistJob,
  updateWishlistJob,
  deleteWishlistJob
}; 