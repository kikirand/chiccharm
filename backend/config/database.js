// ...existing code...
const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kiran@2529',
    database: 'chiccharm_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectToDatabase() {
    try {
        const connection = await db.getConnection();
        console.log('MySQL connected successfully');
        connection.release();
        return true;
    } catch (err) {
        console.error('MySQL connection failed:', err.message);
        return false;
    }
}

module.exports = db;
module.exports.connectToDatabase = connectToDatabase;