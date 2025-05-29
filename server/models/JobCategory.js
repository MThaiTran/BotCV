const { poolConnect, pool, sql } = require('../config/db');

async function getAllJobCategories() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [JobCategory]');
  return result.recordset;
}

async function getJobCategoryWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [JobCategory] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [JobCategory];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getJobCategoryById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [JobCategory] WHERE ID = @ID');
  return result.recordset[0];
}

async function createJobCategory(data) {
  await poolConnect;
  await pool.request()
    .input('categoryName', data.categoryName)
    .input('description', data.description || null)
    .query(`INSERT INTO [JobCategory] (categoryName, description) VALUES (@categoryName, @description)`);
}

async function updateJobCategory(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('categoryName', data.categoryName)
    .input('description', data.description || null)
    .query(`UPDATE [JobCategory] SET categoryName = @categoryName, description = @description WHERE ID = @ID`);
}

async function deleteJobCategory(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [JobCategory] WHERE ID = @ID');
}

module.exports = {
  getAllJobCategories,
  getJobCategoryWithPagination,
  getJobCategoryById,
  createJobCategory,
  updateJobCategory,
  deleteJobCategory
}; 