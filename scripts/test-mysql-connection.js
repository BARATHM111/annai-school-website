#!/usr/bin/env node

/**
 * Test MySQL Connection Script
 * Tests connection to your existing MySQL database
 */

// Try to use mysql first, then mysql2
let mysql;
try {
  const mysqlClassic = require('mysql');
  // Create a promise wrapper for classic mysql
  mysql = {
    createConnection: (config) => {
      const connection = mysqlClassic.createConnection(config);
      return {
        execute: (sql, params) => {
          return new Promise((resolve, reject) => {
            connection.query(sql, params, (error, results, fields) => {
              if (error) reject(error);
              else resolve([results, fields]);
            });
          });
        },
        end: () => {
          return new Promise((resolve) => {
            connection.end(() => resolve());
          });
        }
      };
    }
  };
} catch (error) {
  mysql = require('mysql2/promise');
}
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

async function testConnection() {
  console.log('🔍 Testing MySQL connection...\n');
  
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
    console.log(`  Port: ${config.port}`);
    console.log(`  User: ${config.user}`);
    console.log(`  Database: ${config.database}\n`);

    // Create connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL successfully!\n');

    // Test database queries
    console.log('🔍 Testing database queries...\n');

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Available tables:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    // Check student table structure
    console.log('\n📋 Student table info:');
    const [studentCount] = await connection.execute('SELECT COUNT(*) as count FROM student');
    console.log(`  Records: ${studentCount[0].count}`);

    // Check admin table
    console.log('\n👨‍💼 Admin table info:');
    const [adminCount] = await connection.execute('SELECT COUNT(*) as count FROM admin');
    console.log(`  Records: ${adminCount[0].count}`);

    // Check news table
    console.log('\n📰 News table info:');
    const [newsCount] = await connection.execute('SELECT COUNT(*) as count FROM newsevent');
    console.log(`  Records: ${newsCount[0].count}`);

    // Check announcements table
    console.log('\n📢 Announcements table info:');
    const [announcementCount] = await connection.execute('SELECT COUNT(*) as count FROM announcement');
    console.log(`  Records: ${announcementCount[0].count}`);

    await connection.end();
    console.log('\n🎉 All tests passed! MySQL connection is working properly.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check your .env file has correct DATABASE_URL');
    console.error('2. Ensure MySQL server is running');
    console.error('3. Verify database credentials');
    console.error('4. Check if database "annai_school" exists');
    process.exit(1);
  }
}

// Run the test
testConnection();
