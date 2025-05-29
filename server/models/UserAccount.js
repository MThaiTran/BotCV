const { poolConnect, pool, sql } = require('../config/db');

async function getAllUsers() {
  await poolConnect;
  const result = await pool.request().query('SELECT * FROM [UserAccount]');
  return result.recordset;
}

async function getUserWithPagination(page = 1, limit = 5) {
  await poolConnect;
  const offset = (page - 1) * limit;
  const result = await pool.request()
    .input('offset', sql.Int, offset)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM [UserAccount] ORDER BY ID OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY; SELECT COUNT(*) AS total FROM [UserAccount];`);
  return { data: result.recordsets[0], total: result.recordsets[1][0].total };
}

async function getUserById(id) {
  await poolConnect;
  const result = await pool.request().input('ID', sql.Int, id).query('SELECT * FROM [UserAccount] WHERE ID = @ID');
  return result.recordset[0];
}

async function createUser(data) {
  await poolConnect;
  await pool.request()
    .input('email', data.email)
    .input('password', data.password)
    .input('profileimage', data.profileImage || null)
    .input('userType', data.userType || null)
    .input('registrationDate', data.registrationDate || null)
    .query(`INSERT INTO [UserAccount] (email, password, profileimage, userType, registrationDate) VALUES (@email, @password, @profileimage, @userType, @registrationDate)`);
}

async function updateUser(id, data) {
  await poolConnect;
  await pool.request()
    .input('ID', id)
    .input('email', data.email)
    .input('password', data.password)
    .input('profileimage', data.profileImage || null)
    .input('userType', data.userType || null)
    .input('registrationDate', data.registrationDate || null)
    .query(`UPDATE [UserAccount] SET email = @email, password = @password, profileimage = @profileimage, userType = @userType, registrationDate = @registrationDate WHERE ID = @ID`);
}

async function deleteUser(id) {
  await poolConnect;
  await pool.request().input('ID', sql.Int, id).query('DELETE FROM [UserAccount] WHERE ID = @ID');
}

module.exports = {
  getAllUsers,
  getUserWithPagination,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
