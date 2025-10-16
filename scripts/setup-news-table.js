const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function setupNewsTable() {
  let connection;
  
  try {
    console.log('📡 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'annai_school',
      port: parseInt(process.env.MYSQL_PORT || '3306')
    });

    console.log('✅ Connected to MySQL');
    console.log('📝 Creating news table...');

    // Read SQL file
    const sqlFile = path.join(__dirname, 'create-news-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log('✅ News table created successfully!');
    console.log('✅ Sample news items inserted!');
    console.log('');
    console.log('🎉 Setup complete! You can now use the News Management page.');
    
  } catch (error) {
    console.error('❌ Error setting up news table:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupNewsTable();
