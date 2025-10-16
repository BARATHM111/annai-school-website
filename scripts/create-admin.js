#!/usr/bin/env node

/**
 * Create Default Admin User Script
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Parse DATABASE_URL
function parseDatabaseUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  return {
    host: match[3],
    port: parseInt(match[4]),
    user: match[1],
    password: match[2],
    database: match[5]
  };
}

async function createDefaultAdmin() {
  console.log('🔧 Creating default admin user...\n');
  
  try {
    // Get connection config from environment
    const config = process.env.DATABASE_URL 
      ? parseDatabaseUrl(process.env.DATABASE_URL)
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'annai_school'
        };

    console.log('📋 Connection Config:');
    console.log(`  Host: ${config.host}`);
    console.log(`  Database: ${config.database}\n`);

    // Create connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!\n');

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT * FROM admin WHERE email = ?',
      ['admin@annaischool.edu']
    );

    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin user already exists: admin@annaischool.edu');
      console.log('   Password: admin123\n');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const adminId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      await connection.execute(`
        INSERT INTO admin (id, name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `, [
        adminId,
        'School Administrator',
        'admin@annaischool.edu',
        hashedPassword,
        'admin'
      ]);

      console.log('✅ Default admin user created successfully!');
      console.log('   Email: admin@annaischool.edu');
      console.log('   Password: admin123\n');
    }

    // Show current admin count
    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM admin');
    console.log(`📊 Total admin users: ${adminCount[0].count}`);

    await connection.end();
    console.log('\n🎉 Admin setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your .env file has correct DATABASE_URL');
    console.error('2. Ensure MySQL server is running');
    console.error('3. Verify database credentials');
    console.error('4. Check if database "annai_school" exists');
    process.exit(1);
  }
}

// Run the script
createDefaultAdmin();
